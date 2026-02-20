import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket, DollarSign, Clock, Upload, X, Loader2, ArrowRight, Settings, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { uploadToIPFS, uploadEventMetadata } from '@/lib/ipfs';
import { useBalance } from 'wagmi';
import { useWallet } from '@/hooks/useWallet';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import { usePrices } from '@/hooks/usePrices';
import { usePrivyTransaction, EVENT_ABI } from '@/hooks/usePrivyTransaction';

const eventSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location is required'),
  ticketPrice: z.string().min(1, 'Ticket price is required'),
  totalTickets: z.string().min(1, 'Total tickets is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  saleStartTime: z.string().min(1, 'Sale start time is required'),
  saleEndTime: z.string().min(1, 'Sale end time is required'),
  groupBuyDiscount: z.string().optional(),
  maxResalePrice: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export default function CreateEvent() {
  const navigate = useNavigate();
  const { address, chainId, switchNetwork, isConnected, isReady } = useWallet();
  const { writeContract, isLoading: isTxLoading } = usePrivyTransaction();
  const { prices } = usePrices();
  const { data: balance } = useBalance({
    address: address as `0x${string}`,
    chainId: 421614,
    query: { enabled: !!address }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [resaleEnabled, setResaleEnabled] = useState(false);
  const [groupBuyEnabled, setGroupBuyEnabled] = useState(false);
  const [txHash, setTxHash] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getDefaultEventDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  const getDefaultSaleStart = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  const getDefaultSaleEnd = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      eventDate: getDefaultEventDate(),
      saleStartTime: getDefaultSaleStart(),
      saleEndTime: getDefaultSaleEnd(),
    },
  });

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: EventFormData) => {
    if (!isReady) {
      toast.error('Wallet is still loading, please wait...');
      return;
    }
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Check if user is on Arbitrum Sepolia
    if (chainId !== 421614) {
      toast.error('Please switch to Arbitrum Sepolia testnet to create events');
      await switchNetwork(421614);
      return;
    }

    // Check if user has enough ETH for gas (minimum 0.001 ETH)
    const balanceETH = balance ? parseFloat(balance.formatted) : 0;
    if (balanceETH < 0.001) {
      toast.error('Insufficient ETH for gas. Please get some test ETH from a faucet.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      let uploadedImageURI = imagePreview;
      
      if (imageFile) {
        try {
          const ipfsUrl = await uploadToIPFS(imageFile);
          if (ipfsUrl) {
            uploadedImageURI = ipfsUrl;
          }
        } catch (ipfsError) {
          console.error('IPFS upload failed, using preview URL:', ipfsError);
        }
      }

      const ethPrice = prices.ETH || 2500;
      const ticketPriceInEth = parseFloat(data.ticketPrice) / ethPrice;
      const ticketPriceWei = BigInt(Math.floor(ticketPriceInEth * 1e18));
      const maxResalePriceWei = resaleEnabled && data.maxResalePrice 
        ? BigInt(Math.floor(parseFloat(data.maxResalePrice) / ethPrice * 1e18))
        : BigInt(0);
      const groupBuyDiscountBps = groupBuyEnabled && data.groupBuyDiscount 
        ? BigInt(Math.floor(parseFloat(data.groupBuyDiscount) * 100))
        : BigInt(0);

      const metadata = {
        name: data.name,
        description: data.description,
        image: uploadedImageURI,
        location: data.location,
        eventDate: new Date(data.eventDate).toISOString(),
        ticketPrice: ticketPriceWei.toString(),
        ticketPriceUSD: data.ticketPrice,
        totalTickets: parseInt(data.totalTickets),
        organizer: address || '',
      };

      let metadataURI = '';
      try {
        metadataURI = await uploadEventMetadata(metadata) || '';
      } catch (metaError) {
        console.error('Metadata upload failed:', metaError);
      }

      const tx = await writeContract(
        EVENT_ABI,
        'createEvent',
        [
          data.name,
          data.description,
          uploadedImageURI,
          data.location,
          ticketPriceWei,
          BigInt(data.totalTickets),
          BigInt(Math.floor(new Date(data.eventDate).getTime() / 1000)),
          BigInt(Math.floor(new Date(data.saleStartTime).getTime() / 1000)),
          BigInt(Math.floor(new Date(data.saleEndTime).getTime() / 1000)),
          ZERO_ADDRESS,
          resaleEnabled,
          maxResalePriceWei,
          groupBuyDiscountBps,
        ]
      );

      if (!tx) {
        setIsLoading(false);
        return;
      }

      setTxHash(tx);
      toast.success('Event created successfully!');
      
      if (tx) {
        toast.message('Transaction Hash', { description: tx });
      }
      
      // Redirect to marketplace after a short delay
      setTimeout(() => {
        navigate('/marketplace');
      }, 2000);
    } catch (error: any) {
      console.error('Failed to create event:', error);
      
      // Extract contract revert message if available
      let errorMessage = 'Failed to create event.';
      
      if (error?.message) {
        // Check for common contract revert patterns
        if (error.message.includes('Sale must start')) {
          errorMessage = 'Sale start time must be in the past or present. Please adjust your sale timing.';
        } else if (error.message.includes('Sale end time')) {
          errorMessage = 'Sale end time must be after the sale start time.';
        } else if (error.message.includes('Event date')) {
          errorMessage = 'Event date must be in the future.';
        } else if (error.message.includes('Insufficient')) {
          errorMessage = 'Insufficient ETH for gas. Please get more test ETH.';
        } else if (error.message.includes('User rejected')) {
          errorMessage = 'Transaction was rejected. Please try again.';
        } else {
          // Try to extract revert reason from error message
          const match = error.message.match(/reason[:"]+([^"]+)/i);
          if (match) {
            errorMessage = `Error: ${match[1]}`;
          }
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getTodayDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const getTomorrowDateTime = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setMinutes(tomorrow.getMinutes() - tomorrow.getTimezoneOffset());
    return tomorrow.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-copper-50/30 pt-20 pb-8 md:pt-24 md:pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="h-4 md:h-6 w-px bg-muted-foreground/30" />
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
          </div>

          <div className="mb-6 md:mb-8">
            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">Create Event</h1>
            <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
              Set up your event and start selling tickets in minutes
            </p>
          </div>

          {chainId !== 421614 && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-red-400">Wrong Network Detected</p>
                  <p className="text-xs text-muted-foreground">Please switch to Arbitrum Sepolia testnet to create events</p>
                </div>
                <Button
                  onClick={() => switchNetwork(421614)}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Switch Network
                </Button>
              </div>
            </div>
          )}

          {address && balance && parseFloat(balance.formatted) < 0.001 && (
            <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-yellow-400">Low Balance</p>
                  <p className="text-xs text-muted-foreground">
                    Your balance: {balance.formatted.slice(0, 6)} ETH - You need at least 0.001 ETH for gas
                  </p>
                </div>
                <a
                  href="https://faucet.quicknode.com/arbitrum/sepolia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  Get Test ETH
                </a>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Tabs defaultValue="basic" className="space-y-4 md:space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-copper-100 p-1 h-auto">
                <TabsTrigger value="basic" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-1.5 md:py-2 text-[10px] md:text-xs px-1 md:px-2">
                  <Ticket className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Basic Info</span>
                  <span className="sm:hidden">Basic</span>
                </TabsTrigger>
                <TabsTrigger value="tickets" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-1.5 md:py-2 text-[10px] md:text-xs px-1 md:px-2">
                  <DollarSign className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Tickets</span>
                  <span className="sm:hidden">$</span>
                </TabsTrigger>
                <TabsTrigger value="resale" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-1.5 md:py-2 text-[10px] md:text-xs px-1 md:px-2">
                  <Settings className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Resale</span>
                  <span className="sm:hidden">Resale</span>
                </TabsTrigger>
                <TabsTrigger value="review" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-1.5 md:py-2 text-[10px] md:text-xs px-1 md:px-2">
                  <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Review</span>
                  <span className="sm:hidden">Review</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <Card className="border-copper-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base md:text-lg">Basic Information</CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Enter the basic details about your event
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6">
                    <div className="space-y-1.5 md:space-y-2">
                      <Label htmlFor="name" className="text-xs md:text-sm">Event Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Summer Music Festival 2024"
                        {...register('name')}
                        className={`text-sm md:text-base ${errors.name ? 'border-red-500' : ''}`}
                      />
                      {errors.name && (
                        <p className="text-xs md:text-sm text-red-500">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                      <Label htmlFor="description" className="text-xs md:text-sm">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Tell attendees what your event is about..."
                        rows={3}
                        {...register('description')}
                        className={`text-sm md:text-base ${errors.description ? 'border-red-500' : ''}`}
                      />
                      {errors.description && (
                        <p className="text-xs md:text-sm text-red-500">{errors.description.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                      <Label htmlFor="location" className="text-xs md:text-sm">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          placeholder="Venue name and address"
                          {...register('location')}
                          className={`pl-10 text-sm md:text-base ${errors.location ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.location && (
                        <p className="text-xs md:text-sm text-red-500">{errors.location.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                      <Label className="text-xs md:text-sm">Event Image</Label>
                      <div 
                        className="border-2 border-dashed border-copper-200 rounded-lg p-4 md:p-8 text-center hover:border-copper-400 transition-colors cursor-pointer"
                        onClick={handleImageClick}
                      >
                        {imagePreview ? (
                          <div className="relative">
                            <img src={imagePreview} alt="Event" className="max-h-32 md:max-h-48 mx-auto rounded-lg" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage();
                              }}
                              className="absolute top-1 md:top-2 right-1 md:right-2 bg-red-500 text-white p-1 rounded-full"
                            >
                              <X className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1 md:space-y-2">
                            <Upload className="w-6 h-6 md:w-8 md:h-8 mx-auto text-muted-foreground" />
                            <p className="text-xs md:text-sm text-muted-foreground">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-[10px] md:text-xs text-muted-foreground">
                              PNG, JPG up to 10MB
                            </p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                      <Label htmlFor="eventDate" className="text-xs md:text-sm">Event Date & Time</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="eventDate"
                          type="datetime-local"
                          min={getTodayDateTime()}
                          {...register('eventDate')}
                          className={`pl-10 text-sm md:text-base ${errors.eventDate ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.eventDate && (
                        <p className="text-xs md:text-sm text-red-500">{errors.eventDate.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tickets">
                <Card className="border-copper-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base md:text-lg">Ticket Settings</CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Configure your ticket pricing and availability
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1.5 md:space-y-2">
                        <Label htmlFor="ticketPrice" className="text-xs md:text-sm">Ticket Price (USD)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="ticketPrice"
                            type="number"
                            step="0.001"
                            min="0"
                            placeholder="0.05"
                            {...register('ticketPrice')}
                            className={`pl-10 text-sm md:text-base ${errors.ticketPrice ? 'border-red-500' : ''}`}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 md:space-y-2">
                        <Label htmlFor="totalTickets" className="text-xs md:text-sm">Total Tickets</Label>
                        <div className="relative">
                          <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="totalTickets"
                            type="number"
                            min="1"
                            placeholder="100"
                            {...register('totalTickets')}
                            className={`pl-10 text-sm md:text-base ${errors.totalTickets ? 'border-red-500' : ''}`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1.5 md:space-y-2">
                        <Label htmlFor="saleStartTime" className="text-xs md:text-sm">Sale Start</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="saleStartTime"
                            type="datetime-local"
                            min={getTodayDateTime()}
                            {...register('saleStartTime')}
                            className="pl-10 text-sm md:text-base"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 md:space-y-2">
                        <Label htmlFor="saleEndTime" className="text-xs md:text-sm">Sale End</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="saleEndTime"
                            type="datetime-local"
                            min={getTodayDateTime()}
                            {...register('saleEndTime')}
                            className="pl-10 text-sm md:text-base"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 md:space-y-4 pt-3 md:pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-xs md:text-sm">Enable Group Buy</Label>
                          <p className="text-[10px] md:text-sm text-muted-foreground">
                            Allow users to pool together for discounted tickets
                          </p>
                        </div>
                        <Switch
                          checked={groupBuyEnabled}
                          onCheckedChange={setGroupBuyEnabled}
                        />
                      </div>

                      {groupBuyEnabled && (
                        <div className="space-y-1.5 md:space-y-2">
                          <Label htmlFor="groupBuyDiscount" className="text-xs md:text-sm">Group Buy Discount (USD)</Label>
                          <Input
                            id="groupBuyDiscount"
                            type="number"
                            step="0.001"
                            min="0"
                            placeholder="0.01"
                            {...register('groupBuyDiscount')}
                            className="text-sm md:text-base"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resale">
                <Card className="border-copper-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base md:text-lg">Resale Settings</CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Control how tickets can be resold on the marketplace
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-xs md:text-sm">Enable Resale</Label>
                        <p className="text-[10px] md:text-sm text-muted-foreground">
                          Allow ticket holders to list their tickets for sale
                        </p>
                      </div>
                      <Switch
                        checked={resaleEnabled}
                        onCheckedChange={setResaleEnabled}
                      />
                    </div>

                    {resaleEnabled && (
                      <div className="space-y-1.5 md:space-y-2">
                        <Label htmlFor="maxResalePrice" className="text-xs md:text-sm">Maximum Resale Price (USD)</Label>
                        <Input
                          id="maxResalePrice"
                          type="number"
                          step="0.001"
                          min="0"
                          placeholder="0.10"
                          {...register('maxResalePrice')}
                          className="text-sm md:text-base"
                        />
                        <p className="text-[10px] md:text-sm text-muted-foreground">
                          Set a cap to prevent scalping. Leave empty for no limit.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="review">
                <Card className="border-copper-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base md:text-lg">Review & Publish</CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Review your event details before publishing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6">
                    <div className="bg-muted rounded-lg p-3 md:p-4 space-y-3 md:space-y-4">
                      <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
                        <div>
                          <p className="text-muted-foreground">Event Name</p>
                          <p className="font-medium">{watch('name') || '-'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Location</p>
                          <p className="font-medium">{watch('location') || '-'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Ticket Price</p>
                          <p className="font-medium">{watch('ticketPrice') || '-'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Tickets</p>
                          <p className="font-medium">{watch('totalTickets') || '-'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Event Date</p>
                          <p className="font-medium">{watch('eventDate') || '-'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Resale</p>
                          <p className="font-medium">{resaleEnabled ? 'Enabled' : 'Disabled'}</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-copper hover:opacity-90 text-white font-semibold py-4 md:py-6 text-sm md:text-base"
                      style={{ background: 'linear-gradient(135deg, #B87333 0%, #D4894A 100%)' }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2 animate-spin" />
                          Creating Event...
                        </>
                      ) : (
                        <>
                          Create Event
                          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-1.5 md:ml-2" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

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
import { uploadToIPFS } from '@/lib/ipfs';
import { arbitrumSepolia } from 'wagmi/chains';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useWallet } from '@/hooks/useWallet';
import { CONTRACT_ADDRESSES } from '@/config/contracts';

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

const EVENT_ABI = [
  {
    name: 'createEvent',
    type: 'function',
    inputs: [
      { name: '_name', type: 'string' },
      { name: '_description', type: 'string' },
      { name: '_imageURI', type: 'string' },
      { name: '_location', type: 'string' },
      { name: '_ticketPrice', type: 'uint256' },
      { name: '_totalTickets', type: 'uint256' },
      { name: '_eventDate', type: 'uint256' },
      { name: '_saleStartTime', type: 'uint256' },
      { name: '_saleEndTime', type: 'uint256' },
      { name: '_paymentToken', type: 'address' },
      { name: '_resaleEnabled', type: 'bool' },
      { name: '_maxResalePrice', type: 'uint256' },
      { name: '_groupBuyDiscount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
] as const;

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export default function CreateEvent() {
  const navigate = useNavigate();
  const { address } = useWallet();
  const { writeContractAsync } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [resaleEnabled, setResaleEnabled] = useState(false);
  const [groupBuyEnabled, setGroupBuyEnabled] = useState(false);
  const [txHash, setTxHash] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      eventDate: '',
      saleStartTime: '',
      saleEndTime: '',
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
    if (!address) {
      toast.error('Please connect your wallet first');
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

      const ticketPriceWei = BigInt(Math.floor(parseFloat(data.ticketPrice) * 1e18));
      const maxResalePriceWei = resaleEnabled && data.maxResalePrice 
        ? BigInt(Math.floor(parseFloat(data.maxResalePrice) * 1e18))
        : BigInt(0);
      const groupBuyDiscountBps = groupBuyEnabled && data.groupBuyDiscount 
        ? BigInt(Math.floor(parseFloat(data.groupBuyDiscount) * 100))
        : BigInt(0);

      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESSES.event as `0x${string}`,
        abi: EVENT_ABI,
        functionName: 'createEvent',
        chain: arbitrumSepolia,
        args: [
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
        ],
      } as any);

      setTxHash(tx);
      toast.success('Event created! Transaction submitted.');
      
      if (tx) {
        toast.message('Transaction Hash', { description: tx });
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error('Failed to create event. See console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTodayDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-copper-50/30 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div className="h-6 w-px bg-muted-foreground/30" />
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-5 h-5" />
              Home
            </button>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold text-foreground">Create Event</h1>
            <p className="text-muted-foreground mt-2">
              Set up your event and start selling tickets in minutes
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-copper-100 p-1 h-auto">
                <TabsTrigger value="basic" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
                  <Ticket className="w-4 h-4 mr-2" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="tickets" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Tickets
                </TabsTrigger>
                <TabsTrigger value="resale" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
                  <Settings className="w-4 h-4 mr-2" />
                  Resale
                </TabsTrigger>
                <TabsTrigger value="review" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Review
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <Card className="border-copper-200 shadow-sm">
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Enter the basic details about your event
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Event Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Summer Music Festival 2024"
                        {...register('name')}
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Tell attendees what your event is about..."
                        rows={4}
                        {...register('description')}
                        className={errors.description ? 'border-red-500' : ''}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">{errors.description.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          placeholder="Venue name and address"
                          {...register('location')}
                          className={`pl-10 ${errors.location ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.location && (
                        <p className="text-sm text-red-500">{errors.location.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Event Image</Label>
                      <div 
                        className="border-2 border-dashed border-copper-200 rounded-lg p-8 text-center hover:border-copper-400 transition-colors cursor-pointer"
                        onClick={handleImageClick}
                      >
                        {imagePreview ? (
                          <div className="relative">
                            <img src={imagePreview} alt="Event" className="max-h-48 mx-auto rounded-lg" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage();
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
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

                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Event Date & Time</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="eventDate"
                          type="datetime-local"
                          min={getTodayDateTime()}
                          {...register('eventDate')}
                          className={`pl-10 ${errors.eventDate ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.eventDate && (
                        <p className="text-sm text-red-500">{errors.eventDate.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tickets">
                <Card className="border-copper-200 shadow-sm">
                  <CardHeader>
                    <CardTitle>Ticket Settings</CardTitle>
                    <CardDescription>
                      Configure your ticket pricing and availability
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ticketPrice">Ticket Price (ETH)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="ticketPrice"
                            type="number"
                            step="0.001"
                            min="0"
                            placeholder="0.05"
                            {...register('ticketPrice')}
                            className={`pl-10 ${errors.ticketPrice ? 'border-red-500' : ''}`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="totalTickets">Total Tickets</Label>
                        <div className="relative">
                          <Ticket className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="totalTickets"
                            type="number"
                            min="1"
                            placeholder="100"
                            {...register('totalTickets')}
                            className={`pl-10 ${errors.totalTickets ? 'border-red-500' : ''}`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="saleStartTime">Sale Start</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="saleStartTime"
                            type="datetime-local"
                            min={getTodayDateTime()}
                            {...register('saleStartTime')}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="saleEndTime">Sale End</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="saleEndTime"
                            type="datetime-local"
                            min={getTodayDateTime()}
                            {...register('saleEndTime')}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Enable Group Buy</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow users to pool together for discounted tickets
                          </p>
                        </div>
                        <Switch
                          checked={groupBuyEnabled}
                          onCheckedChange={setGroupBuyEnabled}
                        />
                      </div>

                      {groupBuyEnabled && (
                        <div className="space-y-2">
                          <Label htmlFor="groupBuyDiscount">Group Buy Discount (ETH)</Label>
                          <Input
                            id="groupBuyDiscount"
                            type="number"
                            step="0.001"
                            min="0"
                            placeholder="0.01"
                            {...register('groupBuyDiscount')}
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
                    <CardTitle>Resale Settings</CardTitle>
                    <CardDescription>
                      Control how tickets can be resold on the marketplace
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Enable Resale</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow ticket holders to list their tickets for sale
                        </p>
                      </div>
                      <Switch
                        checked={resaleEnabled}
                        onCheckedChange={setResaleEnabled}
                      />
                    </div>

                    {resaleEnabled && (
                      <div className="space-y-2">
                        <Label htmlFor="maxResalePrice">Maximum Resale Price (ETH)</Label>
                        <Input
                          id="maxResalePrice"
                          type="number"
                          step="0.001"
                          min="0"
                          placeholder="0.10"
                          {...register('maxResalePrice')}
                        />
                        <p className="text-sm text-muted-foreground">
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
                    <CardTitle>Review & Publish</CardTitle>
                    <CardDescription>
                      Review your event details before publishing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-muted rounded-lg p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
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
                          <p className="font-medium">{watch('ticketPrice') || '-'} ETH</p>
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
                      className="w-full bg-gradient-copper hover:opacity-90 text-white font-semibold py-6"
                      style={{ background: 'linear-gradient(135deg, #B87333 0%, #D4894A 100%)' }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Creating Event...
                        </>
                      ) : (
                        <>
                          Create Event
                          <ArrowRight className="w-5 h-5 ml-2" />
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

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar, MapPin, Users, Shield, Clock, ArrowLeft,
  Ticket, Lock, Share2, Heart, Loader2, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TransactionTracker from "@/components/TransactionTracker";
import AnonymousRSVP from "@/components/AnonymousRSVP";
import Referral from "@/components/Referral";
import { getEvent, EventData } from "@/lib/alchemy";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";
import { usePrices } from "@/hooks/usePrices";
import { usePrivyTransaction, EVENT_ABI } from "@/hooks/usePrivyTransaction";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showTracker, setShowTracker] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  
  const { address, isConnected, isReady } = useWallet();
  const { writeContract, isLoading: isTxLoading } = usePrivyTransaction();
  const { prices } = usePrices();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const eventId = parseInt(id);
        const data = await getEvent(eventId);
        setEvent(data);
      } catch (error) {
        console.error("Failed to fetch event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBuyTicket = async () => {
    if (!isReady) {
      toast.error("Wallet is still loading, please wait...");
      return;
    }
    if (!address || !event) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsMinting(true);
    try {
      const pricePerTicket = BigInt(event.ticketPrice);
      const totalPrice = pricePerTicket * BigInt(quantity);

      const tx = await writeContract(
        EVENT_ABI,
        'purchaseTicket',
        [BigInt(event.eventId), BigInt(quantity)],
        totalPrice.toString(),
      );

      if (!tx) {
        setIsMinting(false);
        return;
      }

      setShowTracker(true);
      toast.success("Ticket purchase initiated!");
    } catch (error) {
      console.error("Failed to buy ticket:", error);
      toast.error("Failed to purchase ticket");
    } finally {
      setIsMinting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: string) => {
    const eth = parseFloat(price) / 1e18;
    const usd = eth * (prices.ETH || 2500);
    return `$${usd.toFixed(2)}`;
  };

  const getStatus = () => {
    if (!event) return { label: "Unknown", variant: "secondary" as const };
    const now = Math.floor(Date.now() / 1000);
    
    if (!event.isActive) {
      return { label: "Inactive", variant: "secondary" as const };
    }
    if (event.saleStartTime > now) {
      return { label: "Upcoming", className: "bg-blue-100 text-blue-700" };
    }
    if (event.saleEndTime < now) {
      return { label: "Ended", variant: "secondary" as const };
    }
    if (event.ticketsSold >= event.totalTickets) {
      return { label: "Sold Out", variant: "secondary" as const };
    }
    return { label: "On Sale", className: "bg-green-100 text-green-700" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-32 md:pt-40">
          <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 md:px-6 pt-32 md:pt-40 pb-16 md:pb-24 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">Event Not Found</h1>
          <p className="text-muted-foreground text-sm md:text-base mb-5 md:mb-6">The event you're looking for doesn't exist.</p>
          <Link to="/marketplace">
            <Button>Browse Events</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const status = getStatus();
  const pricePerTicket = formatPrice(event.ticketPrice);
  const totalPrice = (parseFloat(event.ticketPrice) / 1e18 * quantity).toFixed(4);
  const availableTickets = event.totalTickets - event.ticketsSold;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <TransactionTracker
        isOpen={showTracker}
        onClose={() => setShowTracker(false)}
        eventTitle={event.name}
        ticketTier="General Admission"
        price={`$${(parseFloat(totalPrice) * (prices.ETH || 2500)).toFixed(2)}`}
      />

      {/* Hero Banner */}
      <div className="relative h-[30vh] md:h-[40vh] lg:h-[50vh] overflow-hidden">
        {event.imageURI ? (
          <img src={event.imageURI} alt={event.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-copper-100 to-copper-200 flex items-center justify-center">
            <Ticket className="h-16 w-16 md:h-20 md:h-24 lg:h-24 text-copper-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute top-20 md:top-24 left-4 md:left-6">
          <Link to="/marketplace" className="inline-flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors bg-card/80 backdrop-blur rounded-lg px-2.5 md:px-3 py-1.5">
            <ArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4" /> Back
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-24 md:-mt-32 relative z-10 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left: Event Info */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
                <Badge variant="secondary" className="bg-surface-elevated text-foreground text-[10px] md:text-xs">Event</Badge>
                {event.groupBuyDiscount && parseInt(event.groupBuyDiscount) > 0 && (
                  <Badge className="bg-primary/10 text-primary border border-primary/20 gap-1 text-[10px] md:text-xs">
                    <Users className="h-2.5 w-2.5 md:h-3 md:w-3" /> Group Buy
                  </Badge>
                )}
                <Badge variant="outline" className="border-copper/30 text-copper-light text-[10px] md:text-xs">Arbitrum Orbit</Badge>
              </div>
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground">{event.name}</h1>
              <p className="text-muted-foreground text-sm md:text-base mt-1">by {event.organizer}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {[
                { icon: Calendar, label: formatDate(event.eventDate) },
                { icon: Clock, label: formatTime(event.eventDate) },
                { icon: MapPin, label: event.location },
                { icon: Users, label: `${event.ticketsSold.toLocaleString()} / ${event.totalTickets.toLocaleString()}` },
              ].map((item) => (
                <div key={item.label} className="rounded-lg md:rounded-xl border border-border bg-card p-2.5 md:p-4">
                  <item.icon className="h-4 w-4 md:h-5 md:w-5 text-primary mb-1 md:mb-2" />
                  <p className="text-xs md:text-sm text-foreground leading-snug truncate">{item.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-4 md:p-6">
              <h2 className="font-display text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">About This Event</h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{event.description}</p>
              <div className="flex items-center gap-2 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border">
                <Shield className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary flex-shrink-0" />
                <span className="text-xs md:text-sm text-muted-foreground">NFT-based tickets on Arbitrum · Resale protection enabled</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <AnonymousRSVP eventId={event.eventId} eventName={event.name} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Referral eventId={event.eventId} eventName={event.name} />
            </motion.div>
          </div>

          {/* Right: Purchase Panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 md:p-6 sticky top-20 md:top-24">
              <h3 className="font-display text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">Get Tickets</h3>

              {/* Ticket Type */}
              <div className="rounded-xl border border-primary bg-primary/5 p-3 md:p-4 mb-4 md:mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-display font-semibold text-sm md:text-base text-foreground">General Admission</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{availableTickets.toLocaleString()} of {event.totalTickets.toLocaleString()} left</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-primary text-sm md:text-base">{pricePerTicket}</p>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <span className="text-sm text-muted-foreground">Quantity</span>
                <div className="flex items-center gap-2 md:gap-3">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    disabled={quantity <= 1}
                    className="h-8 w-8 rounded-lg border border-border bg-muted flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-50 text-sm md:text-base"
                  >
                    −
                  </button>
                  <span className="font-display font-semibold text-foreground w-5 md:w-6 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(4, quantity + 1))} 
                    disabled={quantity >= 4 || quantity >= availableTickets}
                    className="h-8 w-8 rounded-lg border border-border bg-muted flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-50 text-sm md:text-base"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-3 md:mb-4 pb-3 md:pb-4 border-b border-border">
                <span className="text-sm md:text-base text-muted-foreground">Total</span>
                <span className="font-display text-lg md:text-xl font-bold text-foreground">
                  ${(parseFloat(totalPrice) * (prices.ETH || 2500)).toFixed(2)}
                </span>
              </div>

              <Button
                onClick={handleBuyTicket}
                disabled={!isConnected || isMinting || availableTickets === 0 || !event.isActive}
                className="w-full bg-gradient-copper text-primary-foreground hover:opacity-90 shadow-copper py-4 md:py-6 text-sm md:text-base font-display font-semibold gap-2"
              >
                {isMinting ? (
                  <>
                    <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                    Processing...
                  </>
                ) : !isConnected ? (
                  <>
                    <Lock className="h-4 w-4 md:h-5 md:w-5" />
                    Connect Wallet
                  </>
                ) : availableTickets === 0 ? (
                  "Sold Out"
                ) : !event.isActive ? (
                  "Sales Closed"
                ) : (
                  <>
                    <Ticket className="h-4 w-4 md:h-5 md:w-5" />
                    Mint {quantity > 1 ? `${quantity} Tickets` : "Ticket"}
                  </>
                )}
              </Button>

              <div className="flex gap-2 mt-3">
                <Button variant="outline" className="flex-1 border-border text-muted-foreground hover:text-foreground gap-1.5 md:gap-2 py-4 md:py-5 text-xs md:text-sm" onClick={() => setLiked(!liked)}>
                  <Heart className={`h-3.5 w-3.5 md:h-4 md:w-4 ${liked ? "fill-primary text-primary" : ""}`} />
                  {liked ? "Saved" : "Save"}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-border text-muted-foreground hover:text-foreground gap-1.5 md:gap-2 py-4 md:py-5 text-xs md:text-sm"
                  onClick={() => {
                    const shareUrl = window.location.href;
                    if (navigator.share) {
                      navigator.share({
                        title: event.name,
                        text: `Check out this event: ${event.name}`,
                        url: shareUrl,
                      });
                    } else {
                      navigator.clipboard.writeText(shareUrl);
                      toast.success("Link copied to clipboard!");
                    }
                  }}
                >
                  <Share2 className="h-3.5 w-3.5 md:h-4 md:w-4" /> Share
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetail;

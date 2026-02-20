import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Ticket, Calendar, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getActiveEvents, EventData, getEventCount } from "@/lib/alchemy";
import { usePrices } from "@/hooks/usePrices";

const Hero = () => {
  const [featuredEvents, setFeaturedEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventCount, setEventCount] = useState<number>(0);
  const { prices } = usePrices();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activeEvents, count] = await Promise.all([
          getActiveEvents(),
          getEventCount()
        ]);
        setFeaturedEvents(activeEvents.slice(0, 3));
        setEventCount(count);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatPrice = (price: string) => {
    const eth = parseFloat(price) / 1e18;
    const usd = eth * prices.ETH;
    return `$${usd.toFixed(2)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://gateway.pinata.cloud/ipfs/bafybeibu24bwpmtttjtyakx4zboh2j75lqtd6eajvkmt5pel2bvlnr5k74" 
          alt="Paxr Event Ticketing" 
          className="w-full h-full object-cover opacity-40" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 pt-20 md:pt-24 pb-12 md:pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border border-copper/30 bg-surface-elevated px-3 py-1 mb-6 md:mb-8"
        >
          <Shield className="h-3 w-3 text-copper" />
          <span className="text-xs md:text-sm text-muted-foreground">Privacy-first • Anti-fraud • Decentralized</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 md:mb-6 tracking-tight"
        >
          <span className="text-white">The Future of</span>
          <br />
          <span className="text-gradient-copper">Event Ticketing</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="max-w-2xl mx-auto text-sm md:text-lg text-muted-foreground mb-8 md:mb-10"
        >
          NFT-powered tickets on Arbitrum with encrypted attendee data, anti-scalping protection, and cross-chain bridging. Own your ticket, prove your presence.
        </motion.p>

        {featuredEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mb-8 md:mb-10"
          >
            <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">Featured Events</p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              {featuredEvents.map((event) => (
                <Link
                  key={event.eventId}
                  to={`/event/${event.eventId}`}
                  className="group flex items-center gap-2 md:gap-4 bg-card/80 backdrop-blur-sm border border-border rounded-xl p-2 md:p-3 hover:border-copper/50 transition-all w-full max-w-sm"
                >
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    {event.imageURI ? (
                      <img src={event.imageURI} alt={event.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-copper">
                        <Ticket className="h-4 w-4 md:h-6 md:w-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <p className="font-medium text-sm md:text-base text-foreground group-hover:text-copper transition-colors line-clamp-1">{event.name}</p>
                    <div className="flex items-center gap-1 md:gap-2 text-xs text-muted-foreground mt-0.5 md:mt-1">
                      <Calendar className="h-2.5 w-2.5 md:h-3 md:w-3 flex-shrink-0" />
                      <span className="truncate">{formatDate(event.eventDate)}</span>
                      <span>•</span>
                      <span>{formatPrice(event.ticketPrice)}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground group-hover:text-copper transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
            <div className="mt-3 md:mt-4">
              <Button variant="link" className="text-copper text-sm" asChild>
                <Link to="/marketplace">
                  View More Events <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}

        {loading && (
          <div className="mb-10">
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-copper" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Loading events...</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center"
        >
          <Button 
            size="lg" 
            className="bg-gradient-copper text-white hover:opacity-90 shadow-copper gap-2 text-sm md:text-base px-6 md:px-8 py-4 md:py-6 rounded-full"
            asChild
          >
            <Link to="/marketplace">
              <Ticket className="h-4 w-4 md:h-5 md:w-5" />
              Explore Events
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-copper/30 text-foreground hover:bg-copper/10 gap-2 text-sm md:text-base px-6 md:px-8 py-4 md:py-6 rounded-full bg-transparent"
            asChild
          >
            <Link to="/create">
              Create Event
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="grid grid-cols-3 gap-4 md:gap-8 max-w-sm md:max-w-xl mx-auto mt-12 md:mt-20"
        >
          {[
            { value: eventCount > 0 ? eventCount.toString() : "—", label: "Events Created" },
            { value: featuredEvents.length > 0 ? featuredEvents.length.toString() : "—", label: "Active Events" },
            { value: "100%", label: "Secure" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-xl md:text-3xl lg:text-4xl font-bold text-gradient-copper">{stat.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

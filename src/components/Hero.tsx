import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Ticket, Calendar, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getActiveEvents, EventData } from "@/lib/alchemy";

const Hero = () => {
  const [featuredEvents, setFeaturedEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await getActiveEvents();
        setFeaturedEvents(events.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatPrice = (price: string) => {
    const eth = parseFloat(price) / 1e18;
    return `${eth.toFixed(4)} ETH`;
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
        <img src="/hero-bg.jpg" alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border border-copper/30 bg-surface-elevated px-4 py-1.5 mb-8"
        >
          <Shield className="h-4 w-4 text-copper" />
          <span className="text-sm text-muted-foreground">Privacy-first • Anti-fraud • Decentralized</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 tracking-tight"
        >
          <span className="text-white">The Future of</span>
          <br />
          <span className="text-gradient-copper">Event Ticketing</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10"
        >
          NFT-powered tickets on Arbitrum with encrypted attendee data, anti-scalping protection, and cross-chain bridging. Own your ticket, prove your presence.
        </motion.p>

        {featuredEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mb-10"
          >
            <p className="text-sm text-muted-foreground mb-4">Featured Events</p>
            <div className="flex flex-wrap justify-center gap-4">
              {featuredEvents.map((event) => (
                <Link
                  key={event.eventId}
                  to={`/event/${event.eventId}`}
                  className="group flex items-center gap-4 bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-3 hover:border-copper/50 transition-all"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted">
                    {event.imageURI ? (
                      <img src={event.imageURI} alt={event.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-copper">
                        <Ticket className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground group-hover:text-copper transition-colors line-clamp-1">{event.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(event.eventDate)}</span>
                      <span>•</span>
                      <span>{formatPrice(event.ticketPrice)}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-copper transition-colors" />
                </Link>
              ))}
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
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button 
            size="lg" 
            className="bg-gradient-copper text-white hover:opacity-90 shadow-copper gap-2 text-base px-8 py-6 rounded-full"
            asChild
          >
            <Link to="/marketplace">
              <Ticket className="h-5 w-5" />
              Explore Events
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-copper/30 text-foreground hover:bg-copper/10 gap-2 text-base px-8 py-6 rounded-full bg-transparent"
            asChild
          >
            <Link to="/create">
              Create Event
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="grid grid-cols-3 gap-8 max-w-xl mx-auto mt-20"
        >
          {[
            { value: "50K+", label: "Tickets Minted" },
            { value: "1.2K", label: "Events Live" },
            { value: "0%", label: "Fraud Rate" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl md:text-4xl font-bold text-gradient-copper">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

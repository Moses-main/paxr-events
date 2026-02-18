import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowUpRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getActiveEvents, EventData } from "@/lib/alchemy";
import { usePrices } from "@/hooks/usePrices";

const FeaturedEvents = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const { prices } = usePrices();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const activeEvents = await getActiveEvents();
        setEvents(activeEvents.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatPrice = (price: string) => {
    const eth = parseFloat(price) / 1e18;
    const usd = eth * prices.ETH;
    return `$${usd.toFixed(2)}`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Music: "bg-purple-100 text-purple-700",
      Conference: "bg-blue-100 text-blue-700",
      Art: "bg-pink-100 text-pink-700",
      Gaming: "bg-green-100 text-green-700",
      Tech: "bg-orange-100 text-orange-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center py-12 md:py-20">
            <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 md:mb-12 text-center">
            Featured <span className="text-gradient-copper">Events</span>
          </h2>
          <div className="text-center py-8 md:py-12">
            <p className="text-muted-foreground text-sm md:text-base">No active events yet. Create one to get started!</p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 mt-4 text-primary hover:underline text-sm md:text-base"
            >
              Create Event <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-background to-copper-50/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <img src="/hero-bg.jpg" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Featured <span className="text-gradient-copper">Events</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto text-sm md:text-base">
            Discover exclusive Web3 events powered by secure NFT ticketing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {events.map((event, i) => (
            <motion.div
              key={event.eventId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/event/${event.eventId}`}>
                <div className="group rounded-xl border border-border bg-card overflow-hidden hover:border-copper/30 transition-all hover:shadow-lg">
                  <div className="relative h-28 md:h-40 bg-muted">
                    {event.imageURI ? (
                      <img
                        src={event.imageURI}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-copper-100 to-copper-200">
                        <Calendar className="h-8 w-8 md:h-12 md:w-12 text-copper-400" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 md:top-3 md:left-3">
                      <Badge className={getCategoryColor("Event") + " text-[10px] md:text-xs px-1.5 md:px-2 py-0.5"}>
                        NFT Ticket
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-display font-semibold text-sm md:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {event.name}
                    </h3>
                    <div className="mt-2 md:mt-3 space-y-1 md:space-y-2">
                      <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                        <span className="truncate">{formatDate(event.eventDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>
                    <div className="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-border flex items-center justify-between">
                      <div>
                        <p className="text-[10px] md:text-xs text-muted-foreground">From</p>
                        <p className="font-display font-bold text-sm md:text-base text-foreground">
                          {formatPrice(event.ticketPrice)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] md:text-xs text-muted-foreground">Available</p>
                        <p className="font-medium text-xs md:text-sm text-foreground">
                          {event.totalTickets - event.ticketsSold}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-6 md:mt-10">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-primary hover:underline text-sm md:text-base"
          >
            View All Events <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;

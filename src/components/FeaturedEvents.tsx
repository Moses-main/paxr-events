import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowUpRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getActiveEvents, EventData } from "@/lib/alchemy";

const FeaturedEvents = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

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
    return `${eth.toFixed(4)} ETH`;
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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-foreground mb-12 text-center">
            Featured <span className="text-gradient-copper">Events</span>
          </h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No active events yet. Create one to get started!</p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
            >
              Create Event <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-copper-50/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Featured <span className="text-gradient-copper">Events</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Discover exclusive Web3 events powered by secure NFT ticketing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <div className="relative h-40 bg-muted">
                    {event.imageURI ? (
                      <img
                        src={event.imageURI}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-copper-100 to-copper-200">
                        <Calendar className="h-12 w-12 text-copper-400" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge className={getCategoryColor("Event")}>
                        NFT Ticket
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {event.name}
                    </h3>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.eventDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">From</p>
                        <p className="font-display font-bold text-foreground">
                          {formatPrice(event.ticketPrice)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Available</p>
                        <p className="font-medium text-foreground">
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

        <div className="text-center mt-10">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            View All Events <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;

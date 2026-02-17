import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield,
  AlertTriangle,
  Clock,
  TrendingUp,
  Search,
  Filter,
  Check,
  Lock,
  Loader2,
  Calendar,
  MapPin,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllEvents, EventData } from "@/lib/alchemy";
import { usePrices } from "@/hooks/usePrices";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const { prices } = usePrices();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filtered = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const getStatusBadge = (event: EventData) => {
    const now = Math.floor(Date.now() / 1000);
    if (!event.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (event.saleStartTime > now) {
      return <Badge className="bg-blue-100 text-blue-700">Upcoming</Badge>;
    }
    if (event.saleEndTime < now) {
      return <Badge variant="secondary">Ended</Badge>;
    }
    if (event.ticketsSold >= event.totalTickets) {
      return <Badge variant="secondary">Sold Out</Badge>;
    }
    return <Badge className="bg-green-100 text-green-700">On Sale</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-6 pt-28 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Event <span className="text-gradient-copper">Marketplace</span>
          </h1>
          <p className="text-muted-foreground mt-2 mb-8">
            Discover and purchase tickets for exclusive events
          </p>
        </motion.div>

        {/* Anti-scalping banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3 mb-8"
        >
          <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Secure Ticketing</p>
            <p className="text-sm text-muted-foreground">
              All tickets are NFT-based with verified ownership. Resale is protected with anti-scalping rules and price caps.
            </p>
          </div>
        </motion.div>

        {/* Search */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <Button variant="outline" className="border-border text-muted-foreground gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>

        {/* Events */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event, i) => (
              <motion.div
                key={event.eventId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/event/${event.eventId}`}>
                  <div className="rounded-xl border border-border bg-card overflow-hidden hover:border-copper/30 transition-all group h-full">
                    {/* Image */}
                    <div className="w-full h-40 bg-muted relative">
                      {event.imageURI ? (
                        <img
                          src={event.imageURI}
                          alt={event.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-copper-100 to-copper-200">
                          <Ticket className="h-12 w-12 text-copper-400" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        {getStatusBadge(event)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-1">
                        {event.name}
                      </h3>
                      
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(event.eventDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">Price</p>
                          <p className="font-display font-bold text-foreground">
                            {formatPrice(event.ticketPrice)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Available</p>
                          <p className="font-medium text-foreground">
                            {event.totalTickets - event.ticketsSold} / {event.totalTickets}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No events found.</p>
            {searchQuery && (
              <Button
                variant="link"
                onClick={() => setSearchQuery("")}
                className="mt-2 text-primary"
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Marketplace;

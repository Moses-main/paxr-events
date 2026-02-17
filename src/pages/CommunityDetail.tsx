import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Calendar, MapPin, MessageCircle, Share2, Loader2, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { getEvent, EventData } from "@/lib/alchemy";

const CommunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      const eventId = id.replace('event-', '');
      const numericId = parseInt(eventId);
      
      if (!isNaN(numericId)) {
        try {
          const eventData = await getEvent(numericId);
          setEvent(eventData);
        } catch (error) {
          console.error("Failed to fetch event:", error);
        }
      }
      setLoading(false);
    };
    
    fetchEvent();
  }, [id]);

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 pt-28 pb-24 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-copper" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-28 pb-24">
        <Link to="/communities">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Communities
          </Button>
        </Link>

        {event ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6">
                  {event.imageURI ? (
                    <img src={event.imageURI} alt={event.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-copper flex items-center justify-center">
                      <Hash className="h-20 w-20 text-white/50" />
                    </div>
                  )}
                </div>
                
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {event.name}
                </h1>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <Badge variant="secondary" className="bg-copper-100 text-copper-700">
                    Verified Community
                  </Badge>
                  <Badge variant="outline">
                    NFT Tickets
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-8">
                  {event.description || "Official fan community for this event. Connect with other attendees, get updates, and share your experience!"}
                </p>

                <div className="flex gap-4">
                  <Button className="bg-gradient-copper hover:opacity-90 text-white gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Join Discussion
                  </Button>
                  <Button variant="outline" className="border-border gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>

              <div>
                <Card className="border-border bg-card sticky top-24">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-copper-100 flex items-center justify-center">
                        <Hash className="h-6 w-6 text-copper" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{event.name} Fan Community</p>
                        <p className="text-sm text-muted-foreground">Official</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.eventDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location || "TBA"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{event.ticketsSold || 0} members</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Ticket Price</p>
                      <p className="font-display text-2xl font-bold text-foreground">
                        {formatPrice(event.ticketPrice)}
                      </p>
                    </div>

                    <Link to={`/event/${event.eventId}`}>
                      <Button className="w-full bg-gradient-copper hover:opacity-90 text-white">
                        View Event
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-foreground mb-4">Community Not Found</h2>
            <p className="text-muted-foreground mb-6">This community may have been removed or doesn't exist.</p>
            <Button asChild>
              <Link to="/communities">Browse Communities</Link>
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CommunityDetail;

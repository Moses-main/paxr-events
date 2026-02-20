import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, MessageCircle, Calendar, ArrowRight, Plus, Search, Hash, Crown, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Background from "@/components/Background";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllEvents, EventData } from "@/lib/alchemy";

interface Community {
  id: string;
  name: string;
  description: string;
  eventId?: number;
  eventName?: string;
  memberCount: number;
  isVerified: boolean;
  isOrganizer: boolean;
  lastActivity: string;
  location?: string;
  eventDate?: number;
  imageURI?: string;
}

const Communities = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const events = await getAllEvents();
        const now = Math.floor(Date.now() / 1000);
        
        const communityData: Community[] = events.map((event) => ({
          id: `event-${event.eventId}`,
          name: `${event.name} Fan Community`,
          description: event.description || `Official community for ${event.name}. Get updates, meet other attendees, and share experiences!`,
          eventId: event.eventId,
          eventName: event.name,
          memberCount: event.ticketsSold,
          isVerified: true,
          isOrganizer: event.organizer !== "0x0000000000000000000000000000000000000000",
          lastActivity: event.eventDate > now ? "Upcoming" : "Past event",
          location: event.location,
          eventDate: event.eventDate,
          imageURI: event.imageURI,
        }));
        
        setCommunities(communityData);
      } catch (error) {
        console.error("Failed to fetch communities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunities();
  }, []);

  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoin = (communityId: string) => {
    if (joinedCommunities.includes(communityId)) {
      setJoinedCommunities(joinedCommunities.filter((id) => id !== communityId));
    } else {
      setJoinedCommunities([...joinedCommunities, communityId]);
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Background>
      <Navbar />

      <div className="container mx-auto px-6 pt-28 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Fan <span className="text-gradient-copper">Communities</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Join communities based on real events, connect with attendees, and stay updated
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4 mb-8"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-copper" />
            <span className="ml-3 text-muted-foreground">Loading communities...</span>
          </div>
        ) : filteredCommunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community, i) => (
            <motion.div
              key={community.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-border bg-card hover:border-copper/30 transition-all h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                        {community.imageURI ? (
                          <img src={community.imageURI} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Hash className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {community.name}
                          {community.isVerified && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                              Verified
                            </Badge>
                          )}
                        </CardTitle>
                      </div>
                    </div>
                    {community.isOrganizer && (
                      <Badge className="bg-copper-100 text-copper-700">
                        <Crown className="h-3 w-3 mr-1" />
                        Host
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="mt-2">{community.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {community.eventDate && (
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(community.eventDate)}</span>
                    </div>
                  )}
                  {community.location && (
                    <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="line-clamp-1">{community.location}</span>
                    </div>
                  )}
                  {community.eventName && (
                    <div className="mb-3">
                      <Link
                        to={`/event/${community.eventId}`}
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        {community.eventName}
                      </Link>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{community.memberCount.toLocaleString()} members</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{community.lastActivity}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={joinedCommunities.includes(community.id) ? "secondary" : "default"}
                      className={`flex-1 gap-2 ${
                        joinedCommunities.includes(community.id)
                          ? ""
                          : "bg-gradient-copper hover:opacity-90 text-white"
                      }`}
                      onClick={() => handleJoin(community.id)}
                    >
                      {joinedCommunities.includes(community.id) ? (
                        <>
                          <MessageCircle className="h-4 w-4" />
                          Joined
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Join
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="border-border" asChild>
                      <Link to={`/community/${community.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No communities found</h3>
            <p className="text-muted-foreground mb-4">Create an event to start a community</p>
          </div>
        )}
      </div>

      <Footer />
    </Background>
  );
};

export default Communities;

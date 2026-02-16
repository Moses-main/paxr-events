import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, MessageCircle, Calendar, ArrowRight, Plus, Search, Hash, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
}

const mockCommunities: Community[] = [
  {
    id: "1",
    name: "Neon Horizons Fan Club",
    description: "Official community for Neon Horizons Festival. Get updates, meet other attendees, and share experiences!",
    eventId: 1,
    eventName: "Neon Horizons Festival",
    memberCount: 1247,
    isVerified: true,
    isOrganizer: true,
    lastActivity: "2 min ago",
  },
  {
    id: "2",
    name: "EDM Enthusiasts",
    description: "Electronic dance music lovers unite! Share tracks, discover events, and connect with fellow EDM fans.",
    memberCount: 8934,
    isVerified: false,
    isOrganizer: false,
    lastActivity: "5 min ago",
  },
  {
    id: "3",
    name: "Web3 Events Hub",
    description: "Discover the latest Web3 events, NFT drops, and crypto-native experiences worldwide.",
    memberCount: 5621,
    isVerified: true,
    isOrganizer: false,
    lastActivity: "12 min ago",
  },
  {
    id: "4",
    name: "Music Festival Travelers",
    description: "Planning to attend multiple festivals this year? Share tips, find travel buddies, and save on costs!",
    memberCount: 3428,
    isVerified: false,
    isOrganizer: false,
    lastActivity: "1 hour ago",
  },
  {
    id: "5",
    name: "Arbitrum Events",
    description: "All things happening on Arbitrum. Find events, build on Arbitrum, and connect with the community.",
    memberCount: 7892,
    isVerified: true,
    isOrganizer: false,
    lastActivity: "3 min ago",
  },
  {
    id: "6",
    name: "VIP Ticket Holders",
    description: "Exclusive community for VIP ticket holders. Connect with fellow VIPs and access special perks.",
    memberCount: 456,
    isVerified: true,
    isOrganizer: true,
    lastActivity: "Just now",
  },
];

const Communities = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);

  const filteredCommunities = mockCommunities.filter(
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

  return (
    <div className="min-h-screen bg-background">
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
            Join communities, connect with fellow attendees, and stay updated on events
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
          <Button className="bg-gradient-copper hover:opacity-90 text-white gap-2">
            <Plus className="h-4 w-4" />
            Create Community
          </Button>
        </motion.div>

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
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Hash className="h-5 w-5 text-primary" />
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
                  {community.eventName && (
                    <div className="mb-3">
                      <Link
                        to={`/event/${community.eventId}`}
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <Calendar className="h-3 w-3" />
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

        {filteredCommunities.length === 0 && (
          <div className="text-center py-16">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No communities found</h3>
            <p className="text-muted-foreground mb-4">Try a different search or create a new community</p>
            <Button className="bg-gradient-copper hover:opacity-90 text-white gap-2">
              <Plus className="h-4 w-4" />
              Create Community
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Communities;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Calendar, DollarSign, Users, Ticket, TrendingUp, 
  TrendingDown, ArrowUpRight, ArrowDownRight, BarChart3,
  PieChart, Activity, Wallet, ExternalLink, Loader2,
  ArrowRight, Settings, Eye, Edit, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWallet } from "@/hooks/useWallet";
import { getAllEvents, EventData } from "@/lib/alchemy";

interface OrganizerEvent {
  id: number;
  name: string;
  ticketsSold: number;
  totalTickets: number;
  revenue: string;
  status: "active" | "upcoming" | "ended";
  date: string;
}

interface AnalyticsData {
  totalRevenue: string;
  totalTicketsSold: number;
  totalEvents: number;
  averageTicketPrice: string;
  revenueChange: number;
  ticketsChange: number;
}

const mockAnalytics: AnalyticsData = {
  totalRevenue: "12.45 ETH",
  totalTicketsSold: 1247,
  totalEvents: 8,
  averageTicketPrice: "0.05 ETH",
  revenueChange: 12.5,
  ticketsChange: 8.3,
};

const mockRevenueData = [
  { month: "Jan", revenue: 1.2 },
  { month: "Feb", revenue: 1.8 },
  { month: "Mar", revenue: 2.4 },
  { month: "Apr", revenue: 1.9 },
  { month: "May", revenue: 2.1 },
  { month: "Jun", revenue: 3.05 },
];

const OrganizerDashboard = () => {
  const { address, isConnected } = useWallet();
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      if (!address) {
        setLoading(false);
        return;
      }
      
      try {
        const allEvents = await getAllEvents();
        const organizerEvents: OrganizerEvent[] = allEvents
          .filter(e => e.organizer.toLowerCase() === address.toLowerCase())
          .map(e => ({
            id: e.eventId,
            name: e.name,
            ticketsSold: e.ticketsSold,
            totalTickets: e.totalTickets,
            revenue: (parseFloat(e.ticketPrice) * e.ticketsSold / 1e18).toFixed(4),
            status: e.eventDate * 1000 > Date.now() ? "upcoming" : e.isActive ? "active" : "ended",
            date: new Date(e.eventDate * 1000).toLocaleDateString(),
          }));
        setEvents(organizerEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizerEvents();
  }, [address]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "ended":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 pt-40 pb-24 text-center">
          <Wallet className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to access the organizer dashboard
          </p>
        </div>
        <Footer />
      </div>
    );
  }

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
            Organizer <span className="text-gradient-copper">Dashboard</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your events and track performance
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Total Revenue",
                  value: mockAnalytics.totalRevenue,
                  change: mockAnalytics.revenueChange,
                  icon: DollarSign,
                },
                {
                  title: "Tickets Sold",
                  value: mockAnalytics.totalTicketsSold.toLocaleString(),
                  change: mockAnalytics.ticketsChange,
                  icon: Ticket,
                },
                {
                  title: "Active Events",
                  value: mockAnalytics.totalEvents.toString(),
                  change: 0,
                  icon: Calendar,
                },
                {
                  title: "Avg. Ticket Price",
                  value: mockAnalytics.averageTicketPrice,
                  change: 0,
                  icon: Users,
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="border-border">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <stat.icon className="h-5 w-5 text-primary" />
                        </div>
                        {stat.change !== 0 && (
                          <div className={`flex items-center gap-1 text-sm ${stat.change > 0 ? "text-green-500" : "text-red-500"}`}>
                            {stat.change > 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            {Math.abs(stat.change)}%
                          </div>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Revenue Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end gap-2">
                    {mockRevenueData.map((data, i) => (
                      <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(data.revenue / 3.5) * 100}%` }}
                          transition={{ delay: i * 0.1 }}
                          className="w-full bg-gradient-copper rounded-t"
                          style={{ background: "linear-gradient(180deg, #B87333 0%, #D4894A 100%)" }}
                        />
                        <span className="text-xs text-muted-foreground">{data.month}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Ticket Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "General Admission", value: 65, color: "bg-primary" },
                    { label: "VIP", value: 25, color: "bg-copper" },
                    { label: "Backstage", value: 10, color: "bg-muted-foreground" },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          className={`h-full ${item.color}`}
                          style={{ background: item.label === "VIP" ? "linear-gradient(90deg, #B87333, #D4894A)" : undefined }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Events</CardTitle>
                  <CardDescription>Your latest event performance</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("events")}>
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.length > 0 ? events.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Ticket className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{event.name}</p>
                          <p className="text-sm text-muted-foreground">{event.ticketsSold} / {event.totalTickets} tickets</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{event.revenue} ETH</p>
                        <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No events yet. Create your first event!</p>
                      <Button asChild className="mt-4 bg-gradient-copper hover:opacity-90">
                        <Link to="/create">Create Event</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-foreground">My Events</h2>
              <Button asChild className="bg-gradient-copper hover:opacity-90">
                <Link to="/create">
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Event
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="border-border hover:border-copper/30 transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{event.name}</CardTitle>
                          <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                        </div>
                        <CardDescription>{event.date}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Tickets Sold</p>
                            <p className="font-medium">{event.ticketsSold} / {event.totalTickets}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Revenue</p>
                            <p className="font-medium">{event.revenue} ETH</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <Link to={`/event/${event.id}`}>
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Events Yet</h3>
                <p className="text-muted-foreground mb-6">Create your first event to get started</p>
                <Button asChild className="bg-gradient-copper hover:opacity-90">
                  <Link to="/create">Create Event</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Sales Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Chart visualization would go here
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Payment Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold text-foreground">{mockAnalytics.totalRevenue}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm text-muted-foreground">Platform Fees</p>
                      <p className="text-2xl font-bold text-foreground">0.31 ETH</p>
                    </div>
                    <Badge>2.5%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm text-muted-foreground">Net Revenue</p>
                      <p className="text-2xl font-bold text-foreground">12.14 ETH</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Dune Analytics</CardTitle>
                <CardDescription>Real-time blockchain analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Paxr Dashboard</p>
                      <p className="text-sm text-muted-foreground">Track platform-wide metrics</p>
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2">
                    View on Dune <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Connect your Dune API key in settings to enable real-time analytics
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default OrganizerDashboard;

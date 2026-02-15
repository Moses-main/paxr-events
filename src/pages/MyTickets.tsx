import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Ticket, ArrowLeftRight, Globe, BadgeCheck, QrCode,
  Calendar, MapPin, MoreVertical, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const myTickets = [
  {
    id: "NFT-0x8a7f-001",
    eventTitle: "Neon Horizons Festival",
    date: "Mar 15, 2026",
    location: "Miami, FL",
    tier: "VIP",
    status: "active",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=250&fit=crop",
    chain: "Arbitrum Orbit",
    tokenId: "#1247",
  },
  {
    id: "NFT-0xb4c2-002",
    eventTitle: "Web3 Builder Summit",
    date: "Apr 2, 2026",
    location: "Berlin, DE",
    tier: "General",
    status: "active",
    image: "https://images.unsplash.com/photo-1540575467063-178a50da2db7?w=400&h=250&fit=crop",
    chain: "Arbitrum Orbit",
    tokenId: "#582",
  },
  {
    id: "NFT-0x1d9e-003",
    eventTitle: "DeFi Conference 2025",
    date: "Dec 10, 2025",
    location: "Lisbon, PT",
    tier: "Backstage",
    status: "attended",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=250&fit=crop",
    chain: "Ethereum",
    tokenId: "#89",
    poap: true,
  },
  {
    id: "NFT-0xf2a7-004",
    eventTitle: "Crypto Art Basel",
    date: "Nov 5, 2025",
    location: "Basel, CH",
    tier: "General",
    status: "attended",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&h=250&fit=crop",
    chain: "Polygon",
    tokenId: "#3301",
    poap: true,
  },
];

const MyTickets = () => {
  const activeTickets = myTickets.filter((t) => t.status === "active");
  const pastTickets = myTickets.filter((t) => t.status === "attended");

  const TicketCard = ({ ticket }: { ticket: typeof myTickets[0] }) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card overflow-hidden group hover:border-copper/30 transition-all"
    >
      <div className="relative h-40 overflow-hidden">
        <img src={ticket.image} alt={ticket.eventTitle} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-surface-elevated/90 backdrop-blur text-foreground text-xs">{ticket.tier}</Badge>
          {ticket.poap && (
            <Badge className="bg-gradient-copper text-primary-foreground text-xs gap-1">
              <BadgeCheck className="h-3 w-3" /> POAP
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="border-border/50 bg-card/80 backdrop-blur text-xs text-muted-foreground font-mono">
            {ticket.tokenId}
          </Badge>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display font-semibold text-foreground">{ticket.eventTitle}</h3>
        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {ticket.date}</span>
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {ticket.location}</span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline" className="border-copper/30 text-copper-light text-xs gap-1">
            <Globe className="h-3 w-3" /> {ticket.chain}
          </Badge>
          <Badge
            variant={ticket.status === "active" ? "default" : "secondary"}
            className={ticket.status === "active" ? "bg-primary/15 text-primary text-xs" : "text-xs"}
          >
            {ticket.status === "active" ? "Upcoming" : "Attended"}
          </Badge>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
          {ticket.status === "active" ? (
            <>
              <Button size="sm" variant="outline" className="flex-1 border-border text-muted-foreground hover:text-foreground gap-1.5 text-xs">
                <QrCode className="h-3.5 w-3.5" /> Show QR
              </Button>
              <Button size="sm" variant="outline" className="flex-1 border-border text-muted-foreground hover:text-foreground gap-1.5 text-xs">
                <ArrowLeftRight className="h-3.5 w-3.5" /> Resell
              </Button>
              <Button size="sm" variant="outline" className="flex-1 border-border text-muted-foreground hover:text-foreground gap-1.5 text-xs">
                <Globe className="h-3.5 w-3.5" /> Bridge
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" className="flex-1 border-border text-muted-foreground hover:text-foreground gap-1.5 text-xs">
                <BadgeCheck className="h-3.5 w-3.5" /> View Proof
              </Button>
              <Button size="sm" variant="outline" className="flex-1 border-border text-muted-foreground hover:text-foreground gap-1.5 text-xs">
                <Shield className="h-3.5 w-3.5" /> Share
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-6 pt-28 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            My <span className="text-gradient-copper">Tickets</span>
          </h1>
          <p className="text-muted-foreground mt-2">Your NFT ticket collection and attendance proofs</p>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Tickets", value: myTickets.length, icon: Ticket },
            { label: "Upcoming", value: activeTickets.length, icon: Calendar },
            { label: "Events Attended", value: pastTickets.length, icon: BadgeCheck },
            { label: "POAPs Earned", value: pastTickets.filter((t) => t.poap).length, icon: Shield },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <Tabs defaultValue="active">
          <TabsList className="bg-muted mb-6">
            <TabsTrigger value="active">Upcoming ({activeTickets.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastTickets.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default MyTickets;

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeftRight, Shield, AlertTriangle, Clock, TrendingUp,
  Search, Filter, ArrowUpRight, Check, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const listings = [
  {
    id: 1,
    eventTitle: "Neon Horizons Festival",
    tier: "VIP",
    originalPrice: "0.12 ETH",
    listingPrice: "0.14 ETH",
    priceCap: "0.18 ETH",
    seller: "0x8a7f...3e2d",
    sellerRep: 98,
    escrowStatus: "secured",
    timeLeft: "2d 14h",
    verified: true,
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=200&fit=crop",
  },
  {
    id: 2,
    eventTitle: "Web3 Builder Summit",
    tier: "General",
    originalPrice: "0.05 ETH",
    listingPrice: "0.06 ETH",
    priceCap: "0.075 ETH",
    seller: "0xb4c2...7f1a",
    sellerRep: 100,
    escrowStatus: "secured",
    timeLeft: "5d 3h",
    verified: true,
    image: "https://images.unsplash.com/photo-1540575467063-178a50da2db7?w=300&h=200&fit=crop",
  },
  {
    id: 3,
    eventTitle: "DeFi Gaming Arena",
    tier: "Backstage",
    originalPrice: "0.25 ETH",
    listingPrice: "0.30 ETH",
    priceCap: "0.375 ETH",
    seller: "0x1d9e...5c88",
    sellerRep: 92,
    escrowStatus: "pending",
    timeLeft: "1d 6h",
    verified: false,
    image: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=300&h=200&fit=crop",
  },
  {
    id: 4,
    eventTitle: "Midnight Art Exhibition",
    tier: "General",
    originalPrice: "0.03 ETH",
    listingPrice: "0.035 ETH",
    priceCap: "0.045 ETH",
    seller: "0xf2a7...9d44",
    sellerRep: 95,
    escrowStatus: "secured",
    timeLeft: "8d 12h",
    verified: true,
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=300&h=200&fit=crop",
  },
  {
    id: 5,
    eventTitle: "Neon Horizons Festival",
    tier: "General",
    originalPrice: "0.05 ETH",
    listingPrice: "0.05 ETH",
    priceCap: "0.075 ETH",
    seller: "0x6e3b...2a11",
    sellerRep: 100,
    escrowStatus: "secured",
    timeLeft: "2d 14h",
    verified: true,
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=200&fit=crop",
  },
  {
    id: 6,
    eventTitle: "Decentralized Music Night",
    tier: "VIP",
    originalPrice: "0.10 ETH",
    listingPrice: "0.11 ETH",
    priceCap: "0.15 ETH",
    seller: "0xcc91...4f77",
    sellerRep: 88,
    escrowStatus: "pending",
    timeLeft: "4d 9h",
    verified: false,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
  },
];

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = listings.filter((l) =>
    l.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-6 pt-28 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Resale <span className="text-gradient-copper">Marketplace</span>
          </h1>
          <p className="text-muted-foreground mt-2 mb-8">
            Secure, escrow-protected ticket resales with anti-scalping enforcement
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
            <p className="text-sm font-semibold text-foreground">Anti-Scalping Protection Active</p>
            <p className="text-sm text-muted-foreground">
              All listings are capped at 1.5× original price. Bot detection and time-locks prevent automated scalping. Funds are held in escrow until transfer is verified on-chain.
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

        {/* Listings */}
        <div className="space-y-4">
          {filtered.map((listing, i) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-4 md:p-5 hover:border-copper/30 transition-all group"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Image */}
                <div className="w-full md:w-36 h-24 rounded-lg overflow-hidden shrink-0">
                  <img src={listing.image} alt={listing.eventTitle} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-semibold text-foreground">{listing.eventTitle}</h3>
                        {listing.verified && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="bg-surface-elevated text-foreground text-xs">{listing.tier}</Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            listing.escrowStatus === "secured"
                              ? "border-primary/30 text-primary"
                              : "border-yellow-500/30 text-yellow-500"
                          }`}
                        >
                          <Lock className="h-3 w-3 mr-1" />
                          {listing.escrowStatus === "secured" ? "Escrow Secured" : "Escrow Pending"}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-display text-lg font-bold text-foreground">{listing.listingPrice}</p>
                      <p className="text-xs text-muted-foreground">Original: {listing.originalPrice}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between mt-3 pt-3 border-t border-border gap-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {listing.timeLeft}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5" /> Cap: {listing.priceCap}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-xs">
                        Seller: {listing.seller} ({listing.sellerRep}%)
                      </span>
                    </div>
                    <Button size="sm" className="bg-gradient-copper text-primary-foreground hover:opacity-90 shadow-copper gap-1.5">
                      <ArrowLeftRight className="h-4 w-4" /> Buy
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No listings found matching your search.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Marketplace;

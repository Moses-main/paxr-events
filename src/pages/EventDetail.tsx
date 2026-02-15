import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar, MapPin, Users, Shield, Clock, ArrowLeft,
  Ticket, Lock, Share2, Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TransactionTracker from "@/components/TransactionTracker";

const eventData = {
  id: "1",
  title: "Neon Horizons Festival",
  date: "March 15, 2026",
  time: "6:00 PM - 2:00 AM",
  location: "Wynwood Arts District, Miami, FL",
  description:
    "A groundbreaking fusion of electronic music, immersive art, and Web3 culture. Experience world-class DJs, NFT art installations, and verifiable attendance proofs.",
  image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=600&fit=crop",
  organizer: "NeonDAO",
  attendees: 2400,
  maxCapacity: 5000,
  category: "Music",
  chain: "Arbitrum Orbit",
  encrypted: true,
  tiers: [
    { name: "General Admission", price: "0.05 ETH", priceUsd: "$160", available: 1823, total: 3000, perks: ["Venue access", "Attendance proof NFT"] },
    { name: "VIP", price: "0.12 ETH", priceUsd: "$385", available: 412, total: 1500, perks: ["Priority entry", "VIP lounge", "Merch airdrop", "Attendance proof NFT"] },
    { name: "Backstage", price: "0.25 ETH", priceUsd: "$800", available: 47, total: 500, perks: ["All VIP perks", "Meet & Greet", "Exclusive POAP", "Lifetime community access"] },
  ],
};

const EventDetail = () => {
  const { id } = useParams();
  const [selectedTier, setSelectedTier] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showTracker, setShowTracker] = useState(false);
  const [liked, setLiked] = useState(false);

  const event = eventData;
  const tier = event.tiers[selectedTier];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <TransactionTracker
        isOpen={showTracker}
        onClose={() => setShowTracker(false)}
        eventTitle={event.title}
        ticketTier={tier.name}
        price={tier.price}
      />

      {/* Hero Banner */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute top-24 left-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors bg-card/80 backdrop-blur rounded-lg px-3 py-1.5">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-32 relative z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Event Info */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="secondary" className="bg-surface-elevated text-foreground">{event.category}</Badge>
                {event.encrypted && (
                  <Badge className="bg-primary/10 text-primary border border-primary/20 gap-1">
                    <Lock className="h-3 w-3" /> Encrypted
                  </Badge>
                )}
                <Badge variant="outline" className="border-copper/30 text-copper-light">{event.chain}</Badge>
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground">{event.title}</h1>
              <p className="text-muted-foreground mt-1">by {event.organizer}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Calendar, label: event.date },
                { icon: Clock, label: event.time },
                { icon: MapPin, label: event.location },
                { icon: Users, label: `${event.attendees.toLocaleString()} / ${event.maxCapacity.toLocaleString()}` },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-card p-4">
                  <item.icon className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm text-foreground leading-snug">{item.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">About This Event</h2>
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Attendee data encrypted via FHE · Anti-scalping resale rules enforced</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Purchase Panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">Select Ticket</h3>

              {/* Tier selection */}
              <div className="space-y-3 mb-6">
                {event.tiers.map((t, i) => (
                  <button
                    key={t.name}
                    onClick={() => setSelectedTier(i)}
                    className={`w-full text-left rounded-xl border p-4 transition-all ${
                      selectedTier === i
                        ? "border-primary bg-primary/5 shadow-copper"
                        : "border-border bg-card hover:border-copper/30"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-display font-semibold text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t.available} of {t.total} left</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold text-primary">{t.price}</p>
                        <p className="text-xs text-muted-foreground">{t.priceUsd}</p>
                      </div>
                    </div>
                    {selectedTier === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-3 pt-3 border-t border-border">
                        <ul className="space-y-1">
                          {t.perks.map((perk) => (
                            <li key={perk} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Ticket className="h-3 w-3 text-primary" />
                              {perk}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-muted-foreground">Quantity</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-8 w-8 rounded-lg border border-border bg-muted flex items-center justify-center text-foreground hover:bg-secondary">−</button>
                  <span className="font-display font-semibold text-foreground w-6 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(4, quantity + 1))} className="h-8 w-8 rounded-lg border border-border bg-muted flex items-center justify-center text-foreground hover:bg-secondary">+</button>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
                <span className="text-muted-foreground">Total</span>
                <span className="font-display text-xl font-bold text-foreground">
                  {(parseFloat(tier.price) * quantity).toFixed(2)} ETH
                </span>
              </div>

              <Button
                onClick={() => setShowTracker(true)}
                className="w-full bg-gradient-copper text-primary-foreground hover:opacity-90 shadow-copper py-6 text-base font-display font-semibold gap-2"
              >
                <Ticket className="h-5 w-5" />
                Mint {quantity > 1 ? `${quantity} Tickets` : "Ticket"}
              </Button>

              <div className="flex gap-2 mt-3">
                <Button variant="outline" className="flex-1 border-border text-muted-foreground hover:text-foreground gap-2" onClick={() => setLiked(!liked)}>
                  <Heart className={`h-4 w-4 ${liked ? "fill-primary text-primary" : ""}`} />
                  {liked ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" className="flex-1 border-border text-muted-foreground hover:text-foreground gap-2">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetail;

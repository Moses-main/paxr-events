import { motion } from "framer-motion";
import { ArrowRight, Shield, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border border-copper/30 bg-surface-elevated px-4 py-1.5 mb-8"
        >
          <Shield className="h-4 w-4 text-copper" />
          <span className="text-sm text-muted-foreground">Privacy-first • Anti-fraud • Decentralized</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
        >
          The Future of
          <br />
          <span className="text-gradient-copper">Event Ticketing</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10"
        >
          NFT-powered tickets on Arbitrum with encrypted attendee data, anti-scalping protection, and cross-chain bridging. Own your ticket, prove your presence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" className="bg-gradient-copper text-primary-foreground hover:opacity-90 shadow-copper gap-2 text-base px-8 py-6">
            <Ticket className="h-5 w-5" />
            Explore Events
          </Button>
          <Button size="lg" variant="outline" className="border-copper/30 text-foreground hover:bg-copper/10 gap-2 text-base px-8 py-6">
            Create Event
            <ArrowRight className="h-5 w-5" />
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="grid grid-cols-3 gap-8 max-w-xl mx-auto mt-20"
        >
          {[
            { value: "50K+", label: "Tickets Minted" },
            { value: "1.2K", label: "Events Live" },
            { value: "0%", label: "Fraud Rate" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl md:text-4xl font-bold text-gradient-copper">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

import { motion } from "framer-motion";
import { Wallet, Ticket, ShieldCheck, ArrowLeftRight } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Connect Wallet",
    description: "Link your wallet or sign in with email via Privy. No crypto experience needed.",
  },
  {
    icon: Ticket,
    title: "Mint Your Ticket",
    description: "Purchase NFT tickets with anti-scalping protection and encrypted attendee data.",
  },
  {
    icon: ArrowLeftRight,
    title: "Trade Securely",
    description: "Resell tickets within fair price caps. Cross-chain bridging via LayerZero.",
  },
  {
    icon: ShieldCheck,
    title: "Prove Attendance",
    description: "Get a verifiable, shareable proof-of-attendance NFT after the event.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-surface">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            How <span className="text-gradient-copper">Paxr</span> Works
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            From wallet to venue in four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center group"
            >
              <div className="mx-auto mb-5 h-16 w-16 rounded-2xl bg-gradient-copper flex items-center justify-center shadow-copper group-hover:animate-pulse-glow transition-all">
                <step.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="absolute top-8 left-[60%] hidden lg:block w-[calc(100%-20px)] border-t border-dashed border-copper/20" style={{ display: i === steps.length - 1 ? "none" : undefined }} />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

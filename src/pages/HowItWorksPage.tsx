import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Wallet, Ticket, Shield, Users, Globe, ArrowRight, 
  CheckCircle, Lock, Calendar, MapPin, QrCode, 
  Bell, Gift, Share2, TrendingUp, CreditCard, Building,
  Star, Zap, ChevronRight, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    icon: Wallet,
    title: "Connect Your Wallet",
    description: "Get started by connecting your wallet. We support MetaMask, WalletConnect, and more through Privy.",
    steps: [
      "Click 'Connect Wallet' in the navigation",
      "Choose your preferred wallet or sign in with email",
      "Switch to Arbitrum Sepolia for testnet or Arbitrum One for mainnet"
    ]
  },
  {
    icon: Ticket,
    title: "Browse & Purchase Tickets",
    description: "Find events that interest you and purchase NFT tickets directly from the marketplace.",
    steps: [
      "Explore the Marketplace for upcoming events",
      "Click on an event to view details",
      "Connect your wallet and purchase tickets",
      "Your NFT tickets will appear in 'My Tickets'"
    ]
  },
  {
    icon: Users,
    title: "Join Communities",
    description: "Connect with other attendees, join fan communities, and stay updated on events.",
    steps: [
      "Visit the Communities page",
      "Browse or search for communities",
      "Join communities to connect with like-minded fans"
    ]
  },
  {
    icon: Gift,
    title: "Referral Program",
    description: "Invite friends and earn rewards. Share your unique referral link and earn commissions.",
    steps: [
      "Go to any event detail page",
      "Find the Referral section",
      "Copy your unique referral link",
      "Share with friends and earn 5% on their purchases"
    ]
  },
  {
    icon: TrendingUp,
    title: "Organizer Dashboard",
    description: "Create and manage your own events. Track sales, analytics, and revenue.",
    steps: [
      "Navigate to Dashboard from the nav",
      "Create new events with customizable settings",
      "Set ticket prices, limits, and resale rules",
      "Monitor your events' performance"
    ]
  },
  {
    icon: Shield,
    title: "Anti-Scalping Protection",
    description: "Our smart contracts enforce maximum resale prices to prevent ticket scalping.",
    steps: [
      "Organizers set maximum resale prices",
      "Tickets can only be resold within the limit",
      "Buyers are protected from inflated prices"
    ]
  },
  {
    icon: QrCode,
    title: "Attendance Proofs",
    description: "After attending an event, generate verifiable proof-of-attendance NFTs.",
    steps: [
      "Go to My Tickets after the event",
      "Find your ticket and click 'Proof'",
      "Generate your attendance verification",
      "Share it on social media"
    ]
  },
  {
    icon: Globe,
    title: "Cross-Chain Support",
    description: "Your tickets work across multiple chains including Arbitrum, Ethereum, and Polygon.",
    steps: [
      "Switch between supported networks",
      "Bridge tickets using LayerZero",
      "Access your tickets on any supported chain"
    ]
  }
];

const faqs = [
  {
    question: "What is Paxr?",
    answer: "Paxr is a decentralized event ticketing marketplace built on Arbitrum Orbit. It enables event organizers to create events and sell NFT-based tickets with built-in anti-scalping protection, resale controls, and group buy functionality."
  },
  {
    question: "How do I connect my wallet?",
    answer: "Click the 'Connect Wallet' button in the navigation bar. You can connect using MetaMask, WalletConnect, or sign in with email through Privy. Make sure you're connected to Arbitrum Sepolia for testing."
  },
  {
    question: "What are NFT tickets?",
    answer: "NFT tickets are non-fungible tokens that represent ownership of your event ticket. They provide verifiable ownership, prevent counterfeiting, and can be transferred or resold (within price limits)."
  },
  {
    question: "How does anti-scalping work?",
    answer: "Organizers can set maximum resale prices when creating events. The smart contract enforces these limits, preventing tickets from being resold above the specified price."
  },
  {
    question: "Can I resell my tickets?",
    answer: "Yes, if the organizer has enabled resale. However, tickets can only be resold within the maximum price set by the organizer. This protects buyers from inflated prices."
  },
  {
    question: "What is group buy?",
    answer: "Group buy allows multiple people to pool together for discounted tickets. When enough participants join, everyone receives their tickets at the discounted price."
  },
  {
    question: "How do I create an event?",
    answer: "Navigate to the Dashboard and click 'Create Event'. Fill in your event details including name, description, location, ticket price, and sale dates. You can also enable group buy and set resale rules."
  },
  {
    question: "Is my data private?",
    answer: "Yes. Paxr supports anonymous RSVP and encrypted attendee data. Your wallet address and purchase history are stored securely on-chain."
  }
];

const HowItWorksPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-6 pt-28 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            How <span className="text-gradient-copper">Paxr</span> Works
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your complete guide to using the decentralized event ticketing platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.slice(0, 4).map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`#${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <Card className="border-border hover:border-copper/30 transition-all cursor-pointer h-full">
                  <CardContent className="pt-6 text-center">
                    <div className="h-14 w-14 mx-auto mb-4 rounded-2xl bg-gradient-copper flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="space-y-16">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              id={feature.title.toLowerCase().replace(/\s+/g, '-')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
            >
              <div className="flex-1">
                <div className="h-20 w-20 rounded-2xl bg-gradient-copper flex items-center justify-center mb-6">
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {feature.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.steps.map((step, j) => (
                    <motion.li 
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + j * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div className="h-6 w-6 rounded-full bg-copper/10 flex items-center justify-center mt-0.5 shrink-0">
                        <span className="text-sm font-medium text-copper">{j + 1}</span>
                      </div>
                      <span className="text-muted-foreground">{step}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full">
                <Card className="border-copper/20 bg-gradient-to-br from-copper-5 to-copper-10">
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      {feature.steps.map((step, j) => (
                        <div key={j} className="flex items-center gap-4">
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                          <span className="text-foreground">{step}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-copper/20">
                      <Button className="w-full bg-gradient-copper" asChild>
                        <Link to={feature.title.includes("Organizer") ? "/dashboard" : "/marketplace"}>
                          Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-20"
        >
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-10">
            Frequently Asked <span className="text-gradient-copper">Questions</span>
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-foreground">{faq.question}</span>
                  {openFaq === i ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    className="px-4 pb-4"
                  >
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-20 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-copper text-white gap-2" asChild>
              <Link to="/marketplace">
                <Ticket className="h-5 w-5" />
                Browse Events
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-copper/30 gap-2" asChild>
              <Link to="/dashboard">
                <Calendar className="h-5 w-5" />
                Create Event
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;

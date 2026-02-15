import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Events", href: "/#events" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "My Tickets", href: "/my-tickets" },
  { label: "How It Works", href: "/#how-it-works" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80"
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-copper flex items-center justify-center">
            <span className="font-display font-bold text-primary-foreground text-sm">P</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">Paxr</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Sign In
          </Button>
          <Button size="sm" className="bg-gradient-copper text-primary-foreground hover:opacity-90 shadow-copper gap-2">
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-border bg-background px-6 pb-6"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block py-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
          <Button className="w-full mt-4 bg-gradient-copper text-primary-foreground gap-2">
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;

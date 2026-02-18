import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectWallet } from "./ConnectWallet";

const navItems = [
  { label: "Events", href: "/#events" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Communities", href: "/communities" },
  { label: "Dashboard", href: "/dashboard" },
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
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6 py-2">
        <a href="/" className="flex items-center">
          <img src="/Paxr_generic.png" alt="Paxr" className="h-12 md:h-16 w-12 md:w-16 rounded-xl object-cover" />
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6">
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

        <div className="hidden lg:flex items-center gap-3">
          <ConnectWallet />
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-foreground p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="lg:hidden border-t border-border bg-background px-4 pb-4"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="mt-3">
            <ConnectWallet />
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;

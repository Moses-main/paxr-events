import { Github, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/Paxr_generic.png" alt="Paxr" className="h-10 w-10 rounded-lg object-cover" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Decentralized, privacy-first event ticketing on Arbitrum Orbit.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {[
            { title: "Product", links: [
              { name: "Events", path: "/marketplace" },
              { name: "Organizers", path: "/dashboard" },
              { name: "How It Works", path: "/how-it-works" },
            ]},
            { title: "Company", links: [
              { name: "About", path: "/" },
              { name: "Blog", path: "/" },
              { name: "Careers", path: "/" },
            ]},
            { title: "Legal", links: [
              { name: "Privacy Policy", path: "/legal" },
              { name: "Terms of Service", path: "/legal" },
              { name: "Cookies", path: "/" },
            ]},
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-foreground mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-10 pt-6 text-center">
          <p className="text-xs text-muted-foreground">© 2026 Paxr. Built on Arbitrum Orbit.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

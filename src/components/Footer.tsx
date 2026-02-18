import { Github, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-8 md:py-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <img src="/Paxr_authentic.png" alt="Paxr" className="h-12 md:h-16 w-12 md:w-16 rounded-lg object-cover" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Decentralized, privacy-first event ticketing on Arbitrum Orbit.
            </p>
            <div className="flex gap-3 mt-3 md:mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-4 w-4 md:h-5 md:w-5" />
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
              <h4 className="font-display font-semibold text-sm md:text-base text-foreground mb-3 md:mb-4">{col.title}</h4>
              <ul className="space-y-1.5 md:space-y-2">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-6 md:mt-10 pt-4 md:pt-6 text-center">
          <p className="text-[10px] md:text-xs text-muted-foreground">© 2026 Paxr. Built on Arbitrum Orbit.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

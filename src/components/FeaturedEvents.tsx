import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const events = [
  {
    id: 1,
    title: "Neon Horizons Festival",
    date: "Mar 15, 2026",
    location: "Miami, FL",
    price: "0.08 ETH",
    attendees: 2400,
    category: "Music",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop",
    hot: true,
  },
  {
    id: 2,
    title: "Web3 Builder Summit",
    date: "Apr 2, 2026",
    location: "Berlin, DE",
    price: "0.05 ETH",
    attendees: 800,
    category: "Conference",
    image: "https://images.unsplash.com/photo-1540575467063-178a50da2db7?w=600&h=400&fit=crop",
    hot: false,
  },
  {
    id: 3,
    title: "Midnight Art Exhibition",
    date: "Mar 28, 2026",
    location: "Tokyo, JP",
    price: "0.03 ETH",
    attendees: 350,
    category: "Art",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&h=400&fit=crop",
    hot: false,
  },
  {
    id: 4,
    title: "DeFi Gaming Arena",
    date: "Apr 10, 2026",
    location: "Seoul, KR",
    price: "0.12 ETH",
    attendees: 5000,
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=600&h=400&fit=crop",
    hot: true,
  },
  {
    id: 5,
    title: "Decentralized Music Night",
    date: "May 5, 2026",
    location: "London, UK",
    price: "0.06 ETH",
    attendees: 1200,
    category: "Music",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
    hot: false,
  },
  {
    id: 6,
    title: "NFT Photography Showcase",
    date: "Apr 22, 2026",
    location: "New York, US",
    price: "0.04 ETH",
    attendees: 600,
    category: "Art",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop",
    hot: false,
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturedEvents = () => {
  return (
    <section id="events" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Trending <span className="text-gradient-copper">Events</span>
            </h2>
            <p className="text-muted-foreground mt-2">Discover the hottest NFT-ticketed experiences</p>
          </div>
          <a href="#" className="hidden md:flex items-center gap-1 text-sm text-primary hover:underline">
            View all <ArrowUpRight className="h-4 w-4" />
          </a>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {events.map((event) => (
            <motion.div
              key={event.id}
              variants={item}
              className="group relative rounded-xl border border-border bg-card overflow-hidden hover:border-copper/40 transition-all duration-300 hover:shadow-copper cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="secondary" className="bg-surface-elevated/90 backdrop-blur text-foreground text-xs">
                    {event.category}
                  </Badge>
                  {event.hot && (
                    <Badge className="bg-gradient-copper text-primary-foreground text-xs">🔥 Hot</Badge>
                  )}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {event.location}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="font-display font-semibold text-primary">{event.price}</span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-3.5 w-3.5" /> {event.attendees.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedEvents;

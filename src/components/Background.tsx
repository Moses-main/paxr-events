import { motion } from "framer-motion";

interface BackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const BACKGROUND_IMAGE = "https://gateway.pinata.cloud/ipfs/bafybeibu24bwpmtttjtyakx4zboh2j75lqtd6eajvkmt5pel2bvlnr5k74";

export default function Background({ children, className = "" }: BackgroundProps) {
  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Sticky Background */}
      <div className="fixed inset-0 z-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={BACKGROUND_IMAGE}
            alt="Paxr Event Ticketing"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export { BACKGROUND_IMAGE };

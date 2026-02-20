import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, ExternalLink, Copy, X } from "lucide-react";

type TxStep = "confirming" | "minting" | "finalizing" | "complete" | "error";

interface TransactionTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  txHash?: string;
  eventTitle?: string;
  ticketTier?: string;
  price?: string;
}

const steps: { key: TxStep; label: string }[] = [
  { key: "confirming", label: "Confirming transaction" },
  { key: "minting", label: "Minting NFT ticket" },
  { key: "finalizing", label: "Finalizing on-chain" },
  { key: "complete", label: "Complete" },
];

const TransactionTracker = ({ isOpen, onClose, txHash, eventTitle = "Event", ticketTier = "General", price }: TransactionTrackerProps) => {
  const [currentStep, setCurrentStep] = useState<TxStep>("confirming");
  const [copied, setCopied] = useState(false);

  // Simulate progression
  useState(() => {
    if (!isOpen) return;
    const timers = [
      setTimeout(() => setCurrentStep("minting"), 1500),
      setTimeout(() => setCurrentStep("finalizing"), 3500),
      setTimeout(() => setCurrentStep("complete"), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  });

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  const handleCopy = () => {
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md mx-4 rounded-2xl border border-border bg-card p-6 shadow-elevated"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>

          <div className="text-center mb-6">
            <h3 className="font-display text-xl font-bold text-foreground">
              {currentStep === "complete" ? "Ticket Minted! 🎉" : "Processing Transaction"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {eventTitle} · {ticketTier} · {price}
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4 mb-6">
            {steps.map((step, i) => {
              const isActive = i === currentIndex;
              const isDone = i < currentIndex;
              return (
                <div key={step.key} className="flex items-center gap-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isDone
                        ? "bg-gradient-copper text-primary-foreground"
                        : isActive
                        ? "border-2 border-primary bg-primary/10"
                        : "border border-border bg-muted"
                    }`}
                  >
                    {isDone ? (
                      <Check className="h-4 w-4" />
                    ) : isActive ? (
                      <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    ) : (
                      <span className="text-xs text-muted-foreground">{i + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm ${isDone ? "text-foreground" : isActive ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Tx hash */}
          <div className="rounded-lg bg-muted p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Transaction Hash</p>
              <p className="text-sm font-mono text-foreground">{txHash}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors">
                {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              </button>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {currentStep === "complete" && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onClose}
              className="w-full mt-4 py-3 rounded-lg bg-gradient-copper text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity"
            >
              View My Ticket
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TransactionTracker;

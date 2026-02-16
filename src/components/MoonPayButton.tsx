import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, ArrowRight, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MoonPayButtonProps {
  walletAddress: string;
  defaultCryptoAmount?: number;
  cryptoCurrency?: string;
}

const MoonPayButton: React.FC<MoonPayButtonProps> = ({
  walletAddress,
  defaultCryptoAmount = 0.01,
  cryptoCurrency = "eth",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(defaultCryptoAmount.toString());
  const [isLoading, setIsLoading] = useState(false);

  const moonPayApiKey = import.meta.env.VITE_MOONPAY_PUBLIC_KEY;
  
  const generateMoonPayUrl = () => {
    if (!moonPayApiKey) {
      console.error("MoonPay API key not configured");
      return null;
    }

    const baseUrl = "https://buy.moonpay.com";
    const params = new URLSearchParams({
      apiKey: moonPayApiKey,
      currencyAbbreviation: cryptoCurrency,
      walletAddress: walletAddress,
      amount: amount,
      network: "arbitrum",
    });

    return `${baseUrl}?${params.toString()}`;
  };

  const handleBuyCrypto = () => {
    const url = generateMoonPayUrl();
    if (url) {
      window.open(url, "_blank");
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 3000);
    }
  };

  if (!moonPayApiKey) {
    return (
      <Button disabled variant="outline" className="border-copper/30">
        <CreditCard className="h-4 w-4 mr-2" />
        Buy Crypto (Coming Soon)
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-copper/30 hover:bg-copper/10">
          <CreditCard className="h-4 w-4 mr-2" />
          Buy Crypto
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-copper" />
            Buy Crypto with MoonPay
          </DialogTitle>
          <DialogDescription>
            Purchase ETH using credit card or debit card. The ETH will be sent directly to your wallet on Arbitrum.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (USD)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount in USD"
              min="10"
              max="10000"
            />
            <p className="text-xs text-muted-foreground">
              Minimum: $10 | Maximum: $10,000
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">You pay (USD)</span>
              <span>${amount || "0"}.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated ETH</span>
              <span>~{amount ? (parseFloat(amount) / 2500).toFixed(6) : "0"} ETH</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network</span>
              <span>Arbitrum</span>
            </div>
            <div className="flex justify-between text-sm text-copper">
              <span>MoonPay fee (~4.5%)</span>
              <span>~${amount ? (parseFloat(amount) * 0.045).toFixed(2) : "0"}</span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Supported payment methods:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Visa</li>
              <li>Mastercard</li>
              <li>Apple Pay</li>
              <li>Google Pay</li>
            </ul>
          </div>

          <Button
            onClick={handleBuyCrypto}
            disabled={isLoading || !amount || parseFloat(amount) < 10}
            className="w-full bg-gradient-copper hover:opacity-90"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Opening MoonPay...
              </>
            ) : (
              <>
                Continue to MoonPay
                <ExternalLink className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoonPayButton;

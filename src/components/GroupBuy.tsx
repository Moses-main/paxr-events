import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useWallet } from '@/hooks/useWallet';

interface GroupBuyProps {
  eventId: number;
  ticketPrice: string;
  discount: string;
  minGroupSize: number;
  onJoin?: (amount: string) => Promise<void>;
}

export default function GroupBuy({
  eventId,
  ticketPrice,
  discount,
  minGroupSize,
  onJoin
}: GroupBuyProps) {
  const { isConnected } = useWallet();
  const [contribution, setContribution] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  
  const priceInEth = parseFloat(ticketPrice) / 1e18;
  const discountInEth = parseFloat(discount) / 1e18;
  const discountedPrice = priceInEth - discountInEth;
  
  const mockProgress = 65;
  const targetAmount = priceInEth * minGroupSize;
  const currentAmount = (targetAmount * mockProgress) / 100;

  const handleJoin = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!contribution || parseFloat(contribution) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    try {
      if (onJoin) {
        await onJoin(contribution);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      setJoined(true);
      toast.success('Joined group buy!');
    } catch (error) {
      console.error('Group buy join failed:', error);
      toast.error('Failed to join group buy');
    } finally {
      setIsLoading(false);
    }
  };

  if (joined) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-800">You're in the group!</p>
                <p className="text-sm text-green-600">Waiting for group to fill...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          Group Buy
        </CardTitle>
        <CardDescription>
          Pool together with others for discounted tickets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Group Progress</span>
          <span className="font-medium">{mockProgress}%</span>
        </div>
        
        <Progress value={mockProgress} className="h-2" />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentAmount.toFixed(3)} ETH raised</span>
          <span>{targetAmount.toFixed(3)} ETH goal</span>
        </div>

        <div className="pt-2 border-t space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Original Price</p>
              <p className="font-medium line-through text-muted-foreground">
                {priceInEth.toFixed(4)} ETH
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Group Price</p>
              <p className="font-bold text-green-600">
                {discountedPrice.toFixed(4)} ETH
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded">
            <DollarSign className="h-3 w-3" />
            <span>Save {discountInEth.toFixed(4)} ETH per ticket!</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contribution">Your Contribution (ETH)</Label>
            <Input
              id="contribution"
              type="number"
              step="0.001"
              placeholder={`Min ${discountedPrice.toFixed(4)} ETH`}
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
            />
          </div>

          <Button
            onClick={handleJoin}
            disabled={isLoading || !isConnected}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              'Join Group Buy'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

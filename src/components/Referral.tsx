import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Check, Users, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useWallet } from '@/hooks/useWallet';

interface ReferralProps {
  eventId: number;
  eventName: string;
}

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  pendingRewards: number;
}

export default function Referral({ eventId, eventName }: ReferralProps) {
  const { address, isConnected } = useWallet();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const referralCode = address 
    ? `PAXR-${eventId}-${address.slice(2, 8).toUpperCase()}`
    : 'Connect wallet to get referral code';

  const referralLink = `https://paxr.xyz/event/${eventId}?ref=${address || ''}`;

  const [stats] = useState<ReferralStats>({
    totalReferrals: 12,
    successfulReferrals: 8,
    pendingRewards: 0.04,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Get tickets for ${eventName}`,
          text: `Use my referral link to get tickets for ${eventName} on Paxr!`,
          url: referralLink,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  const handleGenerateNewCode = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('New referral code generated!');
    } catch (error) {
      toast.error('Failed to generate new code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-copper-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Referral Program
        </CardTitle>
        <CardDescription>
          Invite friends and earn rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Connect your wallet to get a unique referral code
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Your Referral Code</Label>
              <div className="flex gap-2">
                <Input
                  value={referralCode}
                  readOnly
                  className="font-mono bg-muted"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(referralCode);
                    toast.success('Code copied!');
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Share Link</Label>
              <div className="flex gap-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="bg-muted text-sm"
                />
                <Button 
                  variant="default"
                  className="bg-gradient-copper hover:opacity-90 text-white gap-2"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-border gap-2"
              onClick={handleShare}
            >
              Share via {navigator.share ? 'Apps' : 'Clipboard'}
            </Button>

            <div className="pt-4 border-t space-y-3">
              <p className="text-sm font-medium text-foreground">Your Referral Stats</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-3 rounded-lg bg-muted">
                  <Users className="h-4 w-4 mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold text-foreground">{stats.totalReferrals}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <Check className="h-4 w-4 mx-auto mb-1 text-green-500" />
                  <p className="text-lg font-bold text-foreground">{stats.successfulReferrals}</p>
                  <p className="text-xs text-muted-foreground">Converted</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted">
                  <TrendingUp className="h-4 w-4 mx-auto mb-1 text-copper" />
                  <p className="text-lg font-bold text-foreground">{stats.pendingRewards} ETH</p>
                  <p className="text-xs text-muted-foreground">Earned</p>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center pt-2">
              Earn 5% of ticket sales when friends purchase using your link
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={className}>{children}</p>;
}

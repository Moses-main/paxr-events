import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Bell, Loader2, Check, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useWallet } from '@/hooks/useWallet';

interface RSVPProps {
  eventId: number;
  eventName: string;
  onRSVP?: (isAnonymous: boolean) => Promise<void>;
}

export default function AnonymousRSVP({ eventId, eventName, onRSVP }: RSVPProps) {
  const { isConnected, address } = useWallet();
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRSVPd, setHasRSVPd] = useState(false);

  const handleRSVP = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      if (onRSVP) {
        await onRSVP(isAnonymous);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      setHasRSVPd(true);
      toast.success(isAnonymous ? 'You\'ve anonymously RSVPd!' : 'RSVP confirmed!');
    } catch (error) {
      console.error('RSVP failed:', error);
      toast.error('Failed to RSVP');
    } finally {
      setIsLoading(false);
    }
  };

  if (hasRSVPd) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-800">You're In!</p>
                <p className="text-sm text-green-600">
                  {isAnonymous ? 'Your attendance is private' : `RSVP'd as ${address?.slice(0, 6)}...`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="border-copper-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          RSVP to {eventName}
        </CardTitle>
        <CardDescription>
          Get notified when tickets go on sale
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="anonymous" className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Anonymous RSVP
            </Label>
            <p className="text-xs text-muted-foreground">
              Your address won't be visible to others
            </p>
          </div>
          <Switch
            id="anonymous"
            checked={isAnonymous}
            onCheckedChange={setIsAnonymous}
          />
        </div>

        {isAnonymous && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10"
          >
            <Lock className="h-4 w-4 text-primary mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Privacy Protected</p>
              <p>Your attendance is encrypted. Only you can verify your RSVP.</p>
            </div>
          </motion.div>
        )}

        <Button
          onClick={handleRSVP}
          disabled={isLoading || !isConnected}
          className="w-full bg-gradient-copper hover:opacity-90 text-white"
          style={{ background: 'linear-gradient(135deg, #B87333 0%, #D4894A 100%)' }}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Confirming...
            </>
          ) : isAnonymous ? (
            'RSVP Anonymously'
          ) : (
            'RSVP Publicly'
          )}
        </Button>

        {!isConnected && (
          <p className="text-xs text-center text-muted-foreground">
            Connect wallet to RSVP
          </p>
        )}
      </CardContent>
    </Card>
  );
}

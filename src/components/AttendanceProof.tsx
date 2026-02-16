import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Share2, Download, Check, Calendar, MapPin, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AttendanceProofProps {
  eventId: number;
  eventName: string;
  eventDate: number;
  eventLocation: string;
  ticketId: number;
  tokenId: number;
}

export default function AttendanceProof({
  eventId,
  eventName,
  eventDate,
  eventLocation,
  ticketId,
  tokenId,
}: AttendanceProofProps) {
  const [isGenerated, setIsGenerated] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const attendanceId = `PAXR-${eventId}-${tokenId.toString(16).toUpperCase()}-ATTD`;
  const verificationUrl = `https://paxr.xyz/verify/${attendanceId}`;

  const handleGenerate = () => {
    setIsGenerated(true);
    toast.success('Attendance proof generated!');
  };

  const handleShare = async () => {
    const shareText = `I attended ${eventName}! 🎉\n\nVerify my attendance:\n${verificationUrl}\n\n#Paxr #Web3 #NFT`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Attendance Proof - ${eventName}`,
          text: shareText,
          url: verificationUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          navigator.clipboard.writeText(shareText);
          toast.success('Copied to clipboard!');
        }
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Copied to clipboard!');
    }
  };

  const handleDownload = () => {
    const element = document.getElementById('attendance-proof-card');
    if (!element) return;

    toast.success('Download coming soon!');
  };

  return (
    <Card className="border-copper-200 overflow-hidden">
      <CardHeader className="bg-gradient-copper pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-white" />
            <CardTitle className="text-white">Attendance Proof</CardTitle>
          </div>
          <Badge className="bg-white/20 text-white border-0">
            Verified
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {!isGenerated ? (
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              Generate Attendance Proof
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a verifiable proof of attendance for this event
            </p>
            <Button
              onClick={handleGenerate}
              className="bg-gradient-copper hover:opacity-90 text-white gap-2"
            >
              <QrCode className="h-4 w-4" />
              Generate Proof
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="text-center pb-4 border-b">
              <h3 className="font-display text-xl font-bold text-foreground">
                {eventName}
              </h3>
              <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(eventDate)}
              </div>
              <div className="flex items-center justify-center gap-2 mt-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {eventLocation}
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ticket ID</span>
                <span className="font-mono text-foreground">#{ticketId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Token ID</span>
                <span className="font-mono text-foreground">#{tokenId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge className="bg-green-100 text-green-700">
                  <Check className="h-3 w-3 mr-1" />
                  Attended
                </Badge>
              </div>
            </div>

            <div className="bg-background border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Verification ID</p>
              <p className="font-mono text-xs text-foreground break-all">
                {attendanceId}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              This proof can be verified on-chain at any time
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

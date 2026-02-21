import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Ticket, ArrowLeftRight, Globe, BadgeCheck, QrCode,
  Calendar, MapPin, Shield, Loader2, Send, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Background from "@/components/Background";
import AttendanceProof from "@/components/AttendanceProof";
import { useWallet } from "@/hooks/useWallet";
import { getUserTickets, getTicketData, getEvent, getListing } from "@/lib/alchemy";
import { toast } from "sonner";
import { usePrices } from "@/hooks/usePrices";
import { usePrivyTransaction, TICKET_ABI, MARKETPLACE_ABI, CONTRACT_ADDRESSES } from "@/hooks/usePrivyTransaction";
import { parseEther } from "viem";
import { useWallets } from "@privy-io/react-auth";

interface TicketNFT {
  tokenId: number;
  eventId: number;
  eventName: string;
  eventDate: string;
  location: string;
  imageURI: string;
  purchasePrice: string;
  purchaseTime: number;
  isUsed: boolean;
  tier: string;
  status: "active" | "attended";
  chain: string;
}

const MyTickets = () => {
  const { address, isConnected } = useWallet();
  const { wallets } = useWallets();
  const { writeContract, isLoading: isTxLoading } = usePrivyTransaction();
  const { prices } = usePrices();
  
  const [tickets, setTickets] = useState<TicketNFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketNFT | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showResell, setShowResell] = useState(false);
  const [showAttendanceProof, setShowAttendanceProof] = useState(false);
  const [transferAddress, setTransferAddress] = useState("");
  const [resellPrice, setResellPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maxResalePrice, setMaxResalePrice] = useState<string>("0");

  useEffect(() => {
    if (isConnected && address) {
      loadTickets();
    }
  }, [isConnected, address, wallets]);

  const loadTickets = async () => {
    if (!address) return;
    setIsLoading(true);
    try {
      const walletAddresses = [...new Set([
        address,
        ...wallets.map(w => w.address.toLowerCase())
      ])];
      
      const allTokenIds: number[] = [];
      
      for (const walletAddr of walletAddresses) {
        const tokenIds = await getUserTickets(walletAddr);
        allTokenIds.push(...tokenIds);
      }
      
      const uniqueTokenIds = [...new Set(allTokenIds)];
      const loadedTickets: TicketNFT[] = [];

      for (const tokenId of uniqueTokenIds) {
        const ticketData = await getTicketData(tokenId);
        if (ticketData) {
          const event = await getEvent(ticketData.eventId);
          if (event) {
            const eventDate = new Date(event.eventDate * 1000);
            const now = new Date();
            const isPast = eventDate < now;
            
            loadedTickets.push({
              tokenId,
              eventId: ticketData.eventId,
              eventName: event.name,
              eventDate: eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              location: event.location,
              imageURI: event.imageURI,
              purchasePrice: ticketData.purchasePrice,
              purchaseTime: ticketData.purchaseTime,
              isUsed: ticketData.isUsed,
              tier: "General",
              status: isPast ? "attended" : "active",
              chain: "Arbitrum Orbit",
            });
          }
        }
      }

      setTickets(loadedTickets);
    } catch (error) {
      console.error("Failed to load tickets:", error);
      toast.error("Failed to load tickets");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedTicket || !transferAddress) return;
    
    const isValidAddress = /^0x[0-9a-fA-F]{40}$/.test(transferAddress);
    if (!isValidAddress) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const tx = await writeContract(
        TICKET_ABI,
        'safeTransferFrom',
        [address as `0x${string}`, transferAddress as `0x${string}`, BigInt(selectedTicket.tokenId)],
        undefined,
        CONTRACT_ADDRESSES.ticket
      );
      
      if (!tx) {
        setIsSubmitting(false);
        return;
      }
      
      setShowTransfer(false);
      toast.success("Ticket transferred successfully!");
      await loadTickets();
    } catch (error) {
      console.error("Failed to transfer ticket:", error);
      toast.error("Failed to transfer ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResell = async () => {
    if (!selectedTicket || !resellPrice) return;
    
    const priceValue = parseFloat(resellPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast.error("Please enter a valid price greater than $0.00");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const priceInWei = parseEther(priceValue.toString());
      const tx = await writeContract(
        MARKETPLACE_ABI,
        'listTicket',
        [BigInt(selectedTicket.tokenId), priceInWei],
        undefined,
        CONTRACT_ADDRESSES.marketplace
      );

      if (!tx) {
        setIsSubmitting(false);
        return;
      }
      
      toast.success("Ticket listed for resale!");
      setShowResell(false);
      setResellPrice("");
    } catch (error) {
      console.error("Resale listing failed:", error);
      toast.error("Failed to list ticket for resale");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openResellModal = async (ticket: TicketNFT) => {
    try {
      if (!ticket || !ticket.eventId) {
        toast.error("Invalid ticket data");
        return;
      }
      
      setSelectedTicket(ticket);
      const event = await getEvent(ticket.eventId);
      if (!event) {
        toast.error("Failed to load event data for resale");
        return;
      }
      
      setMaxResalePrice(event.maxResalePrice);
      setShowResell(true);
    } catch (error) {
      console.error("Failed to open resell modal:", error);
      toast.error("Failed to open resell modal");
    }
  };

  const handleShare = (ticket: TicketNFT) => {
    const shareUrl = `${window.location.origin}/event/${ticket.eventId}`;
    const shareText = `Check out this event: ${ticket.eventName} - ${ticket.eventDate}`;
    
    if (navigator.share) {
      navigator.share({
        title: ticket.eventName,
        text: shareText,
        url: shareUrl,
      }).catch(() => {
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  const activeTickets = tickets.filter((t) => t.status === "active");
  const pastTickets = tickets.filter((t) => t.status === "attended");

  const TicketCard = ({ ticket }: { ticket: TicketNFT }) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card overflow-hidden group hover:border-copper/30 transition-all"
    >
      <div className="relative h-40 overflow-hidden">
        <img src={ticket.imageURI} alt={ticket.eventName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-surface-elevated/90 backdrop-blur text-foreground text-xs">{ticket.tier}</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="border-border/50 bg-card/80 backdrop-blur text-xs text-muted-foreground font-mono">
            #{ticket.tokenId}
          </Badge>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display font-semibold text-foreground">{ticket.eventName}</h3>
        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {ticket.eventDate}</span>
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {ticket.location}</span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline" className="border-copper/30 text-copper-light text-xs gap-1">
            <Globe className="h-3 w-3" /> {ticket.chain}
          </Badge>
          <Badge
            variant={ticket.status === "active" ? "default" : "secondary"}
            className={ticket.status === "active" ? "bg-primary/15 text-primary text-xs" : "text-xs"}
          >
            {ticket.status === "active" ? "Upcoming" : "Attended"}
          </Badge>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
          {ticket.status === "active" ? (
            <>
              <Button size="sm" variant="outline" className="flex-1 border-border text-muted-foreground hover:text-foreground gap-1.5 text-xs" onClick={() => { setSelectedTicket(ticket); setShowQR(true); }}>
                <QrCode className="h-3.5 w-3.5" /> QR
              </Button>
              <Button size="sm" variant="outline" className="flex-1 border-border text-muted-foreground hover:text-foreground gap-1.5 text-xs" onClick={() => { setSelectedTicket(ticket); setShowTransfer(true); }}>
                <Send className="h-3.5 w-3.5" /> Transfer
              </Button>
              <Button size="sm" variant="outline" className="flex-1 border-border text-muted-foreground hover:text-foreground gap-1.5 text-xs" onClick={openResellModal.bind(null, ticket)}>
                <ArrowLeftRight className="h-3.5 w-3.5" /> Resell
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" className="flex-1 border-border text-muted-foreground hover:text-foreground gap-1.5 text-xs" onClick={() => { setSelectedTicket(ticket); setShowAttendanceProof(true); }}>
                <BadgeCheck className="h-3.5 w-3.5" /> Proof
              </Button>
              <Button size="sm" variant="outline" className="flex-1 border-border text-muted-foreground hover:text-foreground gap-1.5 text-xs" onClick={() => handleShare(ticket)}>
                <Shield className="h-3.5 w-3.5" /> Share
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <Background>
      <Navbar />

      <div className="container mx-auto px-6 pt-28 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            My <span className="text-gradient-copper">Tickets</span>
          </h1>
          <p className="text-muted-foreground mt-2">Your NFT ticket collection and attendance proofs</p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-copper" />
          </div>
        ) : !isConnected ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Connect your wallet to view your tickets</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-20">
            <Ticket className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">You don't have any tickets yet</p>
            <Button asChild className="bg-copper-500 hover:bg-copper-600">
              <Link to="/marketplace">Browse Events</Link>
            </Button>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              {[
                { label: "Total Tickets", value: tickets.length, icon: Ticket },
                { label: "Upcoming", value: activeTickets.length, icon: Calendar },
                { label: "Events Attended", value: pastTickets.length, icon: BadgeCheck },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <Tabs defaultValue="active">
              <TabsList className="bg-muted mb-6">
                <TabsTrigger value="active">Upcoming ({activeTickets.length})</TabsTrigger>
                <TabsTrigger value="past">Past ({pastTickets.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="active">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeTickets.map((ticket) => (
                    <TicketCard key={ticket.tokenId} ticket={ticket} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="past">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastTickets.map((ticket) => (
                    <TicketCard key={ticket.tokenId} ticket={ticket} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ticket QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            {selectedTicket && (
              <>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      `${window.location.origin}/event/${selectedTicket.eventId}`
                    )}`} 
                    alt="Ticket QR Code" 
                    className="w-48 h-48"
                  />
                </div>
                <p className="font-mono text-lg font-bold">{selectedTicket.eventName}</p>
                <p className="text-muted-foreground text-sm">Token ID: #{selectedTicket.tokenId}</p>
                <a 
                  href={`https://sepolia.arbiscan.io/nft/${CONTRACT_ADDRESSES.ticket}/${selectedTicket.tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm mt-2 flex items-center gap-1 hover:underline"
                >
                  View on Arbiscan <ExternalLink className="h-3 w-3" />
                </a>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAttendanceProof} onOpenChange={setShowAttendanceProof}>
        <DialogContent className="max-w-md">
          {selectedTicket && (
            <AttendanceProof
              eventId={selectedTicket.eventId}
              eventName={selectedTicket.eventName}
              eventDate={Math.floor(new Date(selectedTicket.eventDate).getTime() / 1000)}
              eventLocation={selectedTicket.location}
              ticketId={selectedTicket.tokenId}
              tokenId={selectedTicket.tokenId}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showTransfer} onOpenChange={setShowTransfer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Ticket</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="address">Recipient Address</Label>
            <Input 
              id="address" 
              placeholder="0x..." 
              value={transferAddress}
              onChange={(e) => setTransferAddress(e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransfer(false)}>Cancel</Button>
            <Button 
              onClick={handleTransfer} 
              disabled={isSubmitting || !transferAddress}
              className="bg-copper-500 hover:bg-copper-600"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showResell} onOpenChange={setShowResell}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>List for Resale</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {maxResalePrice !== "0" && (
              <p className="text-xs text-amber-500 mb-4">
                Maximum resale price: ${(parseInt(maxResalePrice) / 1e18 * prices.ETH).toFixed(2)}
              </p>
            )}
            <Label htmlFor="price">Price (USD)</Label>
            <Input 
              id="price" 
              type="number"
              step="0.001"
              placeholder="0.00" 
              value={resellPrice}
              onChange={(e) => setResellPrice(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResell(false)}>Cancel</Button>
            <Button 
              onClick={handleResell} 
              disabled={isSubmitting || !resellPrice}
              className="bg-copper-500 hover:bg-copper-600"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowLeftRight className="h-4 w-4 mr-2" />}
              List Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </Background>
  );
};

export default MyTickets;

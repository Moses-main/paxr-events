import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileText, Globe, Mail } from "lucide-react";

const LegalPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-28 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Legal <span className="text-gradient-copper">Documents</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Review our privacy policy, terms of service, and other legal documents.
          </p>
        </motion.div>

        <Tabs defaultValue="privacy" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Terms of Service
            </TabsTrigger>
          </TabsList>

          <TabsContent value="privacy">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-copper" />
                  Privacy Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-muted-foreground">
                <section>
                  <h3 className="text-foreground font-semibold mb-2">1. Introduction</h3>
                  <p>
                    Paxr ("we," "our," or "us") is a decentralized event ticketing platform built on 
                    Arbitrum. We are committed to protecting your privacy and ensuring transparency in 
                    how we handle your data. This Privacy Policy explains our practices.
                  </p>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">2. Data We Collect</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Wallet Address:</strong> For transaction purposes on the blockchain</li>
                    <li><strong>Email Address:</strong> Optional, for account recovery and notifications</li>
                    <li><strong>Event Data:</strong> Events you create or attend</li>
                    <li><strong>Transaction History:</strong> On-chain records of ticket purchases and transfers</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">3. How We Use Your Data</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Process ticket purchases and mint NFT tickets</li>
                    <li>Provide event management tools for organizers</li>
                    <li>Send important notifications about events</li>
                    <li>Improve our services based on usage patterns</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">4. Blockchain Transparency</h3>
                  <p>
                    Please note that blockchain transactions are inherently public. Your wallet address 
                    and transaction history are visible on the blockchain and cannot be erased. We 
                    cannot control who views this information.
                  </p>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">5. Data Storage</h3>
                  <p>
                    Most data is stored on-chain via smart contracts. Off-chain data (emails, profiles) 
                    is stored in encrypted databases with industry-standard security measures.
                  </p>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">6. Third-Party Services</h3>
                  <p>
                    We use the following third-party services:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li><strong>Alchemy:</strong> Blockchain data indexing</li>
                    <li><strong>Privy:</strong> Wallet connection and authentication</li>
                    <li><strong>IPFS:</strong> Decentralized storage for event metadata</li>
                    <li><strong>MoonPay/Transak:</strong> Fiat on-ramp services</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">7. Contact Us</h3>
                  <p>
                    For privacy-related inquiries, please contact us at:
                    <br />
                    <a href="mailto:officialpaxr@gmail.com" className="text-copper hover:underline">
                      officialpaxr@gmail.com
                    </a>
                  </p>
                </section>

                <section className="pt-4 border-t border-border">
                  <p className="text-sm">
                    <strong>Last Updated:</strong> February 16, 2026
                  </p>
                </section>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="terms">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-copper" />
                  Terms of Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-muted-foreground">
                <section>
                  <h3 className="text-foreground font-semibold mb-2">1. Acceptance of Terms</h3>
                  <p>
                    By accessing and using Paxr, you accept and agree to be bound by the terms and 
                    provisions of this agreement. If you do not agree to these terms, please do 
                    not use our platform.
                  </p>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">2. Description of Service</h3>
                  <p>
                    Paxr is a decentralized event ticketing platform that enables organizers to 
                    create events and sell NFT-based tickets. Users can purchase, resell, and 
                    transfer tickets on the platform.
                  </p>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">3. User Responsibilities</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>You must be at least 18 years old to use this platform</li>
                    <li>You are responsible for maintaining the security of your wallet</li>
                    <li>You agree not to use the platform for any illegal purposes</li>
                    <li>You are solely responsible for your transactions on the blockchain</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">4. Ticket Purchases</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>All ticket purchases are final and non-refundable</li>
                    <li>Tickets are NFT tokens that you own once purchased</li>
                    <li>Resale may be subject to price caps set by organizers</li>
                    <li>Paxr charges a 7% platform fee on all transactions</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">5. Organizer Terms</h3>
                  <p>Event organizers agree to:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Provide accurate event information</li>
                    <li>Honor tickets sold through the platform</li>
                    <li>Comply with applicable laws and regulations</li>
                    <li>Set reasonable resale price caps</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">6. Disclaimers</h3>
                  <p>
                    THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE DO NOT 
                    GUARANTEE THAT THE PLATFORM WILL BE UNINTERRUPTED OR ERROR-FREE. 
                    BLOCKCHAIN TRANSACTIONS ARE IRREVERSIBLE.
                  </p>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">7. Limitation of Liability</h3>
                  <p>
                    Paxr shall not be liable for any indirect, incidental, special, consequential, 
                    or punitive damages resulting from your use of or inability to use the platform.
                  </p>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">8. Governing Law</h3>
                  <p>
                    These terms shall be governed by and construed in accordance with applicable laws.
                    Any disputes shall be resolved through arbitration.
                  </p>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">9. Contact</h3>
                  <p>
                    For questions about these terms, contact us at:
                    <br />
                    <a href="mailto:officialpaxr@gmail.com" className="text-copper hover:underline">
                      officialpaxr@gmail.com
                    </a>
                  </p>
                </section>

                <section className="pt-4 border-t border-border">
                  <p className="text-sm">
                    <strong>Last Updated:</strong> February 16, 2026
                  </p>
                </section>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default LegalPage;

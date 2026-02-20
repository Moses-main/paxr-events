import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "./providers/Web3Provider";

const Index = lazy(() => import("./pages/Index"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const MyTickets = lazy(() => import("./pages/MyTickets"));
const CreateEvent = lazy(() => import("./pages/CreateEvent"));
const Communities = lazy(() => import("./pages/Communities"));
const OrganizerDashboard = lazy(() => import("./pages/OrganizerDashboard"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const CommunityDetail = lazy(() => import("./pages/CommunityDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <Web3Provider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<CreateEvent />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/community/:id" element={<CommunityDetail />} />
            <Route path="/dashboard" element={<OrganizerDashboard />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </Web3Provider>
);

export default App;

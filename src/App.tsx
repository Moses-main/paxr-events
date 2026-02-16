import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "./providers/Web3Provider";
import Index from "./pages/Index";
import EventDetail from "./pages/EventDetail";
import Marketplace from "./pages/Marketplace";
import MyTickets from "./pages/MyTickets";
import CreateEvent from "./pages/CreateEvent";
import Communities from "./pages/Communities";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import HowItWorksPage from "./pages/HowItWorksPage";
import NotFound from "./pages/NotFound";

const App = () => (
  <Web3Provider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/dashboard" element={<OrganizerDashboard />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Web3Provider>
);

export default App;

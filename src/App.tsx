import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/features/auth/useAuth";
import Index from "@/app/pages/Index";
import Planning from "@/app/pages/Planning";
import Result from "@/app/pages/Result";
import SavedPlans from "@/app/pages/SavedPlans";
import LocationDetail from "@/app/pages/LocationDetail";
import Auth from "@/app/pages/Auth";
import Premium from "@/app/pages/Premium";
import Checkout from "@/app/pages/Checkout";
import Profile from "@/app/pages/Profile";
import AdminUsers from "@/features/admin/AdminUsers";
import AdminLogin from "@/features/admin/AdminLogin";
import AdminChatInbox from "@/features/admin/AdminChatInbox";
import NotFound from "@/app/pages/NotFound";
import MobileNav from "@/components/MobileNav";
import { ChatWidget } from "@/features/chat/ChatWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/result" element={<Result />} />
            <Route path="/saved" element={<SavedPlans />} />
            <Route path="/location" element={<LocationDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/chat" element={<AdminChatInbox />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MobileNav />
          <ChatWidget />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

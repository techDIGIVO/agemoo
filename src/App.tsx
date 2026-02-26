import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import { ScrollToTop } from "@/components/ScrollToTop";
import CookieBanner from "@/components/CookieBanner";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Gear from "./pages/Gear";
import Marketplace from "./pages/Marketplace";
import ServiceDetail from "./pages/ServiceDetail";
import GearDetail from "./pages/GearDetail";
import VendorProfile from "./pages/VendorProfile";
import Messages from "./pages/Messages";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import CreateBlogPost from "./pages/CreateBlogPost";
import Dashboard from "./pages/Dashboard";
import DashboardBookings from "./pages/DashboardBookings";
import DashboardProfile from "./pages/DashboardProfile";
import DashboardSaved from "./pages/DashboardSaved";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import Help from "./pages/Help";
import Safety from "./pages/Safety";
import Community from "./pages/Community";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
// import Press from "./pages/Press"; // temporarily removed
import Cookies from "./pages/Cookies";
import GDPR from "./pages/GDPR";
import SupportFAQ from "./pages/SupportFAQ";
import AuthPage from "./pages/Auth";
import VendorRegistration from "./pages/VendorRegistration";
import CollectionDetail from "./pages/CollectionDetail";
import ProfileSettings from "./pages/ProfileSettings";
import GearAvailabilityPage from "./pages/GearAvailabilityPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminServices from "./pages/admin/AdminServices";
import AdminGear from "./pages/admin/AdminGear";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminSubscribers from "./pages/admin/AdminSubscribers";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

const App = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <CookieBanner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/services" element={<Services />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/vendor-registration" element={<VendorRegistration />} />
                <Route path="/collection/:id" element={<CollectionDetail />} />
                <Route path="/service/:slug" element={<ServiceDetail />} />
                <Route path="/gear" element={<Gear />} />
                <Route path="/profile/settings" element={<ProfileSettings />} />
                <Route path="/gear/:id" element={<GearDetail />} />
                <Route path="/gear/:id/availability" element={<GearAvailabilityPage />} />
                <Route path="/vendor/:vendorId" element={<VendorProfile />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/dashboard/messages" element={<Messages />} />
                <Route path="/dashboard/bookings" element={<DashboardBookings />} />
                <Route path="/dashboard/profile" element={<DashboardProfile />} />
                <Route path="/dashboard/saved" element={<DashboardSaved />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/new" element={<CreateBlogPost />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/help" element={<Help />} />
                <Route path="/safety" element={<Safety />} />
                <Route path="/community" element={<Community />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                {/* <Route path="/press" element={<Press />} /> temporarily removed */}
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/gdpr" element={<GDPR />} />
                <Route path="/support/faqs" element={<SupportFAQ />} />

                {/* Admin routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminOverview />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="services" element={<AdminServices />} />
                  <Route path="gear" element={<AdminGear />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="subscribers" element={<AdminSubscribers />} />
                  <Route path="messages" element={<AdminMessages />} />
                  <Route path="support" element={<AdminSupport />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

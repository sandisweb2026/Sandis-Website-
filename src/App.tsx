import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import EnquiryPopup from "@/components/EnquiryPopup";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTours from "./pages/admin/AdminTours";
import AdminServices from "./pages/admin/AdminServices";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16">Loading...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  const allowedEmails = ["praavi.consultants@gmail.com", "sandisweb2026@gmail.com"];
  const isAllowedEmail = !!user.email && allowedEmails.includes(user.email.toLowerCase());
  if (!isAdmin && !isAllowedEmail) {
    return <div className="min-h-screen flex items-center justify-center pt-16 text-destructive">Access Denied</div>;
  }
  return <>{children}</>;
};

const AppLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      {!isHome && <Header />}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/holidays" element={<Tours />} />
          <Route path="/holidays/:id" element={<TourDetail />} />
          <Route path="/tours" element={<Navigate to="/holidays" replace />} />
          <Route path="/tours/:id" element={<Navigate to="/holidays" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/tours" element={<AdminRoute><AdminTours /></AdminRoute>} />
          <Route path="/admin/services" element={<AdminRoute><AdminServices /></AdminRoute>} />
          <Route path="/admin/enquiries" element={<AdminRoute><AdminEnquiries /></AdminRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isHome && <Footer />}
      <WhatsAppButton />
      <EnquiryPopup />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

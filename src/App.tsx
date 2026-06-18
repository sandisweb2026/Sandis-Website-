import { useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CallButton from "@/components/CallButton";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServices from "./pages/admin/AdminServices";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminPackages from "./pages/admin/AdminPackages";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const ADMIN_ENTRY_PATH = "/sandis_tours_26";
const GA4_MEASUREMENT_ID =
  import.meta.env.VITE_GA4_MEASUREMENT_ID?.trim() || "G-8TF1T8DHN4";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16">Loading...</div>;
  if (!user) return <Navigate to={ADMIN_ENTRY_PATH} replace />;
  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center pt-16 text-destructive">Access Denied</div>;
  }
  return <>{children}</>;
};

const AdminEntry = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        Loading...
      </div>
    );
  }

  if (!user) return <AdminLogin />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 text-destructive">
        Access Denied
      </div>
    );
  }

  return <AdminDashboard />;
};

const AppLayout = () => {
  const location = useLocation();
  const isFirstLocationRender = useRef(true);
  const isHomePage = location.pathname === "/" || location.pathname === "/home";
  const pagePath = `${location.pathname}${location.search}`;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  useEffect(() => {
    if (!GA4_MEASUREMENT_ID) return;

    if (isFirstLocationRender.current) {
      isFirstLocationRender.current = false;
      return;
    }

    if (
      location.pathname.startsWith("/admin") ||
      location.pathname === ADMIN_ENTRY_PATH
    ) {
      return;
    }

    // Track SPA route changes in GA4 without double-counting the initial load.
    window.gtag?.("config", GA4_MEASUREMENT_ID, {
      page_path: pagePath,
    });
  }, [location.pathname, location.search, pagePath]);

  return (
    <>
      {!isHomePage && <Header />}
      <main className="min-h-screen site-page-background">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/services" element={<Services />} />
          <Route path="/holidays" element={<Tours />} />
          <Route path="/holidays/:id" element={<TourDetail />} />
          <Route path="/tours" element={<Navigate to="/holidays" replace />} />
          <Route path="/tours/:id" element={<Navigate to="/holidays" replace />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path={ADMIN_ENTRY_PATH} element={<AdminEntry />} />
          <Route path="/admin/login" element={<Navigate to={ADMIN_ENTRY_PATH} replace />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/tours" element={<AdminRoute><Navigate to="/admin/packages" replace /></AdminRoute>} />
          <Route path="/admin/packages" element={<AdminRoute><AdminPackages /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
          <Route path="/admin/banners" element={<AdminRoute><AdminBanners /></AdminRoute>} />
          <Route path="/admin/gallery" element={<AdminRoute><AdminGallery /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
          <Route path="/admin/services" element={<AdminRoute><AdminServices /></AdminRoute>} />
          <Route path="/admin/enquiries" element={<AdminRoute><AdminEnquiries /></AdminRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isHomePage && <Footer />}
      {isHomePage && (
        <>
          <CallButton />
          <WhatsAppButton />
        </>
      )}
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

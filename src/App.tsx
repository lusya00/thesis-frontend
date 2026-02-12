import { ChatBot } from "@/components/ChatBot";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useOAuthCallback } from "@/hooks/useOAuthCallback";
import { TranslationProvider } from "@/hooks/useTranslation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load heavy components for better performance
const BookNow = lazy(() => import("./pages/BookNow"));
const AccommodationPage = lazy(() => import("./pages/AccommodationPage"));
const HomestayDetailPage = lazy(() => import("./pages/HomestayDetailPage"));
const ActivitiesPage = lazy(() => import("./pages/ActivitiesPage"));

const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const BookingDetailPage = lazy(() => import("./pages/BookingDetailPage"));
const UserBookings = lazy(() => import("./pages/user/bookings"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ConservationPage = lazy(() => import("./pages/ConservationPage"));
const ProfileManagement = lazy(() => import("./pages/ProfileManagement"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Sitemap = lazy(() => import("./pages/Sitemap"));

// import OAuthDebugger from '@/components/OAuthDebugger'; // Uncomment if debug route is needed

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
    <div className="text-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-ocean border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="mt-6 space-y-2">
        <p className="text-xl font-semibold text-ocean-dark">Loading your island escape...</p>
        <p className="text-sm text-ocean/70">Preparing the perfect experience for you</p>
      </div>
    </div>
  </div>
);

// OAuth Callback Component (Local)
const LocalOAuthCallback = () => {
  const { isProcessing } = useOAuthCallback();
  
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ocean border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-ocean-dark">Completing your sign-in...</p>
        </div>
      </div>
    );
  }
  
  return null;
};

// OAuth Dashboard Redirect Component
const DashboardRedirect = () => {
  const { isProcessing } = useOAuthCallback();
  
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ocean border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-ocean-dark">Completing your sign-in...</p>
        </div>
      </div>
    );
  }
  
  // After OAuth processing, redirect to user dashboard
  return <Navigate to="/user/dashboard" replace />;
};

// Scroll to Top Component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Smooth scroll to top on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [pathname]);

  return null;
};

// Main App Routes Component (inside Router context)
const AppRoutes = () => {
  // Global OAuth handler - now runs inside Router context
  useOAuthCallback();
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/conservation" element={<ConservationPage />} />
          <Route path="/book" element={<BookNow />} />
          <Route path="/homestays" element={<AccommodationPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/homestay/:id" element={<HomestayDetailPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/sitemap" element={<Sitemap />} />
          
          {/* OAuth callback routes */}
          <Route path="/auth/callback" element={<LocalOAuthCallback />} />
          <Route path="/oauth/callback" element={<LocalOAuthCallback />} />
          <Route path="/api/oauth/google/callback" element={<LocalOAuthCallback />} />
          
          {/* Debug routes - Uncomment if needed for OAuth debugging */}
          {/* <Route path="/debug/oauth" element={<OAuthDebugger />} /> */}
          
          
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/dashboard/*" element={<Navigate to="/user/dashboard" replace />} />
          
          {/* User dashboard and booking routes */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/bookings" element={<UserDashboard />} />
          <Route path="/user/settings" element={<UserDashboard />} />
          <Route path="/user/profile" element={<UserDashboard />} />
          <Route path="/profile-management" element={<ProfileManagement />} />
          <Route path="/booking/:bookingId" element={<BookingDetailPage />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Suspense>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ChatBot />
          <BrowserRouter>
            <ScrollToTop />
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
};

export default App; 
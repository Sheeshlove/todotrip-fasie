
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { setupSessionTimeout } from './utils/secureSessionUtils';
import { toast } from 'sonner';
import OnboardingScreen from "./components/OnboardingScreen";
import Home from "./pages/Home";
import Dating from "./pages/Dating";
import Partners from "./pages/Partners";
import PartnerDetails from "./pages/PartnerDetails";
import CreateProfile from "./pages/CreateProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import ProfilePage from "./pages/ProfilePage";
import AiTrip from "./pages/AiTrip";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import CustomCursor from "./components/CustomCursor";

// Import custom styles
import "./styles/custom-scrollbar.css";

// Create the queryClient with enhanced security options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // Add security related settings
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onError: (error: unknown) => {
        console.error('Query error:', error);
        toast.error('Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
      }
    },
    mutations: {
      // Add security related settings for mutations
      onError: (error: unknown) => {
        console.error('Mutation error:', error);
        toast.error('Ошибка сохранения данных. Пожалуйста, попробуйте снова.');
      }
    }
  },
});

// Security headers setup
const setupSecurityHeaders = () => {
  // These would typically be set on the server, but we can report violations in the client
  const reportViolation = (e: SecurityPolicyViolationEvent) => {
    console.error('Content Security Policy violation:', e);
  };

  document.addEventListener('securitypolicyviolation', reportViolation);
  
  return () => {
    document.removeEventListener('securitypolicyviolation', reportViolation);
  };
};

const App: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = React.useState(true);
  const [isDesktop, setIsDesktop] = React.useState(false);

  // Set up security measures
  useEffect(() => {
    // Set up security headers monitoring
    const cleanupSecurityHeaders = setupSecurityHeaders();
    
    // Set up session timeout (30 minutes)
    const cleanupSessionTimeout = setupSessionTimeout(30, () => {
      toast.warning('Ваша сессия истекла. Пожалуйста, войдите снова для продолжения.');
      // The actual logout will be handled by the AuthProvider
    });

    return () => {
      cleanupSecurityHeaders();
      cleanupSessionTimeout();
    };
  }, []);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    if (hasCompletedOnboarding) {
      setShowOnboarding(false);
    }

    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    return () => {
      window.removeEventListener('resize', checkDesktop);
    };
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return (
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ErrorBoundary>
              {isDesktop && <CustomCursor />}
              <OnboardingScreen onComplete={handleOnboardingComplete} />
            </ErrorBoundary>
          </TooltipProvider>
        </HelmetProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <ErrorBoundary>
                {isDesktop && <CustomCursor />}
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/partners/:id" element={<PartnerDetails />} />
                  <Route 
                    path="/dating" 
                    element={
                      <ProtectedRoute>
                        <Dating />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/ai-trip" element={<AiTrip />} />
                  <Route 
                    path="/create-profile" 
                    element={
                      <ProtectedRoute>
                        <CreateProfile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/login" 
                    element={
                      <ProtectedRoute requiredAuth={false}>
                        <Login />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/register" 
                    element={
                      <ProtectedRoute requiredAuth={false}>
                        <Register />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/unauthorized" element={<NotFound />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;

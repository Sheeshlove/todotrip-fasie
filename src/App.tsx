
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from "./components/ErrorBoundary";
import CustomCursor from "./components/CustomCursor";
import LoadingIndicator from "./components/LoadingIndicator";
import PageLayout from "./components/PageLayout";
import RouteTransition from "./components/RouteTransition";

// Import custom styles
import "./styles/custom-scrollbar.css";

// Lazy load components with proper preloading
const OnboardingScreen = lazy(() => import("./components/OnboardingScreen"));
const Home = lazy(() => {
  const component = import("./pages/Home");
  return component;
});
const Dating = lazy(() => import("./pages/Dating"));
const Partners = lazy(() => import("./pages/Partners"));
const PartnerDetails = lazy(() => import("./pages/PartnerDetails"));
const CreateProfile = lazy(() => import("./pages/CreateProfile"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Contact = lazy(() => import("./pages/Contact"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AiTrip = lazy(() => import("./pages/AiTrip"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Create the queryClient outside of the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute caching to improve performance
    },
  },
});

// Preload commonly used routes
const preloadRoutes = () => {
  // Preload common routes after initial load
  setTimeout(() => {
    import("./pages/Home");
    import("./pages/Dating");
    import("./pages/Partners");
    import("./pages/ProfilePage");
  }, 2000);
};

const App: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

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
    
    // Preload routes after initial render
    if (hasCompletedOnboarding) {
      preloadRoutes();
    }

    return () => {
      window.removeEventListener('resize', checkDesktop);
    };
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
    // Preload routes after onboarding completes
    preloadRoutes();
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
              <Suspense fallback={
                <div className="min-h-screen flex flex-col items-center justify-center">
                  <LoadingIndicator
                    size="large"
                    message="Запуск ToDoTrip"
                    submessage="Подождите немного..."
                  />
                </div>
              }>
                <OnboardingScreen onComplete={handleOnboardingComplete} />
              </Suspense>
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
                  <Route path="*" element={
                    <PageLayout>
                      <Suspense fallback={<RouteTransition />}>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/partners" element={<Partners />} />
                          <Route path="/partners/:id" element={<PartnerDetails />} />
                          <Route path="/dating" element={<Dating />} />
                          <Route path="/ai-trip" element={<AiTrip />} />
                          <Route path="/create-profile" element={<CreateProfile />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                    </PageLayout>
                  } />
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

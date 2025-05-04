import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from './context/AuthContext';
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
import AiTrip from "./pages/AiTrip"; // Import the new AiTrip page
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import CustomCursor from "./components/CustomCursor";

// Import custom styles
import "./styles/custom-scrollbar.css";

// Create the queryClient outside of the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = React.useState(true);
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
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
                  <Route path="/dating" element={<Dating />} />
                  <Route path="/ai-trip" element={<AiTrip />} />
                  <Route path="/create-profile" element={<CreateProfile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/contact" element={<Contact />} />
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

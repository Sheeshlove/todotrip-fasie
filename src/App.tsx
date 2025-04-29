import React, { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from './context/AuthContext';
import OnboardingScreen from "./components/OnboardingScreen";
import ErrorBoundary from "./components/ErrorBoundary";
import CustomCursor from "./components/CustomCursor";
import LoadingSpinner from "./components/LoadingSpinner";

// Create the queryClient outside of the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Lazy load route components
const Home = React.lazy(() => import("./pages/Home"));
const Dating = React.lazy(() => import("./pages/Dating"));
const Partners = React.lazy(() => import("./pages/Partners"));
const PartnerDetails = React.lazy(() => import("./pages/PartnerDetails"));
const CreateProfile = React.lazy(() => import("./pages/CreateProfile"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Contact = React.lazy(() => import("./pages/Contact"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Wrapper component for OnboardingScreen to provide navigation
const OnboardingWrapper = () => {
  const navigate = useNavigate();
  return <OnboardingScreen onComplete={() => navigate("/")} />;
};

const App = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <TooltipProvider>
              <Suspense fallback={<LoadingSpinner />}>
                <AuthProvider>
                  <Routes>
                    <Route path="/onboarding" element={<OnboardingWrapper />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/create-profile" element={<CreateProfile />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/dating" element={<Dating />} />
                    <Route path="/partners" element={<Partners />} />
                    <Route path="/partners/:id" element={<PartnerDetails />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <CustomCursor />
                  <Sonner position="top-right" />
                  <Toaster />
                </AuthProvider>
              </Suspense>
            </TooltipProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;

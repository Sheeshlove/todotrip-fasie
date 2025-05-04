
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { setupSessionTimeout } from './utils/secureSessionUtils';
import { setupSecurityHeaders } from './utils/securitySetup';
import { toast } from 'sonner';
import { queryClient } from './lib/query-client';
import ErrorBoundary from "./components/ErrorBoundary";
import OnboardingWrapper from "./components/OnboardingWrapper";
import AppRoutes from "./routes/AppRoutes";

// Import custom styles
import "./styles/custom-scrollbar.css";

const App: React.FC = () => {
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

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ErrorBoundary>
            <OnboardingWrapper>
              <AppRoutes />
            </OnboardingWrapper>
          </ErrorBoundary>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;

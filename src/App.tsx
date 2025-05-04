
import React, { useEffect } from 'react';
import { setupSessionTimeout } from './utils/secureSessionUtils';
import { setupSecurityHeaders } from './utils/securitySetup';
import { toast } from 'sonner';
import ErrorBoundary from "./components/ErrorBoundary";
import OnboardingWrapper from "./components/OnboardingWrapper";
import AppRoutes from "./routes/AppRoutes";
import Providers from './components/Providers';

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
    <Providers>
      <ErrorBoundary>
        <OnboardingWrapper>
          <AppRoutes />
        </OnboardingWrapper>
      </ErrorBoundary>
    </Providers>
  );
};

export default App;

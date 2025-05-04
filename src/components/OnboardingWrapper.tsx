
import React, { useEffect, useState } from 'react';
import OnboardingScreen from './OnboardingScreen';
import CustomCursor from './CustomCursor';

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

const OnboardingWrapper: React.FC<OnboardingWrapperProps> = ({ children }) => {
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
      <>
        {isDesktop && <CustomCursor />}
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </>
    );
  }

  return (
    <>
      {isDesktop && <CustomCursor />}
      {children}
    </>
  );
};

export default OnboardingWrapper;


import { useState, useEffect } from 'react';
import OnboardingScreen from '@/components/OnboardingScreen';
import TripPlanner from '@/components/TripPlanner';
import PageLayout from '@/components/PageLayout';
import { preloadImages } from '@/data/placeholderImages';

const Home = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  useEffect(() => {
    preloadImages();
    
    // Check if user has already completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    if (hasCompletedOnboarding === 'true') {
      setShowOnboarding(false);
    }
  }, []);
  
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Store in localStorage that user has completed onboarding
    localStorage.setItem('hasCompletedOnboarding', 'true');
  };
  
  return (
    <PageLayout title="ToDoTrip - Куда бы вы хотели отправиться" description="AI-powered travel destinations" hideBottomMenu={showOnboarding}>
      {showOnboarding ? (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      ) : (
        <TripPlanner />
      )}
    </PageLayout>
  );
};

export default Home;


import { useState, useEffect } from 'react';
import OnboardingScreen from '@/components/OnboardingScreen';
import TripPlanner from '@/components/TripPlanner';
import PageLayout from '@/components/PageLayout';
import { preloadImages } from '@/data/placeholderImages';

const Home = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  useEffect(() => {
    preloadImages();
  }, []);
  
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
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

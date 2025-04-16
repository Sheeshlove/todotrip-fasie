
import { useState, useEffect } from 'react';
import OnboardingScreen from '@/components/OnboardingScreen';
import TripPlanner from '@/components/TripPlanner';
import Meta from '@/components/Meta';
import { preloadImages } from '@/data/placeholderImages';

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  // Preload images on component mount
  useEffect(() => {
    preloadImages();
  }, []);
  
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };
  
  return (
    <div className="min-h-screen bg-todoBlack">
      <Meta 
        title="ToDoTrip - AI Travel App" 
        description="Создаём туристические маршруты для путешествий по России и помогаем искать попутчиков по интересам"
      />
      {showOnboarding ? (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      ) : (
        <TripPlanner />
      )}
    </div>
  );
};

export default Index;

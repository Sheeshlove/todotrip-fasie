
import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { preloadImages } from '@/data/placeholderImages';
import RouteSelectionIntro from '@/components/RouteSelection/RouteSelectionIntro';
import RouteSelectionExplanation from '@/components/RouteSelection/RouteSelectionExplanation';
import CitySelection from '@/components/RouteSelection/CitySelection';
import SightSwiper from '@/components/RouteSelection/SightSwiper';
import RouteResult from '@/components/RouteSelection/RouteResult';
import { spbSights } from '@/data/spbSights';
import { Sight } from '@/components/RouteSelection/SightCard';

type RouteSelectionStage = 'intro' | 'explanation' | 'citySelection' | 'sightSelection' | 'result';

const Home = () => {
  const [stage, setStage] = useState<RouteSelectionStage>('intro');
  const [selectedSights, setSelectedSights] = useState<Sight[]>([]);
  
  useEffect(() => {
    preloadImages();
  }, []);
  
  const handleStartClick = () => {
    setStage('citySelection');
  };
  
  const handleHowItWorksClick = () => {
    setStage('explanation');
  };
  
  const handleExplanationContinue = () => {
    setStage('citySelection');
  };
  
  const handleCitySelect = () => {
    setStage('sightSelection');
  };
  
  const handleSwiperComplete = (sights: Sight[]) => {
    setSelectedSights(sights);
    setStage('result');
  };
  
  const handleReset = () => {
    setStage('intro');
    setSelectedSights([]);
  };
  
  const renderContent = () => {
    switch (stage) {
      case 'intro':
        return (
          <RouteSelectionIntro 
            onStartClick={handleStartClick} 
            onHowItWorksClick={handleHowItWorksClick} 
          />
        );
      case 'explanation':
        return <RouteSelectionExplanation onContinue={handleExplanationContinue} />;
      case 'citySelection':
        return <CitySelection onCitySelect={handleCitySelect} />;
      case 'sightSelection':
        return <SightSwiper sights={spbSights} onComplete={handleSwiperComplete} />;
      case 'result':
        return <RouteResult selectedSights={selectedSights} onReset={handleReset} />;
      default:
        return null;
    }
  };
  
  return (
    <PageLayout title="ToDoTrip - Подбор пути" description="AI-powered travel route planner">
      {renderContent()}
    </PageLayout>
  );
};

export default Home;

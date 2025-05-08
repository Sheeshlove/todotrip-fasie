
import { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { spbSights, preloadSightImages } from '@/data/spbSights';
import { useAiTripState } from '@/hooks/useAiTripState';
import TripHeader from '@/components/aiTrip/TripHeader';
import SightCarousel from '@/components/aiTrip/SightCarousel';
import RouteSettings from '@/components/aiTrip/RouteSettings';
import SightDetails from '@/components/aiTrip/SightDetails';

const AiTrip = () => {
  const {
    city,
    sights,
    currentSight,
    selectedSights,
    budget,
    hours,
    isGeneratingRoute,
    canGenerateRoute,
    toggleSightSelection,
    clearSelectedSights,
    goToNextSight,
    goToPreviousSight,
    goToSight,
    setBudget,
    setHours,
    generateRoute
  } = useAiTripState(spbSights);
  
  useEffect(() => {
    preloadSightImages();
  }, []);
  
  return (
    <PageLayout title={`ToDoTrip - ${city}`} description={`AI-маршрут по городу ${city}`}>
      <div className="flex flex-col min-h-[calc(100vh-160px)] px-4 pt-6 pb-20">
        <TripHeader city={city} />
        
        <div className="flex flex-col space-y-6">
          <SightCarousel 
            sights={sights}
            selectedSights={selectedSights}
            toggleSightSelection={toggleSightSelection}
            onViewDetails={goToSight}
            onClearSelection={clearSelectedSights}
          />
          
          <RouteSettings 
            budget={budget}
            hours={hours}
            isGeneratingRoute={isGeneratingRoute}
            canGenerateRoute={canGenerateRoute}
            onBudgetChange={setBudget}
            onHoursChange={setHours}
            onGenerateRoute={generateRoute}
          />
          
          {sights.length > 0 && (
            <SightDetails 
              sight={currentSight}
              onPrevious={goToPreviousSight}
              onNext={goToNextSight}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default AiTrip;

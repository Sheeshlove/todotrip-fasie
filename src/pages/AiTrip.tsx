
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import TripHeader from '@/components/aiTrip/TripHeader';
import TripPreferencesForm from '@/components/aiTrip/TripPreferencesForm';
import UnderDevelopmentMessage from '@/components/aiTrip/UnderDevelopmentMessage';

const AiTrip = () => {
  const location = useLocation();
  const [showResults, setShowResults] = useState(false);
  
  // Extract city from URL query parameter
  const params = new URLSearchParams(location.search);
  const city = params.get('city') || 'Санкт-Петербург';
  
  const handleSubmitPreferences = () => {
    setShowResults(true);
    // Scroll to top when showing results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <PageLayout title={`ToDoTrip - ${city}`} description={`AI-маршрут по городу ${city}`}>
      <div className="flex flex-col min-h-[calc(100vh-160px)] px-4 pt-8 pb-24 max-w-md mx-auto w-full">
        <TripHeader city={city} />
        
        <div className="flex flex-col space-y-6 w-full">
          {showResults ? (
            <UnderDevelopmentMessage />
          ) : (
            <TripPreferencesForm onSubmit={handleSubmitPreferences} />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default AiTrip;

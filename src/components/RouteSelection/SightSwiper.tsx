
import { FC, useState, useEffect } from 'react';
import SightCard, { Sight } from './SightCard';
import { Loader2 } from 'lucide-react';

interface SightSwiperProps {
  sights: Sight[];
  onComplete: (selectedSights: Sight[]) => void;
}

const SightSwiper: FC<SightSwiperProps> = ({ sights, onComplete }) => {
  const [currentSightIndex, setCurrentSightIndex] = useState(0);
  const [selectedSights, setSelectedSights] = useState<Sight[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const handleSwipeLeft = () => {
    if (currentSightIndex < sights.length - 1) {
      setCurrentSightIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };
  
  const handleSwipeRight = (sight: Sight) => {
    setSelectedSights(prev => [...prev, sight]);
    
    if (currentSightIndex < sights.length - 1) {
      setCurrentSightIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };
  
  useEffect(() => {
    if (isCompleted) {
      setTimeout(() => {
        onComplete(selectedSights);
      }, 1000);
    }
  }, [isCompleted, selectedSights, onComplete]);
  
  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-160px)]">
        <Loader2 className="h-12 w-12 animate-spin text-todoYellow mb-4" />
        <p className="text-lg text-center">Создаем ваш маршрут...</p>
      </div>
    );
  }
  
  return (
    <div className="pt-4 pb-20">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-400">Достопримечательность {currentSightIndex + 1} из {sights.length}</p>
      </div>
      
      {sights.length > 0 && (
        <SightCard 
          sight={sights[currentSightIndex]} 
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      )}
    </div>
  );
};

export default SightSwiper;

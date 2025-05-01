
import { useState, useEffect } from 'react';
import { Sight } from '@/data/spbSights';
import { useToast } from '@/components/ui/use-toast';

export function useAiTripSights(initialSights: Sight[]) {
  const [sights, setSights] = useState<Sight[]>(initialSights);
  const [selectedSights, setSelectedSights] = useState<Sight[]>([]);
  const [currentSightIndex, setCurrentSightIndex] = useState(0);
  const { toast } = useToast();
  
  // Toggle sight selection with a maximum of 5
  const toggleSightSelection = (sight: Sight) => {
    setSelectedSights(prev => {
      const isAlreadySelected = prev.some(s => s.id === sight.id);
      
      if (isAlreadySelected) {
        return prev.filter(s => s.id !== sight.id);
      } else {
        // Limit to 5 sights
        if (prev.length >= 5) {
          toast({
            title: "Максимум 5 мест",
            description: "Нельзя выбрать больше 5 мест для одного маршрута",
            variant: "destructive",
          });
          return prev;
        }
        return [...prev, sight];
      }
    });
  };
  
  const clearSelectedSights = () => {
    setSelectedSights([]);
  };
  
  const nextSight = () => {
    setCurrentSightIndex(prev => (prev < sights.length - 1 ? prev + 1 : 0));
  };
  
  const prevSight = () => {
    setCurrentSightIndex(prev => (prev > 0 ? prev - 1 : sights.length - 1));
  };
  
  const goToSight = (index: number) => {
    if (index >= 0 && index < sights.length) {
      setCurrentSightIndex(index);
    }
  };
  
  return {
    sights,
    selectedSights,
    currentSightIndex,
    currentSight: sights[currentSightIndex],
    toggleSightSelection,
    clearSelectedSights,
    nextSight,
    prevSight,
    goToSight
  };
}

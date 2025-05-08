
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sight } from '@/data/spbSights';
import { useToast } from '@/components/ui/use-toast';

export function useAiTripState(initialSights: Sight[]) {
  const location = useLocation();
  const { toast } = useToast();
  
  const [city, setCity] = useState<string>('Санкт-Петербург');
  const [sights, setSights] = useState<Sight[]>(initialSights);
  const [currentSightIndex, setCurrentSightIndex] = useState(0);
  const [selectedSights, setSelectedSights] = useState<Sight[]>([]);
  const [budget, setBudget] = useState([2000]);
  const [hours, setHours] = useState([4]);
  const [isGeneratingRoute, setIsGeneratingRoute] = useState(false);
  
  // Extract city from URL query parameter if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cityParam = params.get('city');
    if (cityParam) {
      setCity(cityParam);
    }
  }, [location]);
  
  // Toggle sight selection
  const toggleSightSelection = (sight: Sight) => {
    setSelectedSights(prevSelected => {
      const isAlreadySelected = prevSelected.some(s => s.id === sight.id);
      
      if (isAlreadySelected) {
        return prevSelected.filter(s => s.id !== sight.id);
      } else {
        // Limit to 5 sights
        if (prevSelected.length >= 5) {
          toast({
            title: "Максимум 5 мест",
            description: "Нельзя выбрать больше 5 мест для одного маршрута",
            variant: "destructive",
          });
          return prevSelected;
        }
        return [...prevSelected, sight];
      }
    });
  };
  
  // Clear selected sights
  const clearSelectedSights = () => {
    setSelectedSights([]);
  };
  
  // Navigate through sights
  const goToNextSight = () => {
    setCurrentSightIndex(prev => (prev < sights.length - 1 ? prev + 1 : 0));
  };
  
  const goToPreviousSight = () => {
    setCurrentSightIndex(prev => (prev > 0 ? prev - 1 : sights.length - 1));
  };
  
  const goToSight = (index: number) => {
    if (index >= 0 && index < sights.length) {
      setCurrentSightIndex(index);
      document.getElementById('sight-details')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Generate route
  const generateRoute = () => {
    if (selectedSights.length < 2) {
      toast({
        title: "Выберите больше мест",
        description: "Для создания маршрута выберите минимум 2 места",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingRoute(true);
    
    // Simulate AI processing
    setTimeout(() => {
      toast({
        title: "Маршрут создан!",
        description: `Оптимальный маршрут по ${selectedSights.length} местам в ${city}`,
      });
      setIsGeneratingRoute(false);
    }, 2000);
  };
  
  return {
    city,
    sights,
    currentSight: sights[currentSightIndex],
    selectedSights,
    budget,
    hours,
    isGeneratingRoute,
    toggleSightSelection,
    clearSelectedSights,
    goToNextSight,
    goToPreviousSight,
    goToSight,
    setBudget,
    setHours,
    generateRoute,
    canGenerateRoute: selectedSights.length >= 2
  };
}

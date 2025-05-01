
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import BottomMenu from '@/components/BottomMenu';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useIsMobile } from '@/hooks/use-mobile';
import { spbSights, Sight, preloadSightImages } from '@/data/spbSights';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from '@/components/ui/carousel';
import { 
  MapPin, 
  Clock, 
  Sparkles, 
  Tag, 
  Globe, 
  Phone,
  ChevronRight, 
  ArrowLeft,
  Info, 
  Star, 
  Filter,
  HeartIcon,
  Shuffle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AiTrip = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [city, setCity] = useState<string>('Санкт-Петербург');
  const [sights, setSights] = useState<Sight[]>(spbSights);
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
    
    // Preload sight images
    preloadSightImages();
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

  // Generate route - just a simulation for now
  const handleGenerateRoute = () => {
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
  
  return (
    <PageLayout title={`ToDoTrip - ${city}`} description={`AI-маршрут по городу ${city}`}>
      <div className="flex flex-col min-h-[calc(100vh-160px)] px-4 pt-6 pb-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-todoYellow flex items-center">
              <MapPin className="mr-2" size={24} /> {city}
            </h1>
            <p className="text-todoLightGray text-sm mt-1">
              AI-планировщик маршрутов
            </p>
          </div>
          <Button 
            variant="secondary" 
            className="bg-todoBlack/60 border border-white/10 text-white"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={16} className="mr-1" /> Назад
          </Button>
        </div>
        
        {/* Main content */}
        <div className="flex flex-col space-y-6">
          {/* Sight Carousel */}
          <Card className="bg-todoDarkGray/50 backdrop-blur-sm border-white/5 p-4 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <div className="bg-todoYellow/20 p-2 rounded-full mr-3">
                <Sparkles size={20} className="text-todoYellow" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Достопримечательности
              </h2>
            </div>

            <Carousel className="w-full">
              <CarouselContent>
                {sights.map((sight) => (
                  <CarouselItem key={sight.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden bg-todoBlack/60 border-white/5 hover:border-todoYellow/30 transition-all">
                        <div className="aspect-square relative bg-gray-800">
                          {/* Placeholder for image */}
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                            <span className="text-todoLightGray">Фото</span>
                          </div>
                          
                          {/* Selection button */}
                          <Button
                            variant="secondary"
                            size="sm"
                            className={`absolute top-2 right-2 p-2 rounded-full ${
                              selectedSights.some(s => s.id === sight.id) 
                                ? 'bg-todoYellow text-black' 
                                : 'bg-black/50 text-white'
                            }`}
                            onClick={() => toggleSightSelection(sight)}
                          >
                            {selectedSights.some(s => s.id === sight.id) ? (
                              <Star size={18} fill="black" />
                            ) : (
                              <Star size={18} />
                            )}
                          </Button>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-white line-clamp-1">
                            {sight.name}
                          </h3>
                          <div className="flex items-center mt-2 text-xs text-todoLightGray">
                            <Tag size={12} className="mr-1" />
                            <span>{sight.price}</span>
                          </div>
                          <div className="flex items-center mt-1 text-xs text-todoLightGray">
                            <Clock size={12} className="mr-1" />
                            <span className="line-clamp-1">{sight.hours}</span>
                          </div>
                          <Button 
                            variant="link" 
                            className="px-0 h-auto mt-2 text-todoYellow"
                            onClick={() => {
                              setCurrentSightIndex(sights.findIndex(s => s.id === sight.id));
                              document.getElementById('sight-details')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                          >
                            Подробнее <ChevronRight size={16} />
                          </Button>
                        </div>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex left-0" />
              <CarouselNext className="hidden md:flex right-0" />
            </Carousel>

            {/* Selected count */}
            <div className="flex justify-between items-center mt-4 text-sm">
              <span className="text-todoLightGray">
                Выбрано: <span className="text-todoYellow font-medium">{selectedSights.length}/5</span>
              </span>
              
              <Button 
                variant="link" 
                className="text-todoYellow px-0 h-6"
                onClick={() => setSelectedSights([])}
                disabled={selectedSights.length === 0}
              >
                Сбросить выбор
              </Button>
            </div>
          </Card>
          
          {/* Route Settings */}
          <Card className="bg-todoDarkGray/50 backdrop-blur-sm border-white/5 p-4 rounded-xl shadow-lg" id="sight-details">
            <div className="flex items-center mb-4">
              <div className="bg-todoYellow/20 p-2 rounded-full mr-3">
                <Filter size={20} className="text-todoYellow" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Настройки маршрута
              </h2>
            </div>
            
            <div className="space-y-6 mb-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-todoLightGray">Бюджет</span>
                  <span className="text-white">{budget[0]} ₽</span>
                </div>
                <Slider 
                  defaultValue={budget} 
                  max={10000} 
                  step={500} 
                  onValueChange={setBudget} 
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-todoLightGray">Продолжительность</span>
                  <span className="text-white">{hours[0]} ч</span>
                </div>
                <Slider 
                  defaultValue={hours} 
                  max={10} 
                  step={1} 
                  onValueChange={setHours} 
                />
              </div>
            </div>
            
            <Button 
              className="w-full bg-todoYellow hover:bg-todoYellow/80 text-black font-medium"
              disabled={selectedSights.length < 2 || isGeneratingRoute}
              onClick={handleGenerateRoute}
            >
              {isGeneratingRoute ? (
                <>Создаем маршрут...</>
              ) : (
                <>Создать маршрут <Shuffle className="ml-2" size={16} /></>
              )}
            </Button>
          </Card>
          
          {/* Detailed sight info */}
          {sights.length > 0 && (
            <Card className="bg-todoDarkGray/50 backdrop-blur-sm border-white/5 p-4 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-todoYellow/20 p-2 rounded-full mr-3">
                  <Info size={20} className="text-todoYellow" />
                </div>
                <h2 className="text-lg font-semibold text-white">
                  Информация
                </h2>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-todoYellow mb-2">
                  {sights[currentSightIndex].name}
                </h3>
                
                <p className="text-todoLightGray mb-4 leading-relaxed">
                  {sights[currentSightIndex].description}
                </p>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <Tag size={16} className="mr-2 text-todoLightGray mt-1 flex-shrink-0" />
                    <div className="text-white">{sights[currentSightIndex].price}</div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock size={16} className="mr-2 text-todoLightGray mt-1 flex-shrink-0" />
                    <div className="text-white">{sights[currentSightIndex].hours}</div>
                  </div>
                  
                  <div className="flex items-start">
                    <Globe size={16} className="mr-2 text-todoLightGray mt-1 flex-shrink-0" />
                    <div>
                      <a 
                        href={sights[currentSightIndex].websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-todoYellow hover:underline"
                      >
                        {sights[currentSightIndex].website}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone size={16} className="mr-2 text-todoLightGray mt-1 flex-shrink-0" />
                    <div className="text-white">{sights[currentSightIndex].contacts}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  className="border-white/10 hover:bg-todoBlack hover:border-todoYellow/30"
                  onClick={() => setCurrentSightIndex(prev => (prev > 0 ? prev - 1 : sights.length - 1))}
                >
                  Предыдущий
                </Button>
                
                <Button
                  variant="outline"
                  className="border-white/10 hover:bg-todoBlack hover:border-todoYellow/30"
                  onClick={() => setCurrentSightIndex(prev => (prev < sights.length - 1 ? prev + 1 : 0))}
                >
                  Следующий
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default AiTrip;

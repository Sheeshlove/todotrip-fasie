
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Tag, Clock, ChevronRight, Star } from 'lucide-react';
import { Sight } from '@/data/spbSights';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from '@/components/ui/carousel';

interface SightCarouselProps {
  sights: Sight[];
  selectedSights: Sight[];
  toggleSightSelection: (sight: Sight) => void;
  onViewDetails: (index: number) => void;
  onClearSelection: () => void;
}

const SightCarousel: React.FC<SightCarouselProps> = ({ 
  sights, 
  selectedSights, 
  toggleSightSelection,
  onViewDetails,
  onClearSelection 
}) => {
  return (
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
                        onViewDetails(sights.findIndex(s => s.id === sight.id));
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
          onClick={onClearSelection}
          disabled={selectedSights.length === 0}
        >
          Сбросить выбор
        </Button>
      </div>
    </Card>
  );
};

export default SightCarousel;

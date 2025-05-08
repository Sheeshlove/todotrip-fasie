
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, Tag, Clock, Globe, Phone } from 'lucide-react';
import { Sight } from '@/data/spbSights';

interface SightDetailsProps {
  sight: Sight;
  onPrevious: () => void;
  onNext: () => void;
}

const SightDetails: React.FC<SightDetailsProps> = ({ sight, onPrevious, onNext }) => {
  return (
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
          {sight.name}
        </h3>
        
        <p className="text-todoLightGray mb-4 leading-relaxed">
          {sight.description}
        </p>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-start">
            <Tag size={16} className="mr-2 text-todoLightGray mt-1 flex-shrink-0" />
            <div className="text-white">{sight.price}</div>
          </div>
          
          <div className="flex items-start">
            <Clock size={16} className="mr-2 text-todoLightGray mt-1 flex-shrink-0" />
            <div className="text-white">{sight.hours}</div>
          </div>
          
          <div className="flex items-start">
            <Globe size={16} className="mr-2 text-todoLightGray mt-1 flex-shrink-0" />
            <div>
              <a 
                href={sight.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-todoYellow hover:underline"
              >
                {sight.website}
              </a>
            </div>
          </div>
          
          <div className="flex items-start">
            <Phone size={16} className="mr-2 text-todoLightGray mt-1 flex-shrink-0" />
            <div className="text-white">{sight.contacts}</div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          className="border-white/10 hover:bg-todoBlack hover:border-todoYellow/30"
          onClick={onPrevious}
        >
          Предыдущий
        </Button>
        
        <Button
          variant="outline"
          className="border-white/10 hover:bg-todoBlack hover:border-todoYellow/30"
          onClick={onNext}
        >
          Следующий
        </Button>
      </div>
    </Card>
  );
};

export default SightDetails;

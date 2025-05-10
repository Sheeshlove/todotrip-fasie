
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowLeft, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TripHeaderProps {
  city: string;
}

const TripHeader: React.FC<TripHeaderProps> = ({ city }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-8 animate-fade-in">
      <div>
        <div className="flex items-center mb-1">
          <div className="bg-todoYellow/20 p-1.5 rounded-lg mr-3">
            <Navigation className="text-todoYellow" size={18} />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {city}
          </h1>
        </div>
        <p className="text-todoLightGray text-sm ml-1">
          ИИ-планировщик маршрутов
        </p>
      </div>
      <Button 
        variant="outline" 
        className="bg-todoBlack/40 border-white/10 text-white hover:bg-todoBlack/60 hover:text-todoYellow transition-colors"
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={16} className="mr-1.5" /> Назад
      </Button>
    </div>
  );
};

export default TripHeader;

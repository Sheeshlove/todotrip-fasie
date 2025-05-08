
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowLeft } from 'lucide-react';

interface TripHeaderProps {
  city: string;
}

const TripHeader: React.FC<TripHeaderProps> = ({ city }) => {
  return (
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
  );
};

export default TripHeader;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Filter, ArrowRight } from 'lucide-react';
import BasicSettings from './BasicSettings';
import PreferencesSection from './PreferencesSection';

interface TripPreferencesFormProps {
  onSubmit: () => void;
}

const TripPreferencesForm: React.FC<TripPreferencesFormProps> = ({ onSubmit }) => {
  // Basic settings state
  const [budget, setBudget] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [accessibilityNeeded, setAccessibilityNeeded] = useState<boolean>(false);
  
  // Preferences state
  const [childFriendly, setChildFriendly] = useState<number[]>([5]);
  const [culturalProgram, setCulturalProgram] = useState<number[]>([5]);
  const [sociability, setSociability] = useState<number[]>([5]);
  const [relaxation, setRelaxation] = useState<number[]>([5]);
  const [popularity, setPopularity] = useState<number[]>([5]);
  const [instagrammability, setInstagrammability] = useState<number[]>([5]);
  
  const isFormValid = () => {
    return (
      budget !== '' || 
      hours !== '' || 
      accessibilityNeeded || 
      childFriendly[0] !== 5 || 
      culturalProgram[0] !== 5 || 
      sociability[0] !== 5 || 
      relaxation[0] !== 5 || 
      popularity[0] !== 5 || 
      instagrammability[0] !== 5
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <Card className="bg-todoDarkGray/50 backdrop-blur-md border-white/5 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center mb-6 border-b border-white/10 pb-4">
          <div className="bg-todoYellow/20 p-3 rounded-full mr-4">
            <Filter size={22} className="text-todoYellow" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Настройки маршрута
            </h2>
            <p className="text-todoLightGray text-sm mt-1">
              Настройте параметры для идеального маршрута
            </p>
          </div>
        </div>
        
        <div className="space-y-8">
          <BasicSettings
            budget={budget}
            setBudget={setBudget}
            hours={hours}
            setHours={setHours}
            accessibilityNeeded={accessibilityNeeded}
            setAccessibilityNeeded={setAccessibilityNeeded}
          />
          
          <PreferencesSection
            childFriendly={childFriendly}
            setChildFriendly={setChildFriendly}
            culturalProgram={culturalProgram}
            setCulturalProgram={setCulturalProgram}
            sociability={sociability}
            setSociability={setSociability}
            relaxation={relaxation}
            setRelaxation={setRelaxation}
            popularity={popularity}
            setPopularity={setPopularity}
            instagrammability={instagrammability}
            setInstagrammability={setInstagrammability}
          />
        </div>
      </Card>
      
      <Button 
        type="submit"
        disabled={!isFormValid()}
        className="w-full bg-todoYellow hover:bg-todoYellow/80 text-black font-medium py-6 group transition-all duration-300 shadow-lg hover:shadow-todoYellow/20"
      >
        <span className="flex items-center justify-center">
          <span>Создать маршрут</span>
          <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </Button>
    </form>
  );
};

export default TripPreferencesForm;

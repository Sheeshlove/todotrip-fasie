
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MapPin, Filter, ChevronRight } from 'lucide-react';

interface TripPreferencesFormProps {
  onSubmit: () => void;
}

const TripPreferencesForm: React.FC<TripPreferencesFormProps> = ({ onSubmit }) => {
  const [budget, setBudget] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [accessibilityNeeded, setAccessibilityNeeded] = useState<boolean>(false);
  const [childFriendly, setChildFriendly] = useState<number[]>([0]);
  const [culturalProgram, setCulturalProgram] = useState<number[]>([0]);
  const [sociability, setSociability] = useState<number[]>([0]);
  const [relaxation, setRelaxation] = useState<number[]>([0]);
  const [popularity, setPopularity] = useState<number[]>([0]);
  const [instagrammability, setInstagrammability] = useState<number[]>([0]);
  
  const isFormValid = () => {
    return (
      budget !== '' || 
      hours !== '' || 
      accessibilityNeeded || 
      childFriendly[0] > 0 || 
      culturalProgram[0] > 0 || 
      sociability[0] > 0 || 
      relaxation[0] > 0 || 
      popularity[0] > 0 || 
      instagrammability[0] > 0
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-todoDarkGray/50 backdrop-blur-sm border-white/5 p-4 rounded-xl shadow-lg">
        <div className="flex items-center mb-4">
          <div className="bg-todoYellow/20 p-2 rounded-full mr-3">
            <Filter size={20} className="text-todoYellow" />
          </div>
          <h2 className="text-lg font-semibold text-white">
            Настройки маршрута
          </h2>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-todoLightGray">Бюджет</Label>
            <Input 
              type="number" 
              min="0"
              value={budget} 
              onChange={(e) => setBudget(e.target.value)}
              placeholder="0" 
              className="bg-todoDarkGray border-todoMediumGray text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-todoLightGray">Сколько времени хотите потратить</Label>
            <Input 
              type="number" 
              min="1" 
              max="14"
              value={hours} 
              onChange={(e) => setHours(e.target.value)}
              placeholder="1-14" 
              className="bg-todoDarkGray border-todoMediumGray text-white"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-todoLightGray">Нужна ли инфраструктура для ОВЗ?</Label>
            <Switch 
              checked={accessibilityNeeded}
              onCheckedChange={setAccessibilityNeeded}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-2">
              <Label className="text-todoLightGray">Можно с детьми</Label>
              <span className="text-white">{childFriendly[0]}</span>
            </div>
            <Slider 
              value={childFriendly} 
              max={10} 
              step={1} 
              onValueChange={setChildFriendly} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-2">
              <Label className="text-todoLightGray">Культурная программа</Label>
              <span className="text-white">{culturalProgram[0]}</span>
            </div>
            <Slider 
              value={culturalProgram} 
              max={10} 
              step={1} 
              onValueChange={setCulturalProgram} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-2">
              <Label className="text-todoLightGray">Социальность</Label>
              <span className="text-white">{sociability[0]}</span>
            </div>
            <Slider 
              value={sociability} 
              max={10} 
              step={1} 
              onValueChange={setSociability} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-2">
              <Label className="text-todoLightGray">Отдыхательность</Label>
              <span className="text-white">{relaxation[0]}</span>
            </div>
            <Slider 
              value={relaxation} 
              max={10} 
              step={1} 
              onValueChange={setRelaxation} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-2">
              <Label className="text-todoLightGray">Попсовость</Label>
              <span className="text-white">{popularity[0]}</span>
            </div>
            <Slider 
              value={popularity} 
              max={10} 
              step={1} 
              onValueChange={setPopularity} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-2">
              <Label className="text-todoLightGray">Инстаграмность</Label>
              <span className="text-white">{instagrammability[0]}</span>
            </div>
            <Slider 
              value={instagrammability} 
              max={10} 
              step={1} 
              onValueChange={setInstagrammability} 
            />
          </div>
        </div>
      </Card>
      
      <Button 
        type="submit"
        disabled={!isFormValid()}
        className="w-full bg-todoYellow hover:bg-todoYellow/80 text-black font-medium"
      >
        Создать маршрут <ChevronRight size={16} className="ml-2" />
      </Button>
    </form>
  );
};

export default TripPreferencesForm;

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

  // Helper function to determine text color based on slider value
  const getTextColor = (value: number, isLeft: boolean) => {
    if (value === 5) return "text-todoYellow"; // Both yellow when value is 5
    if (value < 5 && !isLeft) return "text-todoYellow"; // Right text yellow when value < 5
    if (value > 5 && isLeft) return "text-todoYellow"; // Left text yellow when value > 5
    return "text-todoLightGray"; // Default color
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
            <div className="flex justify-between items-center text-sm mb-1">
              <span className={getTextColor(childFriendly[0], true)}>место не для детей</span>
              <div className="relative w-8">
                <span className="absolute left-1/2 transform -translate-x-1/2 text-white font-medium">{childFriendly[0]}</span>
              </div>
              <span className={getTextColor(childFriendly[0], false)}>место только для детей</span>
            </div>
            <Slider 
              value={childFriendly} 
              max={10} 
              step={1} 
              onValueChange={setChildFriendly} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm mb-1">
              <span className={getTextColor(culturalProgram[0], true)}>отключаем мозг</span>
              <div className="relative w-8">
                <span className="absolute left-1/2 transform -translate-x-1/2 text-white font-medium">{culturalProgram[0]}</span>
              </div>
              <span className={getTextColor(culturalProgram[0], false)}>думаем о высоком</span>
            </div>
            <Slider 
              value={culturalProgram} 
              max={10} 
              step={1} 
              onValueChange={setCulturalProgram} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm mb-1">
              <span className={getTextColor(sociability[0], true)}>хиккуем</span>
              <div className="relative w-8">
                <span className="absolute left-1/2 transform -translate-x-1/2 text-white font-medium">{sociability[0]}</span>
              </div>
              <span className={getTextColor(sociability[0], false)}>экстравертимся</span>
            </div>
            <Slider 
              value={sociability} 
              max={10} 
              step={1} 
              onValueChange={setSociability} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm mb-1">
              <span className={getTextColor(relaxation[0], true)}>активный отдых</span>
              <div className="relative w-8">
                <span className="absolute left-1/2 transform -translate-x-1/2 text-white font-medium">{relaxation[0]}</span>
              </div>
              <span className={getTextColor(relaxation[0], false)}>релакс</span>
            </div>
            <Slider 
              value={relaxation} 
              max={10} 
              step={1} 
              onValueChange={setRelaxation} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm mb-1">
              <span className={getTextColor(popularity[0], true)}>я тут один</span>
              <div className="relative w-8">
                <span className="absolute left-1/2 transform -translate-x-1/2 text-white font-medium">{popularity[0]}</span>
              </div>
              <span className={getTextColor(popularity[0], false)}>популярное место</span>
            </div>
            <Slider 
              value={popularity} 
              max={10} 
              step={1} 
              onValueChange={setPopularity} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm mb-1">
              <span className={getTextColor(instagrammability[0], true)}>я только посмотреть</span>
              <div className="relative w-8">
                <span className="absolute left-1/2 transform -translate-x-1/2 text-white font-medium">{instagrammability[0]}</span>
              </div>
              <span className={getTextColor(instagrammability[0], false)}>фоткай меня</span>
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

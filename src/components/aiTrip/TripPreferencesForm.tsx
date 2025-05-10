
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MapPin, Filter, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface TripPreferencesFormProps {
  onSubmit: () => void;
}

const TripPreferencesForm: React.FC<TripPreferencesFormProps> = ({ onSubmit }) => {
  const [budget, setBudget] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [accessibilityNeeded, setAccessibilityNeeded] = useState<boolean>(false);
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

  // Helper function to determine text color based on slider value
  const getTextColor = (value: number, isLeft: boolean) => {
    if (value === 5) return "text-todoYellow"; // Both yellow when value is 5
    if (value < 5 && !isLeft) return "text-todoYellow"; // Right text yellow when value < 5
    if (value > 5 && isLeft) return "text-todoYellow"; // Left text yellow when value > 5
    return "text-todoLightGray"; // Default color
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <Card className="bg-todoDarkGray/50 backdrop-blur-md border-white/5 p-6 rounded-xl shadow-lg">
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
          {/* Basic settings with better visual separation */}
          <div className="space-y-6 mb-6">
            <div className="space-y-2.5">
              <Label className="text-todoLightGray text-[15px]">Бюджет</Label>
              <Input 
                type="number" 
                min="0"
                value={budget} 
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Введите сумму в рублях" 
                className="bg-todoBlack/40 border-todoMediumGray/30 text-white transition-colors focus:border-todoYellow/50"
              />
            </div>
            
            <div className="space-y-2.5">
              <Label className="text-todoLightGray text-[15px]">Сколько времени хотите потратить</Label>
              <Input 
                type="number" 
                min="1" 
                max="14"
                value={hours} 
                onChange={(e) => setHours(e.target.value)}
                placeholder="Количество часов (1-14)" 
                className="bg-todoBlack/40 border-todoMediumGray/30 text-white transition-colors focus:border-todoYellow/50"
              />
            </div>
            
            <div className="flex items-center justify-between py-2 px-1">
              <Label className="text-todoLightGray text-[15px]">Нужна ли инфраструктура для ОВЗ?</Label>
              <Switch 
                checked={accessibilityNeeded}
                onCheckedChange={setAccessibilityNeeded}
                className="data-[state=checked]:bg-todoYellow"
              />
            </div>
          </div>
          
          {/* Visual divider */}
          <div className="border-t border-white/5 pt-6 mb-2">
            <h3 className="text-white/90 text-sm font-medium mb-4 flex items-center">
              <Sparkles size={16} className="mr-2 text-todoYellow" /> Настройка предпочтений
            </h3>
          </div>
          
          {/* Enhanced sliders with consistent styling */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm mb-2">
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
                className="cursor-pointer"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm mb-2">
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
                className="cursor-pointer"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm mb-2">
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
                className="cursor-pointer"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm mb-2">
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
                className="cursor-pointer"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm mb-2">
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
                className="cursor-pointer"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm mb-2">
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
                className="cursor-pointer"
              />
            </div>
          </div>
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

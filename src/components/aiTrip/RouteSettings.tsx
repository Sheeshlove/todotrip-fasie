
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Filter, Shuffle } from 'lucide-react';

interface RouteSettingsProps {
  budget: number[];
  hours: number[];
  isGeneratingRoute: boolean;
  canGenerateRoute: boolean;
  onBudgetChange: (value: number[]) => void;
  onHoursChange: (value: number[]) => void;
  onGenerateRoute: () => void;
}

const RouteSettings: React.FC<RouteSettingsProps> = ({ 
  budget,
  hours,
  isGeneratingRoute,
  canGenerateRoute,
  onBudgetChange,
  onHoursChange,
  onGenerateRoute
}) => {
  return (
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
            onValueChange={onBudgetChange} 
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
            onValueChange={onHoursChange} 
          />
        </div>
      </div>
      
      <Button 
        className="w-full bg-todoYellow hover:bg-todoYellow/80 text-black font-medium"
        disabled={!canGenerateRoute || isGeneratingRoute}
        onClick={onGenerateRoute}
      >
        {isGeneratingRoute ? (
          <>Создаем маршрут...</>
        ) : (
          <>Создать маршрут <Shuffle className="ml-2" size={16} /></>
        )}
      </Button>
    </Card>
  );
};

export default RouteSettings;

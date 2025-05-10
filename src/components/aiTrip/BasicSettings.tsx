
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface BasicSettingsProps {
  budget: string;
  setBudget: (value: string) => void;
  hours: string;
  setHours: (value: string) => void;
  accessibilityNeeded: boolean;
  setAccessibilityNeeded: (value: boolean) => void;
}

const BasicSettings: React.FC<BasicSettingsProps> = ({
  budget,
  setBudget,
  hours,
  setHours,
  accessibilityNeeded,
  setAccessibilityNeeded,
}) => {
  return (
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
  );
};

export default BasicSettings;

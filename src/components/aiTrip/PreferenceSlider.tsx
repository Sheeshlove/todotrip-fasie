
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface PreferenceSliderProps {
  value: number[];
  onChange: (value: number[]) => void;
  leftLabel: string;
  rightLabel: string;
}

const PreferenceSlider: React.FC<PreferenceSliderProps> = ({
  value,
  onChange,
  leftLabel,
  rightLabel,
}) => {
  // Helper function to determine text color based on slider value
  const getTextColor = (value: number, isLeft: boolean) => {
    if (value === 5) return "text-todoYellow"; // Both yellow when value is 5
    if (value < 5 && !isLeft) return "text-todoYellow"; // Right text yellow when value < 5
    if (value > 5 && isLeft) return "text-todoYellow"; // Left text yellow when value > 5
    return "text-todoLightGray"; // Default color
  };

  return (
    <div className="space-y-3 group">
      <div className="flex justify-between items-center text-sm mb-2">
        <span className={getTextColor(value[0], true)}>{leftLabel}</span>
        <div className="relative w-10">
          <span className="absolute left-1/2 transform -translate-x-1/2 text-white font-medium">{value[0]}</span>
        </div>
        <span className={getTextColor(value[0], false)}>{rightLabel}</span>
      </div>
      <Slider 
        value={value} 
        max={10} 
        step={1} 
        onValueChange={onChange}
        className="cursor-pointer transition-all duration-200 group-hover:opacity-100"
      />
    </div>
  );
};

export default PreferenceSlider;

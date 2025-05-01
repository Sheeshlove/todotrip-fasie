
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AttitudeSelectorProps {
  title: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export const AttitudeSelector: React.FC<AttitudeSelectorProps> = ({
  title,
  value,
  options,
  onChange
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full border rounded-md overflow-hidden"
    >
      <CollapsibleTrigger asChild className="w-full">
        <Button 
          variant="ghost" 
          className="w-full justify-between bg-background border-none p-3"
        >
          <span>{value ? value : `Выберите отношение к ${title.toLowerCase()}`}</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-3 bg-todoDarkGray border-t">
        <RadioGroup 
          value={value || ''} 
          onValueChange={(newValue) => {
            onChange(newValue);
            setIsOpen(false);
          }}
          className="space-y-3"
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={option.value} 
                id={`${title}-${option.value}`}
                className="text-todoYellow border-todoYellow"
              />
              <Label 
                htmlFor={`${title}-${option.value}`}
                className="text-white cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CollapsibleContent>
    </Collapsible>
  );
};

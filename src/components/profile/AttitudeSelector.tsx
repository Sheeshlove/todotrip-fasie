
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value || '');

  const handleSelect = () => {
    onChange(selectedValue);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between"
        >
          {value ? value : `Выберите отношение к ${title.toLowerCase()}`}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-todoDarkGray">
        <DialogHeader>
          <DialogTitle className="text-todoYellow">{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup 
            value={selectedValue} 
            onValueChange={setSelectedValue}
            className="space-y-3"
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.value} 
                  id={option.value}
                  className="text-todoYellow border-todoYellow"
                />
                <Label 
                  htmlFor={option.value}
                  className="text-white cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={handleSelect}
            className="bg-todoYellow text-black hover:bg-yellow-400"
          >
            Выбрать
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

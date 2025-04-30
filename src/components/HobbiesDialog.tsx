import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { hobbiesData } from "@/data/hobbies";
import React, { useState } from "react";

interface HobbiesDialogProps {
  selectedHobbies: string[];
  onHobbiesChange: (hobbies: string[]) => void;
  trigger?: React.ReactNode;
}

export function HobbiesDialog({ selectedHobbies, onHobbiesChange, trigger }: HobbiesDialogProps) {
  const [localSelectedHobbies, setLocalSelectedHobbies] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const allHobbies = hobbiesData.flatMap(category => category.hobbies);

  // Update localSelectedHobbies when the dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // When opening, initialize with current selected hobbies
      setLocalSelectedHobbies([...selectedHobbies]);
    }
    setOpen(newOpen);
  };

  const toggleHobby = (hobby: string) => {
    setLocalSelectedHobbies(current => 
      current.includes(hobby) 
        ? current.filter(h => h !== hobby)
        : [...current, hobby]
    );
  };

  const handleDone = () => {
    onHobbiesChange(localSelectedHobbies);
    setOpen(false); // Close dialog
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader className="flex justify-between items-center flex-row border-b pb-4">
          <DialogTitle className="text-xl">Выберите хобби</DialogTitle>
          <Button 
            onClick={handleDone}
            className="bg-todoYellow text-black hover:bg-todoYellow/90"
          >
            Готово
          </Button>
        </DialogHeader>

        <ScrollArea className="h-[60vh] px-1 -mx-1">
          <div className="flex flex-wrap gap-2 py-4">
            {allHobbies.map((hobby) => (
              <Toggle
                key={hobby}
                pressed={localSelectedHobbies.includes(hobby)}
                onPressedChange={() => toggleHobby(hobby)}
                className={`rounded-full border px-4 py-1 text-sm transition-colors
                  ${localSelectedHobbies.includes(hobby)
                    ? 'bg-todoYellow text-black border-todoYellow hover:bg-todoYellow/90'
                    : 'bg-transparent hover:bg-gray-100 border-gray-300'
                  }`}
              >
                {hobby}
              </Toggle>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}


import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { hobbiesData } from "@/data/hobbies";

interface HobbiesDialogProps {
  selectedHobbies: string[];
  onHobbiesChange: (hobbies: string[]) => void;
}

export function HobbiesDialog({ selectedHobbies, onHobbiesChange }: HobbiesDialogProps) {
  const toggleHobby = (hobby: string) => {
    if (selectedHobbies.includes(hobby)) {
      onHobbiesChange(selectedHobbies.filter(h => h !== hobby));
    } else {
      onHobbiesChange([...selectedHobbies, hobby]);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" type="button" className="w-full">
          Выбрать хобби
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Выберите ваши хобби</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {hobbiesData.map((category) => (
              <div key={category.title} className="space-y-2">
                <h3 className="font-medium">{category.title}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {category.hobbies.map((hobby) => (
                    <div key={hobby} className="flex items-center space-x-2">
                      <Checkbox 
                        id={hobby}
                        checked={selectedHobbies.includes(hobby)}
                        onCheckedChange={() => toggleHobby(hobby)}
                      />
                      <label
                        htmlFor={hobby}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {hobby}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}


import { format } from "date-fns";
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangeSelectorProps {
  date: [Date | null, Date | null];
  onSelect: (dates: [Date | null, Date | null]) => void;
}

export const DateRangeSelector = ({ date, onSelect }: DateRangeSelectorProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-transparent border-todoYellow text-todoYellow hover:bg-todoBlack/20"
        >
          <Calendar size={18} />
          {date[0] ? format(date[0], "dd.MM") : "Дата"} 
          {date[1] ? ` - ${format(date[1], "dd.MM")}` : ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-todoDarkGray border-todoMediumGray" align="start">
        <CalendarComponent
          initialFocus
          mode="range"
          defaultMonth={date[0] ?? new Date()}
          selected={{ from: date[0], to: date[1] }}
          onSelect={(range) => onSelect([range?.from ?? null, range?.to ?? null])}
          numberOfMonths={2}
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};

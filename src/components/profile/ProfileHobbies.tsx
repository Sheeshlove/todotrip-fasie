
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { HobbiesDialog } from '@/components/HobbiesDialog';

interface ProfileHobbiesProps {
  selectedHobbies: string[];
  onHobbiesChange: (hobbies: string[]) => void;
}

export const ProfileHobbies = ({ selectedHobbies, onHobbiesChange }: ProfileHobbiesProps) => {
  return (
    <Card className="w-full p-4 bg-todoDarkGray">
      <Input
        value={selectedHobbies.join(', ')}
        readOnly
        placeholder="Хобби"
        className="bg-todoBlack text-white border-none mb-2"
      />
      <HobbiesDialog
        selectedHobbies={selectedHobbies}
        onHobbiesChange={onHobbiesChange}
      />
    </Card>
  );
};

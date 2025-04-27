
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ProfileInfoProps {
  age: string;
  description: string;
  onAgeChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSave: () => void;
  saving: boolean;
}

export const ProfileInfo = ({ 
  age, 
  description, 
  onAgeChange, 
  onDescriptionChange, 
  onSave,
  saving 
}: ProfileInfoProps) => {
  return (
    <>
      <Card className="w-full p-4 bg-todoDarkGray">
        <h3 className="text-white mb-2">Возраст</h3>
        <Input
          value={age}
          onChange={(e) => onAgeChange(e.target.value)}
          placeholder="Ваш возраст"
          className="bg-todoBlack text-white border-none mb-4"
        />
        <Button 
          onClick={onSave}
          disabled={saving}
          className="w-full"
        >
          Сохранить
        </Button>
      </Card>

      <Card className="w-full p-4 bg-todoDarkGray">
        <h3 className="text-white mb-2">Описание профиля</h3>
        <Textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="в начале было слово..."
          className="bg-todoBlack text-white border-none mb-4"
        />
        <Button 
          onClick={onSave}
          disabled={saving}
          className="w-full"
        >
          Сохранить
        </Button>
      </Card>
    </>
  );
};

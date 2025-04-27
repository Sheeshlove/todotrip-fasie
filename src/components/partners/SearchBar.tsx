
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-todoMediumGray" />
      <Input
        type="text"
        placeholder="Куда вы хотите отправиться?"
        value={value}
        onChange={onChange}
        className="pl-10 bg-todoBlack border-todoMediumGray text-white w-full"
      />
    </div>
  );
};

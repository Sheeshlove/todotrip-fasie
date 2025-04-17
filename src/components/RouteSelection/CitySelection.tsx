
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface CitySelectionProps {
  onCitySelect: () => void;
}

const CitySelection: FC<CitySelectionProps> = ({ onCitySelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-6 py-10">
      <div className="bg-todoDarkGray rounded-xl p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-todoYellow mb-6 text-center">Выберите город</h2>
        
        <p className="text-center mb-6 text-lg">
          Пока что в приложении доступен только{' '}
          <Button 
            onClick={onCitySelect} 
            variant="link" 
            className="text-todoYellow hover:text-todoYellow/80 p-0 text-lg"
          >
            Санкт-Петербург
          </Button>
        </p>
        
        <p className="text-center mb-8 text-sm">
          Благодарим за понимание. Наша команда уже работает над добавлением Москвы, 
          Краснодара, Казани и других городов.
        </p>
        
        <div className="flex justify-center">
          <Button 
            onClick={() => window.location.href = 'mailto:todotrip.work@gmail.com'}
            variant="outline" 
            className="flex items-center gap-2 bg-transparent text-white border-white hover:bg-white/10 rounded-xl py-2 px-4"
          >
            <Mail size={18} />
            <span>Написать нам</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CitySelection;

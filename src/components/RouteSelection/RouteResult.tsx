
import { FC } from 'react';
import { Sight } from './SightCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock, CreditCard } from 'lucide-react';

interface RouteResultProps {
  selectedSights: Sight[];
  onReset: () => void;
}

const RouteResult: FC<RouteResultProps> = ({ selectedSights, onReset }) => {
  // Calculate total visit time (assume each sight takes ~2 hours)
  const totalTimeHours = selectedSights.length * 2;
  
  // Calculate estimated cost (extract numbers from price strings and sum them)
  const totalCost = selectedSights.reduce((sum, sight) => {
    const priceMatch = sight.price.match(/\d+/);
    const price = priceMatch ? parseInt(priceMatch[0], 10) : 0;
    return sum + price;
  }, 0);
  
  return (
    <div className="py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="icon" onClick={onReset}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold text-todoYellow">Ваш маршрут</h2>
        <div className="w-9"></div> {/* Empty div for alignment */}
      </div>
      
      <div className="bg-todoDarkGray rounded-xl p-4 mb-6">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="text-todoYellow" size={20} />
            <span>Достопримечательностей: {selectedSights.length}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="text-todoYellow" size={20} />
            <span>Примерное время: {totalTimeHours} ч</span>
          </div>
          
          <div className="flex items-center gap-2">
            <CreditCard className="text-todoYellow" size={20} />
            <span>Примерная стоимость: {totalCost} ₽</span>
          </div>
        </div>
        
        <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
          <p className="text-gray-400">Карта маршрута</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-2">Точки маршрута:</h3>
        
        {selectedSights.map((sight, index) => (
          <div key={sight.id} className="bg-todoDarkGray rounded-lg p-4 flex gap-4">
            <div className="flex-shrink-0 bg-gray-600 w-16 h-16 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold">{index + 1}</span>
            </div>
            
            <div>
              <h4 className="font-bold text-todoYellow">{sight.name}</h4>
              <p className="text-sm text-gray-300 mt-1">{sight.price} • {sight.hours.split(';')[0]}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button
          className="bg-todoYellow hover:bg-todoYellow/90 text-black font-bold py-3 px-8 rounded-xl text-lg"
          onClick={onReset}
        >
          Создать новый маршрут
        </Button>
      </div>
    </div>
  );
};

export default RouteResult;

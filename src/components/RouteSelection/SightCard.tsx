
import { FC } from 'react';

export interface Sight {
  id: number;
  name: string;
  description: string;
  price: string;
  hours: string;
  website: string;
  websiteUrl: string;
  contacts: string;
  imageUrl: string;
}

interface SightCardProps {
  sight: Sight;
  onSwipeLeft: (sight: Sight) => void;
  onSwipeRight: (sight: Sight) => void;
}

const SightCard: FC<SightCardProps> = ({ sight, onSwipeLeft, onSwipeRight }) => {
  return (
    <div className="relative w-full max-w-md mx-auto bg-todoDarkGray rounded-xl overflow-hidden shadow-lg h-[80vh] max-h-[700px]">
      <div 
        className="h-1/3 bg-cover bg-center" 
        style={{ backgroundImage: `url(${sight.imageUrl || '/placeholder.svg'})` }}
      ></div>
      
      <div className="p-5 overflow-y-auto h-2/3">
        <h3 className="text-xl font-bold text-todoYellow mb-3">{sight.name}</h3>
        
        <p className="text-white mb-4">{sight.description}</p>
        
        <div className="space-y-2 text-sm text-gray-300">
          <p><span className="font-semibold">Цена посещения:</span> {sight.price}</p>
          <p><span className="font-semibold">Часы работы:</span> {sight.hours}</p>
          <p>
            <span className="font-semibold">Сайт:</span>{' '}
            <a href={sight.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-todoYellow hover:underline">
              {sight.website}
            </a>
          </p>
          <p><span className="font-semibold">Контакты:</span> {sight.contacts}</p>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
        <button 
          onClick={() => onSwipeLeft(sight)}
          className="bg-red-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          aria-label="Пропустить"
        >
          ✕
        </button>
        <button 
          onClick={() => onSwipeRight(sight)}
          className="bg-green-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          aria-label="Добавить в маршрут"
        >
          ✓
        </button>
      </div>
    </div>
  );
};

export default SightCard;

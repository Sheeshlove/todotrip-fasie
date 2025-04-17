
import { FC } from 'react';
import { Button } from '@/components/ui/button';

interface RouteSelectionIntroProps {
  onStartClick: () => void;
  onHowItWorksClick: () => void;
}

const RouteSelectionIntro: FC<RouteSelectionIntroProps> = ({ onStartClick, onHowItWorksClick }) => {
  return (
    <div className="flex flex-col h-[calc(100vh-160px)] items-center justify-center gap-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-todoYellow text-center">
        Ты свайпаешь - нейросеть составляет маршрут!
      </h1>
      
      <div className="flex flex-col gap-6 w-full max-w-xs">
        <Button 
          onClick={onStartClick}
          className="bg-todoYellow hover:bg-todoYellow/90 text-black font-bold py-3 rounded-xl text-lg"
        >
          Вперёд!
        </Button>
        
        <Button 
          onClick={onHowItWorksClick}
          variant="outline" 
          className="bg-transparent text-white border-white hover:bg-white/10 rounded-xl py-3 text-lg"
        >
          Как это работает?
        </Button>
      </div>
    </div>
  );
};

export default RouteSelectionIntro;


import { FC } from 'react';
import { Button } from '@/components/ui/button';

interface RouteSelectionExplanationProps {
  onContinue: () => void;
}

const RouteSelectionExplanation: FC<RouteSelectionExplanationProps> = ({ onContinue }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-6 py-10">
      <div className="bg-todoDarkGray rounded-xl p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-todoYellow mb-6 text-center">Как это работает</h2>
        
        <div className="space-y-4 mb-8 text-base">
          <p>
            Наша система помогает вам открыть для себя новые места и составить идеальный маршрут 
            путешествия с помощью простых свайпов.
          </p>
          
          <p>
            Просто свайпайте вправо, если место вам интересно, или влево, если хотите пропустить его. 
            На основе ваших предпочтений нейросеть создаст персонализированный маршрут.
          </p>
          
          <p>
            Созданный маршрут будет включать не только достопримечательности, 
            но и близлежащие отели, рестораны и другие интересные места.
          </p>
          
          <p>
            Вы также сможете увидеть оценку примерной стоимости, время пути и подробную информацию 
            о каждой достопримечательности.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={onContinue}
            className="bg-todoYellow hover:bg-todoYellow/90 text-black font-bold py-3 px-8 rounded-xl text-lg"
          >
            Вперёд!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RouteSelectionExplanation;

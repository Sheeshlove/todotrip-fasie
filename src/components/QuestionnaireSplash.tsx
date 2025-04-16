
import { FC } from 'react';
import { Button } from '@/components/ui/button';

interface QuestionnaireSplashProps {
  onContinue: () => void;
}

const QuestionnaireSplash: FC<QuestionnaireSplashProps> = ({ onContinue }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-6 py-10">
      <div className="bg-todoDarkGray rounded-xl p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-todoYellow mb-6 text-center">Как работает наша нейросеть</h2>
        
        <div className="space-y-4 mb-8 text-base">
          <p>
            Наша интеллектуальная система анализирует ваши предпочтения и особенности характера, 
            чтобы составить идеальный маршрут путешествия именно для вас.
          </p>
          
          <p>
            Для этого мы используем методику анализа личности Big Five (OCEAN), которая оценивает пять 
            основных черт характера: открытость опыту, добросовестность, экстраверсию, доброжелательность и нейротизм.
          </p>
          
          <p>
            Также мы учитываем ваши привычки и предпочтения в путешествиях, чтобы предложить 
            максимально комфортный и интересный маршрут.
          </p>
          
          <p>
            После прохождения короткого опросника, нейросеть обработает ваши ответы и предложит маршрут, 
            который идеально подходит вашему типу личности и предпочтениям.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={onContinue}
            className="bg-todoYellow hover:bg-todoYellow/90 text-black font-bold py-3 px-8 rounded-xl text-lg"
          >
            Попробуем?
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireSplash;

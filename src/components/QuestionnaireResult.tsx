
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface QuestionnaireResultProps {
  results: Record<string, number>;
  onContinue: () => void;
}

const travelerTypes = [
  {
    type: 'Искатель приключений',
    description: 'Вы всегда в поиске новых впечатлений и адреналина. Предпочитаете активный отдых, не боитесь рисковать и любите выходить из зоны комфорта.',
    traits: { openness: 'high', extraversion: 'high', activity: 'high' }
  },
  {
    type: 'Культурный исследователь',
    description: 'Вам интересна история, искусство и местные традиции. Вы стремитесь глубоко погрузиться в культуру посещаемых мест и получить новые знания.',
    traits: { openness: 'high', conscientiousness: 'high', history: 'high' }
  },
  {
    type: 'Организованный турист',
    description: 'Вы цените комфорт, безопасность и предсказуемость. Предпочитаете тщательно планировать поездки и следовать намеченному маршруту.',
    traits: { conscientiousness: 'high', neuroticism: 'medium', comfort: 'high' }
  },
  {
    type: 'Спонтанный путешественник',
    description: 'Вы любите свободу и импровизацию. Предпочитаете не планировать всё заранее, а следовать своим желаниям и открывать новые места случайно.',
    traits: { openness: 'high', conscientiousness: 'low', neuroticism: 'low' }
  },
  {
    type: 'Созерцатель природы',
    description: 'Вас привлекают природные красоты, тишина и уединение. Предпочитаете отдых вдали от городской суеты и шума.',
    traits: { nature: 'high', crowds: 'low', extraversion: 'low' }
  }
];

const QuestionnaireResult: React.FC<QuestionnaireResultProps> = ({ results, onContinue }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [travelerType, setTravelerType] = useState<typeof travelerTypes[0] | null>(null);
  
  useEffect(() => {
    // Simulate loading for a better experience
    const timer = setTimeout(() => {
      // Find the best matching traveler type based on results
      const matchingType = findBestMatchingType(results);
      setTravelerType(matchingType);
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [results]);
  
  const findBestMatchingType = (userResults: Record<string, number>) => {
    // Simple algorithm to find the best match
    // In a real application, this would be more sophisticated
    let bestMatch = travelerTypes[0];
    let highestScore = 0;
    
    travelerTypes.forEach(type => {
      let score = 0;
      
      Object.entries(type.traits).forEach(([trait, level]) => {
        const userScore = userResults[trait] || 3; // Default to middle if not answered
        
        if (level === 'high' && userScore >= 4) score += 2;
        if (level === 'medium' && userScore >= 3 && userScore < 4) score += 2;
        if (level === 'low' && userScore < 3) score += 2;
      });
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = type;
      }
    });
    
    return bestMatch;
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-6">
        <h2 className="text-xl font-bold text-center mb-8">
          Дальше кодер ниче не сделал что бы там ни появилось на следующем экране это прикол какой-то
        </h2>
        <Loader2 className="w-10 h-10 text-todoYellow animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-6 py-10">
      <div className="bg-todoDarkGray rounded-xl p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-todoYellow mb-2 text-center">
          Ваш тип путешественника
        </h2>
        
        <h3 className="text-xl font-bold mb-6 text-center">
          {travelerType?.type}
        </h3>
        
        <p className="mb-8 text-base">
          {travelerType?.description}
        </p>
        
        <div className="mb-8">
          <h4 className="text-lg font-medium mb-3">Ваш OCEAN профиль:</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span>Открытость опыту</span>
                <span>{Math.round((results.openness || 3) * 20)}%</span>
              </div>
              <div className="h-2 w-full bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-todoYellow rounded-full" 
                  style={{ width: `${(results.openness || 3) * 20}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Добросовестность</span>
                <span>{Math.round((results.conscientiousness || 3) * 20)}%</span>
              </div>
              <div className="h-2 w-full bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-todoYellow rounded-full" 
                  style={{ width: `${(results.conscientiousness || 3) * 20}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Экстраверсия</span>
                <span>{Math.round((results.extraversion || 3) * 20)}%</span>
              </div>
              <div className="h-2 w-full bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-todoYellow rounded-full" 
                  style={{ width: `${(results.extraversion || 3) * 20}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Доброжелательность</span>
                <span>{Math.round((results.agreeableness || 3) * 20)}%</span>
              </div>
              <div className="h-2 w-full bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-todoYellow rounded-full" 
                  style={{ width: `${(results.agreeableness || 3) * 20}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Нейротизм</span>
                <span>{Math.round((results.neuroticism || 3) * 20)}%</span>
              </div>
              <div className="h-2 w-full bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-todoYellow rounded-full" 
                  style={{ width: `${(results.neuroticism || 3) * 20}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={onContinue}
          className="w-full bg-todoYellow hover:bg-todoYellow/90 text-black font-bold py-3 rounded-xl text-lg"
        >
          Построить маршрут
        </Button>
      </div>
    </div>
  );
};

export default QuestionnaireResult;


import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface QuestionnaireTestProps {
  onComplete: (results: Record<string, number>) => void;
}

const oceanQuestions = [
  // Открытость опыту (O)
  { id: 'o1', text: 'Мне интересно исследовать новые места и культуры', trait: 'openness' },
  { id: 'o2', text: 'Я люблю искусство и необычную архитектуру', trait: 'openness' },
  
  // Добросовестность (C)
  { id: 'c1', text: 'Я всегда планирую свои поездки заранее', trait: 'conscientiousness' },
  { id: 'c2', text: 'Я предпочитаю придерживаться четкого расписания в путешествии', trait: 'conscientiousness' },
  
  // Экстраверсия (E)
  { id: 'e1', text: 'Мне нравится знакомиться с новыми людьми во время путешествий', trait: 'extraversion' },
  { id: 'e2', text: 'Я предпочитаю шумные и оживленные места', trait: 'extraversion' },
  
  // Доброжелательность (A)
  { id: 'a1', text: 'Для меня важно уважать местные традиции и обычаи', trait: 'agreeableness' },
  { id: 'a2', text: 'Я стараюсь быть дружелюбным с местными жителями', trait: 'agreeableness' },
  
  // Нейротизм (N)
  { id: 'n1', text: 'Я часто беспокоюсь о мелочах во время путешествия', trait: 'neuroticism' },
  { id: 'n2', text: 'Непредвиденные изменения в планах вызывают у меня стресс', trait: 'neuroticism' },
  
  // Вопросы о путешествиях
  { id: 't1', text: 'Я предпочитаю активный отдых спокойному', trait: 'activity' },
  { id: 't2', text: 'Мне важен комфорт во время путешествия', trait: 'comfort' },
  { id: 't3', text: 'Я люблю путешествовать в одиночку', trait: 'solo' },
  { id: 't4', text: 'Я предпочитаю экзотическую кухню привычной еде', trait: 'cuisine' },
  { id: 't5', text: 'Природа привлекает меня больше, чем городская среда', trait: 'nature' },
  { id: 't6', text: 'Исторические достопримечательности для меня интереснее развлечений', trait: 'history' },
  { id: 't7', text: 'Я предпочитаю долгие путешествия коротким поездкам', trait: 'duration' },
  { id: 't8', text: 'Фотографирование для меня важная часть путешествия', trait: 'photography' },
  { id: 't9', text: 'Я готов потратить больше денег ради интересного опыта', trait: 'budget' },
  { id: 't10', text: 'Я стараюсь избегать мест с большим количеством туристов', trait: 'crowds' },
];

const QuestionnaireTest: React.FC<QuestionnaireTestProps> = ({ onComplete }) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  useEffect(() => {
    // Show initial loading message for 5 seconds as requested
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleAnswer = (value: number) => {
    const question = oceanQuestions[currentQuestionIndex];
    setAnswers(prev => ({
      ...prev,
      [question.trait]: (prev[question.trait] || 0) + value
    }));
    
    if (currentQuestionIndex < oceanQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handleComplete = () => {
    // Calculate average scores for each trait
    const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    const traitCounts = {} as Record<string, number>;
    
    // Count occurrences of each trait
    oceanQuestions.forEach(q => {
      traitCounts[q.trait] = (traitCounts[q.trait] || 0) + 1;
    });
    
    // Calculate average scores
    const results = {} as Record<string, number>;
    Object.keys(answers).forEach(trait => {
      results[trait] = traitCounts[trait] ? answers[trait] / traitCounts[trait] : answers[trait];
    });
    
    onComplete(results);
  };
  
  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-6">
        <h2 className="text-xl font-bold text-center mb-8">
          Сейчас мы зададим вам несколько вопросов. Пожалуйста, отвечайте честно.
        </h2>
        <Loader2 className="w-10 h-10 text-todoYellow animate-spin" />
      </div>
    );
  }
  
  const currentQuestion = oceanQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / oceanQuestions.length) * 100;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-6 py-10">
      <div className="w-full max-w-md">
        <div className="h-2 w-full bg-gray-700 rounded-full mb-8">
          <div 
            className="h-full bg-todoYellow rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="bg-todoDarkGray rounded-xl p-6 mb-6">
          <h3 className="text-lg font-medium mb-6">
            {currentQuestion.text}
          </h3>
          
          <div className="flex flex-col gap-3">
            {[5, 4, 3, 2, 1].map((value) => (
              <button
                key={value}
                onClick={() => handleAnswer(value)}
                className="py-3 px-4 bg-todoBlack rounded-lg text-left hover:bg-gray-800 transition-colors"
              >
                {value === 5 && 'Полностью согласен'}
                {value === 4 && 'Скорее согласен'}
                {value === 3 && 'Нейтрально'}
                {value === 2 && 'Скорее не согласен'}
                {value === 1 && 'Совершенно не согласен'}
              </button>
            ))}
          </div>
        </div>
        
        {currentQuestionIndex === oceanQuestions.length - 1 && (
          <Button 
            onClick={handleComplete}
            className="w-full bg-todoYellow hover:bg-todoYellow/90 text-black font-bold py-3 rounded-xl text-lg"
          >
            Закончить
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireTest;

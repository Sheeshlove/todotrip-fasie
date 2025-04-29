
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Define the personality questions (IPIP-NEO-120 for travelers)
const questions = [
  // Openness questions
  { id: 'O1', text: 'Мне нравится исследовать неизвестные места в поездках.', trait: 'openness', direction: 'positive' },
  { id: 'O2', text: 'Я часто выбираю маршруты, которые ведут вне туристических троп.', trait: 'openness', direction: 'positive' },
  { id: 'O3', text: 'Посещение музеев, галерей или природных заповедников входит в список моих приоритетов.', trait: 'openness', direction: 'positive' },
  { id: 'O4', text: 'Я охотно пробую новые виды активностей в путешествиях.', trait: 'openness', direction: 'positive' },
  { id: 'O5', text: 'Я ищу уникальные культурные впечатления, даже если это требует усилий.', trait: 'openness', direction: 'positive' },
  
  // Conscientiousness questions
  { id: 'C1', text: 'Я всегда бронирую жильё и билеты заранее.', trait: 'conscientiousness', direction: 'positive' },
  { id: 'C2', text: 'Я люблю, когда программа дня расписана чётко.', trait: 'conscientiousness', direction: 'positive' },
  { id: 'C3', text: 'Я редко откладываю подготовку к поездке на последний момент.', trait: 'conscientiousness', direction: 'positive' },
  { id: 'C4', text: 'Я тщательно проверяю визовые требования и страховку перед поездкой.', trait: 'conscientiousness', direction: 'positive' },
  { id: 'C5', text: 'Я предпочитаю иметь чёткий список вещей, которые нужно взять с собой.', trait: 'conscientiousness', direction: 'positive' },
  
  // Extraversion questions
  { id: 'E1', text: 'Я люблю общаться с местными жителями во время поездок.', trait: 'extraversion', direction: 'positive' },
  { id: 'E2', text: 'Я получаю удовольствие от участия в туристических группах.', trait: 'extraversion', direction: 'positive' },
  { id: 'E3', text: 'Я чувствую прилив энергии, посещая шумные рынки и площади.', trait: 'extraversion', direction: 'positive' },
  { id: 'E4', text: 'Мне нравится проводить вечера в барах и клубах за границей.', trait: 'extraversion', direction: 'positive' },
  { id: 'E5', text: 'Я часто завожу новые знакомства в поездках.', trait: 'extraversion', direction: 'positive' },
  
  // Agreeableness questions
  { id: 'A1', text: 'Я всегда стараюсь уважать местные обычаи и традиции.', trait: 'agreeableness', direction: 'positive' },
  { id: 'A2', text: 'Я терпелив к людям, которые говорят на другом языке.', trait: 'agreeableness', direction: 'positive' },
  { id: 'A3', text: 'Я охотно помогаю другим туристам в пути.', trait: 'agreeableness', direction: 'positive' },
  { id: 'A4', text: 'Я легко иду на компромиссы с попутчиками.', trait: 'agreeableness', direction: 'positive' },
  { id: 'A5', text: 'Я стараюсь избегать конфликтов в поездках.', trait: 'agreeableness', direction: 'positive' },
  
  // Neuroticism questions
  { id: 'N1', text: 'Я легко начинаю беспокоиться, если что-то идёт не по плану.', trait: 'neuroticism', direction: 'positive' },
  { id: 'N2', text: 'Я сильно нервничаю при задержках рейсов.', trait: 'neuroticism', direction: 'positive' },
  { id: 'N3', text: 'Я переживаю, если теряю ориентиры в незнакомом городе.', trait: 'neuroticism', direction: 'positive' },
  { id: 'N4', text: 'Я тревожусь о сохранности своих вещей в поездке.', trait: 'neuroticism', direction: 'positive' },
  { id: 'N5', text: 'Я склонен волноваться при пересечении границ.', trait: 'neuroticism', direction: 'positive' },
];

const options = [
  { value: '1', label: 'Совсем не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Нейтрален' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Полностью согласен' },
];

interface Answer {
  questionId: string;
  value: string;
  trait: string;
  direction: string;
}

export const PersonalityTest = () => {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{[key: string]: number}>({
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0
  });

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / questions.length) * 100;

  const handleNext = () => {
    if (!currentAnswer) return;

    const newAnswers = [...answers, {
      questionId: currentQuestion.id,
      value: currentAnswer,
      trait: currentQuestion.trait,
      direction: currentQuestion.direction
    }];
    
    setAnswers(newAnswers);
    setCurrentAnswer('');
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const newAnswers = [...answers];
      newAnswers.pop();
      setAnswers(newAnswers);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCurrentAnswer('');
    }
  };

  const calculateResults = (finalAnswers: Answer[]) => {
    setIsSubmitting(true);
    
    // Group answers by trait
    const traitAnswers: {[key: string]: Answer[]} = {
      openness: [],
      conscientiousness: [],
      extraversion: [],
      agreeableness: [],
      neuroticism: []
    };
    
    finalAnswers.forEach(answer => {
      if (traitAnswers[answer.trait]) {
        traitAnswers[answer.trait].push(answer);
      }
    });
    
    // Calculate scores for each trait (0-100 scale)
    const calculatedResults: {[key: string]: number} = {};
    
    Object.keys(traitAnswers).forEach(trait => {
      const answers = traitAnswers[trait];
      let total = 0;
      const maxPossible = answers.length * 5; // 5 is max score per question
      
      answers.forEach(answer => {
        let score = parseInt(answer.value);
        if (answer.direction === 'negative') {
          // Reverse score for negative questions
          score = 6 - score;
        }
        total += score;
      });
      
      // Convert to percentage
      calculatedResults[trait] = Math.round((total / maxPossible) * 100);
    });
    
    setResults(calculatedResults);
    saveResults(calculatedResults);
  };

  const saveResults = async (resultData: {[key: string]: number}) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('ocean_test_results')
        .upsert({
          user_id: user.id,
          openness: resultData.openness,
          conscientiousness: resultData.conscientiousness,
          extraversion: resultData.extraversion,
          agreeableness: resultData.agreeableness,
          neuroticism: resultData.neuroticism
        })
        .select();

      if (error) throw error;
      
      setShowResults(true);
      toast.success('Результаты теста сохранены!');
    } catch (error) {
      console.error('Error saving test results:', error);
      toast.error('Ошибка при сохранении результатов теста');
    } finally {
      setIsSubmitting(false);
    }
  };

  const traitDescriptions: {[key: string]: string} = {
    openness: 'Открытость новому опыту: Вы любите исследовать незнакомые места, пробовать новые активности и знакомиться с разными культурами.',
    conscientiousness: 'Сознательность: Вы тщательно планируете поездки, любите чёткий распорядок и заранее продумываете детали путешествия.',
    extraversion: 'Экстраверсия: Вам нравится общаться с местными жителями, участвовать в групповых активностях и находиться в центре событий.',
    agreeableness: 'Доброжелательность: Вы проявляете уважение к местным традициям, легко находите общий язык с другими и избегаете конфликтов.',
    neuroticism: 'Нейротизм: Вы склонны беспокоиться о деталях путешествия, испытываете стресс при неожиданных изменениях планов и переживаете о безопасности.'
  };

  const renderTraitResult = (trait: string, score: number) => {
    let level = '';
    if (score < 30) level = 'Низкий';
    else if (score < 70) level = 'Средний';
    else level = 'Высокий';

    return (
      <div key={trait} className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-white font-bold capitalize">{trait}</span>
          <span className="text-todoYellow">{level} ({score}%)</span>
        </div>
        <Progress value={score} className="h-2 mb-1" />
        <p className="text-sm text-todoMediumGray">{traitDescriptions[trait]}</p>
      </div>
    );
  };

  if (showResults) {
    return (
      <Card className="bg-todoDarkGray border-todoBlack mb-6">
        <CardHeader>
          <CardTitle className="text-white">Результаты теста OCEAN для путешественников</CardTitle>
          <CardDescription className="text-todoMediumGray">
            Оценка ваших туристических предпочтений
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(results).map(trait => renderTraitResult(trait, results[trait]))}
          
          <Button 
            className="w-full mt-4 bg-todoYellow text-black hover:bg-yellow-400"
            onClick={() => {
              setShowResults(false);
              setCurrentQuestionIndex(0);
              setAnswers([]);
              setCurrentAnswer('');
            }}
          >
            Пройти тест заново
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-todoDarkGray border-todoBlack mb-6">
      <CardHeader>
        <CardTitle className="text-white">Тест OCEAN для путешественников</CardTitle>
        <CardDescription className="text-todoMediumGray">
          Оцените каждое утверждение по шкале от 1 до 5
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-right mt-1 text-todoMediumGray">
            Вопрос {currentQuestionIndex + 1} из {questions.length}
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg text-white mb-4">{currentQuestion.text}</h3>
          
          <RadioGroup 
            value={currentAnswer} 
            onValueChange={setCurrentAnswer}
            className="space-y-3"
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.value} 
                  id={`option-${option.value}`} 
                  className="border-todoMediumGray text-todoYellow"
                />
                <Label 
                  htmlFor={`option-${option.value}`}
                  className="text-white"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="border-todoMediumGray text-todoMediumGray"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!currentAnswer || isSubmitting}
            className="bg-todoYellow text-black hover:bg-yellow-400"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Обработка...
              </>
            ) : currentQuestionIndex === questions.length - 1 ? (
              <>
                Завершить
              </>
            ) : (
              <>
                Далее
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


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

// Define the personality questions
const questions = [
  // Openness questions
  { id: 'O1', text: 'Я часто пробую новые необычные блюда', trait: 'openness', direction: 'positive' },
  { id: 'O2', text: 'Мне нравится узнавать о других культурах и их ценностях', trait: 'openness', direction: 'positive' },
  { id: 'O3', text: 'Я предпочитаю знакомые и привычные вещи', trait: 'openness', direction: 'negative' },
  { id: 'O4', text: 'Я люблю искусство и красоту', trait: 'openness', direction: 'positive' },
  
  // Conscientiousness questions
  { id: 'C1', text: 'Я всегда довожу работу до конца', trait: 'conscientiousness', direction: 'positive' },
  { id: 'C2', text: 'Я очень организованный человек', trait: 'conscientiousness', direction: 'positive' },
  { id: 'C3', text: 'Иногда я действую импульсивно, не просчитывая последствия', trait: 'conscientiousness', direction: 'negative' },
  { id: 'C4', text: 'Я уделяю внимание мельчайшим деталям', trait: 'conscientiousness', direction: 'positive' },
  
  // Extraversion questions
  { id: 'E1', text: 'Мне нравится быть в центре внимания', trait: 'extraversion', direction: 'positive' },
  { id: 'E2', text: 'Я предпочитаю проводить время с друзьями, а не в одиночестве', trait: 'extraversion', direction: 'positive' },
  { id: 'E3', text: 'Я чувствую себя комфортнее наедине с собой', trait: 'extraversion', direction: 'negative' },
  { id: 'E4', text: 'Я легко знакомлюсь с новыми людьми', trait: 'extraversion', direction: 'positive' },
  
  // Agreeableness questions
  { id: 'A1', text: 'Я всегда готов помочь другим', trait: 'agreeableness', direction: 'positive' },
  { id: 'A2', text: 'Я стараюсь избегать споров', trait: 'agreeableness', direction: 'positive' },
  { id: 'A3', text: 'Иногда я могу быть груб с людьми', trait: 'agreeableness', direction: 'negative' },
  { id: 'A4', text: 'Я легко сопереживаю чужим проблемам', trait: 'agreeableness', direction: 'positive' },
  
  // Neuroticism questions
  { id: 'N1', text: 'Я часто волнуюсь о мелочах', trait: 'neuroticism', direction: 'positive' },
  { id: 'N2', text: 'Я редко испытываю стресс', trait: 'neuroticism', direction: 'negative' },
  { id: 'N3', text: 'Мои настроения могут быстро меняться', trait: 'neuroticism', direction: 'positive' },
  { id: 'N4', text: 'Меня легко расстроить', trait: 'neuroticism', direction: 'positive' },
];

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Нейтрально' },
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
    openness: 'Открытость новому опыту: интерес к новым идеям, творчеству, искусству.',
    conscientiousness: 'Сознательность: организованность, ответственность, самодисциплина.',
    extraversion: 'Экстраверсия: общительность, энергичность, позитивность.',
    agreeableness: 'Доброжелательность: эмпатия, сотрудничество, доверие к другим.',
    neuroticism: 'Нейротизм: тенденция испытывать негативные эмоции, тревожность.'
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
          <CardTitle className="text-white">Результаты теста OCEAN</CardTitle>
          <CardDescription className="text-todoMediumGray">
            Модель личности "Большая пятерка"
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
        <CardTitle className="text-white">Тест OCEAN</CardTitle>
        <CardDescription className="text-todoMediumGray">
          Тест "Большая пятерка" для определения личностных черт
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

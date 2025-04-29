
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Question, options } from '@/data/personalityTestQuestions';

interface TestQuestionViewProps {
  currentQuestion: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  currentAnswer: string;
  setCurrentAnswer: (value: string) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  isSubmitting: boolean;
}

export const TestQuestionView = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  currentAnswer,
  setCurrentAnswer,
  handlePrevious,
  handleNext,
  isSubmitting
}: TestQuestionViewProps) => {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  // Get the trait category of the current question
  const getTrait = (questionIndex: number): string => {
    if (questionIndex < 24) return "Открытость опыту";
    if (questionIndex < 48) return "Добросовестность";
    if (questionIndex < 72) return "Экстраверсия";
    if (questionIndex < 96) return "Доброжелательность";
    return "Нейротизм";
  };
  
  // Handle option selection and auto-advance to next question
  const handleOptionSelect = (value: string) => {
    setCurrentAnswer(value);
    // Auto-advance to next question after a brief delay for better UX
    setTimeout(() => {
      if (!isSubmitting) {
        handleNext();
      }
    }, 300);
  };
  
  return (
    <>
      <div className="mb-6">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-1">
          <p className="text-sm text-todoMediumGray">
            {getTrait(currentQuestionIndex)}
          </p>
          <p className="text-sm text-todoMediumGray">
            Вопрос {currentQuestionIndex + 1} из {totalQuestions}
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg text-white mb-4">{currentQuestion.text}</h3>
        
        <RadioGroup 
          value={currentAnswer} 
          onValueChange={handleOptionSelect}
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
          disabled={currentQuestionIndex === 0 || isSubmitting}
          className="border-todoMediumGray text-todoMediumGray"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        
        {isSubmitting ? (
          <Button
            disabled
            className="bg-todoYellow text-black hover:bg-yellow-400"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Обработка...
          </Button>
        ) : currentQuestionIndex === totalQuestions - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!currentAnswer || isSubmitting}
            className="bg-todoYellow text-black hover:bg-yellow-400"
          >
            Завершить тест
          </Button>
        ) : null}
      </div>
    </>
  );
};

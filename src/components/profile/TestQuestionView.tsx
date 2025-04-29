
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
  const progress = (currentQuestionIndex / totalQuestions) * 100;
  
  return (
    <>
      <div className="mb-6">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-right mt-1 text-todoMediumGray">
          Вопрос {currentQuestionIndex + 1} из {totalQuestions}
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
          ) : currentQuestionIndex === totalQuestions - 1 ? (
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
    </>
  );
};

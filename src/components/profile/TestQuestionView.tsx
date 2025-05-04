
import React from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Question, options } from '@/data/personalityTestQuestions';
import { cn } from '@/lib/utils';

interface TestQuestionViewProps {
  currentQuestion: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  currentAnswer: string;
  setCurrentAnswer: (value: string) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  isSubmitting: boolean;
  isQuickTest?: boolean;
}

export const TestQuestionView: React.FC<TestQuestionViewProps> = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  currentAnswer,
  setCurrentAnswer,
  handlePrevious,
  handleNext,
  isSubmitting,
  isQuickTest = false,
}) => {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-todoYellow to-amber-400 bg-clip-text text-transparent">
          {isQuickTest ? 'Короткий тест личности' : 'Тест личности OCEAN'}
        </h3>
        <p className="text-sm text-gray-400">
          {isQuickTest 
            ? 'Ваши ответы помогут нам лучше подобрать для вас попутчиков. Короткий тест займет всего пару минут.' 
            : 'Ответьте на вопросы, чтобы узнать свой тип личности и получать более точные рекомендации попутчиков.'}
        </p>
      </div>
      
      <div className="w-full h-2 bg-gray-700 rounded-full mb-6">
        <div 
          className="h-2 bg-todoYellow rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">Вопрос {currentQuestionIndex + 1} из {totalQuestions}</p>
        <h4 className="text-lg font-medium mb-4">{currentQuestion.text}</h4>
        
        <RadioGroup 
          value={currentAnswer} 
          onValueChange={setCurrentAnswer}
          className="space-y-3"
        >
          {options.map((option) => (
            <div key={option.value} className={cn(
              "flex items-center space-x-2 rounded-lg border border-gray-700 p-3 transition-colors",
              currentAnswer === option.value ? "border-todoYellow bg-yellow-950/20" : "hover:bg-gray-900"
            )}>
              <RadioGroupItem value={option.value} id={`option-${option.value}`} />
              <Label
                htmlFor={`option-${option.value}`}
                className="flex-1 cursor-pointer"
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
          className="text-sm"
        >
          Назад
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!currentAnswer || isSubmitting}
          className={cn(
            "text-sm",
            currentQuestionIndex === totalQuestions - 1 
              ? "bg-todoYellow text-black hover:bg-amber-400" 
              : ""
          )}
        >
          {currentQuestionIndex === totalQuestions - 1 ? 'Завершить' : 'Далее'}
        </Button>
      </div>
    </div>
  );
};

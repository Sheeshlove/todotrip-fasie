
import React, { useState, Suspense, lazy, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { TestQuestionView } from './TestQuestionView';
import { questions } from '@/data/personalityTestQuestions';
import { saveTestResults } from '@/services/personalityTestService';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

// Lazy load the results view component
const TestResultsView = lazy(() => import('./TestResultsView').then(module => ({ default: module.TestResultsView })));

interface PersonalityTestProps {
  onComplete?: () => void;
}

export const PersonalityTest = ({ onComplete }: PersonalityTestProps) => {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Record<string, number> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(true);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');

  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Reset current answer when changing questions
  useEffect(() => {
    const questionId = questions[currentQuestionIndex]?.id;
    if (questionId && answers[questionId]) {
      setCurrentAnswer(answers[questionId].toString());
    } else {
      setCurrentAnswer('');
    }
  }, [currentQuestionIndex, answers]);

  const handleNext = () => {
    if (!currentAnswer) return;
    
    // Save the current answer
    const questionId = questions[currentQuestionIndex].id;
    const numericAnswer = parseInt(currentAnswer, 10);
    
    if (!isNaN(numericAnswer)) {
      // Update answers in a stable way that ensures state is updated
      setAnswers(prev => ({
        ...prev,
        [questionId]: numericAnswer
      }));
      
      // Handle last question or go to next
      if (isLastQuestion) {
        // We'll calculate results in a separate function after state update
        calculateAndSaveResults();
      } else {
        // Move to next question
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateAndSaveResults = async () => {
    setIsSubmitting(true);
    
    try {
      // First, ensure we have the latest answers by including the current one
      const questionId = questions[currentQuestionIndex].id;
      const numericAnswer = parseInt(currentAnswer, 10);
      
      const finalAnswers = {
        ...answers,
        [questionId]: numericAnswer
      };
      
      // Group answers by trait and calculate averages
      const traits: Record<string, number[]> = {
        openness: [],
        conscientiousness: [],
        extraversion: [],
        agreeableness: [],
        neuroticism: []
      };
      
      // Group the answers by their corresponding trait using the question's trait property
      questions.forEach(question => {
        const answer = finalAnswers[question.id];
        if (typeof answer === 'number') {
          const { trait, direction } = question;
          
          if (!traits[trait]) traits[trait] = [];
          
          // Adjust score for negative direction questions
          const adjustedAnswer = direction === 'negative' ? 6 - answer : answer;
          traits[trait].push(adjustedAnswer);
        }
      });
      
      // Calculate the average score for each trait (as a percentage)
      const calculatedResults: Record<string, number> = {};
      
      Object.entries(traits).forEach(([trait, values]) => {
        if (values.length > 0) {
          // Convert from 1-5 scale to 0-100%
          const average = values.reduce((sum, val) => sum + val, 0) / values.length;
          calculatedResults[trait] = Math.round((average - 1) / 4 * 100);
        } else {
          calculatedResults[trait] = 50; // Default to middle if no answers
        }
      });
      
      if (user) {
        try {
          await saveTestResults(user.id, calculatedResults);
          toast.success("Результаты теста успешно сохранены!");
        } catch (error) {
          console.error('Error saving test results:', error);
          toast.error("Ошибка при сохранении результатов теста");
        }
      }
      
      setResults(calculatedResults);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error calculating test results:', error);
      toast.error("Ошибка при обработке результатов теста");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestartTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResults(null);
    setCurrentAnswer('');
    setShowDialog(true);
  };

  const handleStartTest = () => {
    setShowDialog(false);
  };

  // Update the current answer state when selected
  const handleSetAnswer = (value: string) => {
    setCurrentAnswer(value);
  };

  if (results) {
    return (
      <Card className="bg-todoDarkGray border-todoBlack mb-6">
        <CardContent className="pt-6">
          <Suspense fallback={
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-todoYellow" />
            </div>
          }>
            <TestResultsView 
              results={results} 
              onRestartTest={handleRestartTest} 
            />
          </Suspense>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="bg-todoDarkGray border-todoBlack text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-todoYellow">
              Тест личности для путешественников
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white">
              <p>Этот тест займет около 15 минут вашего времени.</p>
              <p className="mt-2">Вам предстоит ответить на 120 вопросов, чтобы определить ваш психологический профиль путешественника.</p>
              <p className="mt-2">Оцените каждое утверждение по шкале от 1 до 5:</p>
              <ul className="mt-2 ml-4 list-disc">
                <li>1 — Совсем не согласен</li>
                <li>2 — Скорее не согласен</li>
                <li>3 — Нейтрален</li>
                <li>4 — Скорее согласен</li>
                <li>5 — Полностью согласен</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-todoMediumGray text-todoMediumGray hover:bg-todoMediumGray hover:text-todoDarkGray">
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleStartTest}
              className="bg-todoYellow text-black hover:bg-yellow-400"
            >
              Начать тест
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="bg-todoDarkGray border-todoBlack mb-6">
        <CardContent className="pt-6">
          {isSubmitting ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-10 w-10 animate-spin text-todoYellow mb-4" />
              <p className="text-white">Обработка результатов...</p>
            </div>
          ) : (
            <TestQuestionView
              currentQuestion={questions[currentQuestionIndex]}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              currentAnswer={currentAnswer}
              setCurrentAnswer={handleSetAnswer}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
              isSubmitting={isSubmitting}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

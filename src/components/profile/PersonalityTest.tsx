
import React, { useState, Suspense, lazy } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { TestQuestionView } from './TestQuestionView';
import { questions } from '@/data/personalityTestQuestions';
import { saveTestResults } from '@/services/personalityTestService';

// Lazy load the results view component
const TestResultsView = lazy(() => import('./TestResultsView').then(module => ({ default: module.TestResultsView })));

interface PersonalityTestProps {
  onComplete?: () => void;
}

export const PersonalityTest = ({ onComplete }: PersonalityTestProps) => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Record<string, number> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  const handleAnswer = (questionKey: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionKey]: value }));
    
    if (isLastQuestion) {
      calculateResults();
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const calculateResults = async () => {
    setIsSubmitting(true);
    
    // Group answers by trait and calculate averages
    const traits: Record<string, number[]> = {};
    
    // Group the answers by their corresponding trait
    Object.entries(answers).forEach(([key, value]) => {
      const [trait] = key.split('_');
      if (!traits[trait]) traits[trait] = [];
      traits[trait].push(value);
    });
    
    // Calculate the average score for each trait (as a percentage)
    const calculatedResults: Record<string, number> = {};
    Object.entries(traits).forEach(([trait, values]) => {
      // Convert from 1-5 scale to 0-100%
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      calculatedResults[trait] = Math.round((average - 1) / 4 * 100);
    });
    
    if (user) {
      try {
        await saveTestResults(user.id, calculatedResults);
      } catch (error) {
        console.error('Error saving test results:', error);
      }
    }
    
    setResults(calculatedResults);
    setIsSubmitting(false);
  };

  const handleRestartTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
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

  const question = questions[currentQuestion];
  
  return (
    <Card className="bg-todoDarkGray border-todoBlack mb-6">
      <CardContent className="pt-6">
        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-10 w-10 animate-spin text-todoYellow mb-4" />
            <p className="text-white">Обработка результатов...</p>
          </div>
        ) : (
          <TestQuestionView
            currentQuestion={question}
            currentQuestionIndex={currentQuestion}
            totalQuestions={totalQuestions}
            currentAnswer=""
            setCurrentAnswer={() => {}}
            handlePrevious={() => {}}
            handleNext={() => {}}
            isSubmitting={false}
          />
        )}
      </CardContent>
    </Card>
  );
};

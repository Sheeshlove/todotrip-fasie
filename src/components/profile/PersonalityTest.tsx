
import React, { Suspense, lazy, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { questions } from '@/data/personalityTestQuestions';
import { usePersonalityTest } from '@/hooks/usePersonalityTest';
import { TestQuestionView } from './TestQuestionView';
import { TestIntroDialog } from './TestIntroDialog';
import { TestLoading } from './TestLoading';

// Lazy load the results view component
const TestResultsView = lazy(() => import('./TestResultsView').then(module => ({ default: module.TestResultsView })));

interface PersonalityTestProps {
  onComplete?: () => void;
}

export const PersonalityTest = ({ onComplete }: PersonalityTestProps) => {
  const [showDialog, setShowDialog] = useState(true);
  
  const {
    currentQuestionIndex,
    totalQuestions,
    isLastQuestion,
    currentAnswer,
    results,
    isSubmitting,
    handleNext,
    handlePrevious,
    handleSetAnswer,
    resetTest
  } = usePersonalityTest(questions, onComplete);

  const handleStartTest = () => {
    setShowDialog(false);
  };

  const handleRestartTest = () => {
    resetTest();
    setShowDialog(true);
  };

  if (results) {
    return (
      <Card className="bg-todoDarkGray border-todoBlack mb-6">
        <CardContent className="pt-6">
          <Suspense fallback={<TestLoading message="Загрузка результатов..." />}>
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
      <TestIntroDialog 
        open={showDialog} 
        onOpenChange={setShowDialog}
        onStart={handleStartTest}
      />

      <Card className="bg-todoDarkGray border-todoBlack mb-6">
        <CardContent className="pt-6">
          {isSubmitting ? (
            <TestLoading />
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

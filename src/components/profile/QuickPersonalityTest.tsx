
import React, { Suspense, lazy, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { quickQuestions } from '@/data/quickPersonalityTestQuestions';
import { usePersonalityTest } from '@/hooks/usePersonalityTest';
import { TestQuestionView } from './TestQuestionView';
import { TestLoading } from './TestLoading';

// Lazy load the results view component
const TestResultsView = lazy(() => import('./TestResultsView').then(module => ({ default: module.TestResultsView })));

interface QuickPersonalityTestProps {
  onComplete?: () => void;
  onClose?: () => void;
}

export const QuickPersonalityTest = ({ onComplete, onClose }: QuickPersonalityTestProps) => {
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
  } = usePersonalityTest(quickQuestions, onComplete);

  if (results) {
    return (
      <Card className="bg-todoDarkGray border-todoBlack mb-6">
        <CardContent className="pt-6">
          <Suspense fallback={<TestLoading message="Загрузка результатов..." />}>
            <TestResultsView 
              results={results} 
              onRestartTest={resetTest}
              isQuickTest={true}
            />
          </Suspense>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-todoDarkGray border-todoBlack mb-6">
      <CardContent className="pt-6">
        {isSubmitting ? (
          <TestLoading />
        ) : (
          <TestQuestionView
            currentQuestion={quickQuestions[currentQuestionIndex]}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            currentAnswer={currentAnswer}
            setCurrentAnswer={handleSetAnswer}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            isSubmitting={isSubmitting}
            isQuickTest={true}
          />
        )}
      </CardContent>
    </Card>
  );
};


import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TestQuestionView } from './TestQuestionView';
import { TestResultsView } from './TestResultsView';
import { questions } from '@/data/personalityTestQuestions';
import { calculateResults, saveTestResults, Answer } from '@/services/personalityTestService';

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
      handleTestCompletion(newAnswers);
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

  const handleTestCompletion = async (finalAnswers: Answer[]) => {
    setIsSubmitting(true);
    
    // Calculate results
    const calculatedResults = calculateResults(finalAnswers);
    setResults(calculatedResults);
    
    if (user) {
      await saveTestResults(user.id, calculatedResults);
    }
    
    setShowResults(true);
    setIsSubmitting(false);
  };

  const handleRestartTest = () => {
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setCurrentAnswer('');
  };

  return (
    <Card className="bg-todoDarkGray border-todoBlack mb-6">
      <CardHeader>
        <CardTitle className="text-white">Тест OCEAN для путешественников</CardTitle>
        <CardDescription className="text-todoMediumGray">
          {showResults 
            ? "Оценка ваших туристических предпочтений"
            : "Оцените каждое утверждение по шкале от 1 до 5"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showResults ? (
          <TestResultsView 
            results={results} 
            onRestartTest={handleRestartTest} 
          />
        ) : (
          <TestQuestionView
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            currentAnswer={currentAnswer}
            setCurrentAnswer={setCurrentAnswer}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            isSubmitting={isSubmitting}
          />
        )}
      </CardContent>
    </Card>
  );
};

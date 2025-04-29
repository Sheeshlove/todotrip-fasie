
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Question } from '@/data/personalityTestQuestions';
import { saveTestResults } from '@/services/personalityTestService';
import { toast } from 'sonner';

export interface PersonalityTestState {
  currentQuestionIndex: number;
  answers: Record<string, number>;
  results: Record<string, number> | null;
  isSubmitting: boolean;
  currentAnswer: string;
}

export const usePersonalityTest = (questions: Question[], onComplete?: () => void) => {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Record<string, number> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');

  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Set current answer when changing questions (but not after answer selection)
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
      // Update answers
      setAnswers(prev => ({
        ...prev,
        [questionId]: numericAnswer
      }));
      
      // Handle last question or go to next
      if (isLastQuestion) {
        calculateAndSaveResults();
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Handle both setting the answer and navigation
  const handleSetAnswer = (value: string) => {
    // First set the current answer
    setCurrentAnswer(value);
    
    // Get question ID and convert answer to number
    const questionId = questions[currentQuestionIndex].id;
    const numericAnswer = parseInt(value, 10);
    
    // If we have a valid answer, save it and prepare to navigate
    if (!isNaN(numericAnswer)) {
      // Save the answer immediately
      setAnswers(prev => ({
        ...prev,
        [questionId]: numericAnswer
      }));
      
      // Immediately navigate if it's not the last question and not submitting
      if (!isLastQuestion && !isSubmitting) {
        // Short delay for better UX
        setTimeout(() => {
          setCurrentQuestionIndex(prev => prev + 1);
        }, 300);
      }
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

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResults(null);
    setCurrentAnswer('');
  };

  return {
    currentQuestionIndex,
    totalQuestions,
    isLastQuestion,
    currentAnswer,
    answers,
    results,
    isSubmitting,
    handleNext,
    handlePrevious,
    handleSetAnswer,
    resetTest
  };
};

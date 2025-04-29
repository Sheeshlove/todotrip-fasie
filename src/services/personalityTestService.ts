
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Answer {
  questionId: string;
  value: string;
  trait: string;
  direction: string;
}

export const calculateResults = (answers: Answer[]) => {
  // Group answers by trait
  const traitAnswers: {[key: string]: Answer[]} = {
    openness: [],
    conscientiousness: [],
    extraversion: [],
    agreeableness: [],
    neuroticism: []
  };
  
  answers.forEach(answer => {
    if (traitAnswers[answer.trait]) {
      traitAnswers[answer.trait].push(answer);
    }
  });
  
  // Calculate scores for each trait (0-100 scale)
  const results: {[key: string]: number} = {};
  
  Object.keys(traitAnswers).forEach(trait => {
    const traitAnswersList = traitAnswers[trait];
    let total = 0;
    const maxPossible = traitAnswersList.length * 5; // 5 is max score per question
    
    traitAnswersList.forEach(answer => {
      let score = parseInt(answer.value);
      if (answer.direction === 'negative') {
        // Reverse score for negative questions
        score = 6 - score;
      }
      total += score;
    });
    
    // Convert to percentage
    results[trait] = Math.round((total / maxPossible) * 100);
  });
  
  return results;
};

export const saveTestResults = async (userId: string, results: {[key: string]: number}) => {
  try {
    const { error } = await supabase
      .from('ocean_test_results')
      .upsert({
        user_id: userId,
        openness: results.openness,
        conscientiousness: results.conscientiousness,
        extraversion: results.extraversion,
        agreeableness: results.agreeableness,
        neuroticism: results.neuroticism
      })
      .select();

    if (error) throw error;
    
    toast.success('Результаты теста сохранены!');
    return true;
  } catch (error) {
    console.error('Error saving test results:', error);
    toast.error('Ошибка при сохранении результатов теста');
    return false;
  }
};

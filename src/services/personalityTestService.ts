
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Answer {
  questionId: string;
  value: number;
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
    if (traitAnswersList.length === 0) {
      results[trait] = 50; // Default value if no answers
      return;
    }
    
    let total = 0;
    const maxPossible = traitAnswersList.length * 5; // 5 is max score per question
    
    traitAnswersList.forEach(answer => {
      let score = answer.value;
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
    // Ensure all required traits are present
    const requiredTraits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    const normalizedResults = { ...results };
    
    // Add default values for any missing traits
    requiredTraits.forEach(trait => {
      if (typeof normalizedResults[trait] !== 'number') {
        normalizedResults[trait] = 50; // Default to middle if missing
      }
    });
    
    const { error } = await supabase
      .from('ocean_test_results')
      .upsert({
        user_id: userId,
        openness: normalizedResults.openness,
        conscientiousness: normalizedResults.conscientiousness,
        extraversion: normalizedResults.extraversion,
        agreeableness: normalizedResults.agreeableness,
        neuroticism: normalizedResults.neuroticism,
        created_at: new Date().toISOString()
      })
      .select();

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error saving test results:', error);
    toast.error('Ошибка при сохранении результатов теста');
    return false;
  }
};


import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface TestResults {
  id: string;
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  created_at: string;
}

export const TestResultsDisplay = ({ onTakeTest }: { onTakeTest: () => void }) => {
  const { user } = useAuth();
  const [results, setResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchResults();
    }
  }, [user]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ocean_test_results')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching results:', error);
      }

      setResults(data);
    } catch (error) {
      console.error('Error in fetchResults:', error);
    } finally {
      setLoading(false);
    }
  };

  const traitDescriptions: {[key: string]: string} = {
    openness: 'Открытость новому опыту: интерес к новым идеям, творчеству, искусству.',
    conscientiousness: 'Сознательность: организованность, ответственность, самодисциплина.',
    extraversion: 'Экстраверсия: общительность, энергичность, позитивность.',
    agreeableness: 'Доброжелательность: эмпатия, сотрудничество, доверие к другим.',
    neuroticism: 'Нейротизм: тенденция испытывать негативные эмоции, тревожность.'
  };

  const renderTraitResult = (trait: string, score: number) => {
    let level = '';
    if (score < 30) level = 'Низкий';
    else if (score < 70) level = 'Средний';
    else level = 'Высокий';

    return (
      <div key={trait} className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-white font-bold capitalize">{trait}</span>
          <span className="text-todoYellow">{level} ({score}%)</span>
        </div>
        <Progress value={score} className="h-2 mb-1" />
        <p className="text-sm text-todoMediumGray">{traitDescriptions[trait]}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="bg-todoDarkGray border-todoBlack mb-6">
        <CardContent className="py-6">
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-todoYellow" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card className="bg-todoDarkGray border-todoBlack mb-6">
        <CardHeader>
          <CardTitle className="text-white">Тест личности</CardTitle>
          <CardDescription className="text-todoMediumGray">
            Узнайте свой тип личности по модели "Большая пятерка"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white mb-4">
            У вас еще нет результатов OCEAN теста. Пройдите короткий тест, чтобы узнать больше о своей личности.
          </p>
          <Button 
            onClick={onTakeTest}
            className="w-full bg-todoYellow text-black hover:bg-yellow-400"
          >
            Пройти тест
          </Button>
        </CardContent>
      </Card>
    );
  }

  const formattedDate = new Date(results.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Card className="bg-todoDarkGray border-todoBlack mb-6">
      <CardHeader>
        <CardTitle className="text-white">Результаты теста OCEAN</CardTitle>
        <CardDescription className="text-todoMediumGray">
          Тест пройден {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderTraitResult('openness', results.openness)}
        {renderTraitResult('conscientiousness', results.conscientiousness)}
        {renderTraitResult('extraversion', results.extraversion)}
        {renderTraitResult('agreeableness', results.agreeableness)}
        {renderTraitResult('neuroticism', results.neuroticism)}
        
        <Button 
          onClick={onTakeTest}
          className="w-full mt-4 bg-todoYellow text-black hover:bg-yellow-400"
        >
          Пройти тест заново
        </Button>
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { traitDescriptions } from '@/data/personalityTestQuestions';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

interface TestResultsViewProps {
  results: Record<string, number>;
  onRestartTest: () => void;
  isQuickTest?: boolean;
}

export const TestResultsView: React.FC<TestResultsViewProps> = ({ 
  results, 
  onRestartTest,
  isQuickTest = false 
}) => {
  const chartData = Object.entries(results).map(([trait, score]) => ({
    trait: trait.charAt(0).toUpperCase() + trait.slice(1), // Capitalize first letter
    score,
    fill: getColorForScore(score),
  }));
  
  function getColorForScore(score: number) {
    if (score < 30) return '#FFC107';
    if (score < 70) return '#2196F3';
    return '#4CAF50';
  }

  const traitKeys = Object.keys(traitDescriptions);
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-todoYellow to-amber-400 bg-clip-text text-transparent">
          {isQuickTest 
            ? 'Результаты короткого теста OCEAN' 
            : 'Результаты теста OCEAN'}
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          {isQuickTest 
            ? 'Это предварительная оценка вашей личности на основе короткого теста. Для более точных результатов рекомендуем пройти полный тест.' 
            : 'Узнайте больше о своей личности и о том, как она влияет на ваш стиль путешествий.'}
        </p>

        <ChartContainer className="w-full aspect-[4/3] mt-6" config={{}}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="trait" />
            <YAxis />
            <Bar dataKey="score" fill="#2196F3" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>

      <div className="space-y-4 mb-6">
        {traitKeys.map(trait => {
          const score = results[trait] || 0;
          const intensity = 
            score < 30 ? 'низкий' :
            score < 70 ? 'средний' : 'высокий';
          
          return (
            <Card key={trait} className="border-gray-700 bg-black/20">
              <CardContent className="p-4">
                <h4 className="font-medium mb-1">
                  {trait.charAt(0).toUpperCase() + trait.slice(1)}: <span className="text-todoYellow">{intensity} ({score}%)</span>
                </h4>
                <p className="text-sm text-gray-400">{traitDescriptions[trait]}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isQuickTest && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">
            Вы прошли короткую версию теста. Для более точных результатов рекомендуем пройти полный тест на странице профиля.
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onRestartTest}
          className="text-sm"
        >
          Пройти тест заново
        </Button>
      </div>
    </div>
  );
};

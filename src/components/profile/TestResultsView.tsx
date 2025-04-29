
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { traitDescriptions } from '@/data/personalityTestQuestions';

interface TestResultsViewProps {
  results: {[key: string]: number};
  onRestartTest: () => void;
}

export const TestResultsView = ({ results, onRestartTest }: TestResultsViewProps) => {
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

  return (
    <>
      {Object.keys(results).map(trait => renderTraitResult(trait, results[trait]))}
      
      <Button 
        className="w-full mt-4 bg-todoYellow text-black hover:bg-yellow-400"
        onClick={onRestartTest}
      >
        Пройти тест заново
      </Button>
    </>
  );
};

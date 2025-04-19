
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import TripPlanner from '@/components/TripPlanner';
import QuestionnaireSplash from '@/components/QuestionnaireSplash';
import QuestionnaireTest from '@/components/QuestionnaireTest';
import QuestionnaireResult from '@/components/QuestionnaireResult';

type AITripStage = 'intro' | 'explanation' | 'test' | 'result' | 'planner';

const AITrip = () => {
  const [stage, setStage] = useState<AITripStage>('intro');
  const [testResults, setTestResults] = useState<Record<string, number>>({});
  
  const handleStartTest = () => {
    setStage('explanation');
  };
  
  const handleStartQuestionnaire = () => {
    setStage('test');
  };
  
  const handleTestComplete = (results: Record<string, number>) => {
    setTestResults(results);
    setStage('result');
  };
  
  const renderContent = () => {
    switch (stage) {
      case 'intro':
        return (
          <div className="flex flex-col h-[calc(100vh-160px)] items-center justify-center gap-8 px-4">
            <h1 className="text-2xl md:text-3xl font-bold text-todoYellow text-center">
              Нейросеть сама составит тебе маршрут!
            </h1>
            
            <div className="flex flex-col gap-6 w-full max-w-xs">
              <Button 
                onClick={handleStartTest}
                className="bg-todoYellow hover:bg-todoYellow/90 text-black font-bold py-3 rounded-xl text-lg"
              >
                Вперёд!
              </Button>
              
              <Button 
                onClick={handleStartTest}
                variant="outline" 
                className="bg-transparent text-white border-white hover:bg-white/10 rounded-xl py-3 text-lg"
              >
                Как это работает?
              </Button>
            </div>
          </div>
        );
        
      case 'explanation':
        return <QuestionnaireSplash onContinue={handleStartQuestionnaire} />;
        
      case 'test':
        return <QuestionnaireTest onComplete={handleTestComplete} />;
        
      case 'result':
        return <QuestionnaireResult results={testResults} onContinue={() => setStage('planner')} />;
        
      case 'planner':
        return <TripPlanner />;
        
      default:
        return null;
    }
  };
  
  return (
    <PageLayout title="ToDoTrip - AI Trip Planner" description="Нейросеть сама составит тебе маршрут!">
      {renderContent()}
    </PageLayout>
  );
};

export default AITrip;
// check if the new lines are added correctly
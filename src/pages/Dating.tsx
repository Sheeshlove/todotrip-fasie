
import PageLayout from '@/components/PageLayout';
import { DatingContainer } from '@/components/dating/DatingContainer';
import { useDatingProfile } from '@/hooks/useDatingProfile';
import { Loader2 } from 'lucide-react';

const Dating = () => {
  const { profile, testResults, loading } = useDatingProfile();
  
  // Single unified loading screen for the entire dating feature
  if (loading) {
    return (
      <PageLayout title="ToDoTrip - Общение" description="Ищите попутчиков для ваших путешествий">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <div className="w-16 h-16 border-4 border-todoYellow border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/80 text-lg mt-4">Загрузка профилей...</p>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title="ToDoTrip - Общение" description="Ищите попутчиков для ваших путешествий">
      <div className="max-w-md mx-auto">
        <DatingContainer 
          userProfile={profile}
          userTestResults={testResults}
        />
      </div>
    </PageLayout>
  );
};

export default Dating;

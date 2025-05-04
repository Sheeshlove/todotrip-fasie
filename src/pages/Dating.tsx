
import PageLayout from '@/components/PageLayout';
import { DatingContainer } from '@/components/dating/DatingContainer';
import { useDatingProfile } from '@/hooks/useDatingProfile';
import { useIsMobile } from '@/hooks/use-mobile';

const Dating = () => {
  const { profile, testResults, loading } = useDatingProfile();
  const isMobile = useIsMobile();
  
  // Single unified loading screen for the entire dating feature
  if (loading) {
    return (
      <PageLayout title="ToDoTrip - Общение" description="Ищите попутчиков для ваших путешествий">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <div className="w-12 h-12 border-3 border-todoYellow border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/80 text-lg mt-3">Загрузка профилей...</p>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title="ToDoTrip - Общение" description="Ищите попутчиков для ваших путешествий">
      <div className={`mx-auto ${isMobile ? 'w-full px-1' : 'max-w-md px-2'}`}>
        <DatingContainer 
          userProfile={profile}
          userTestResults={testResults}
        />
      </div>
    </PageLayout>
  );
};

export default Dating;

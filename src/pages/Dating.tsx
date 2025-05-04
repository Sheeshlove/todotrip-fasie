
import PageLayout from '@/components/PageLayout';
import { DatingContainer } from '@/components/dating/DatingContainer';
import { useDatingProfile } from '@/hooks/useDatingProfile';
import { useIsMobile } from '@/hooks/use-mobile';

const Dating = () => {
  const { profile, testResults, loading } = useDatingProfile();
  const isMobile = useIsMobile();
  
  // Single unified loading screen for the entire dating feature with improved animation
  if (loading) {
    return (
      <PageLayout title="ToDoTrip - Общение" description="Ищите попутчиков для ваших путешествий">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <div className="relative">
            <div className="w-16 h-16 border-3 border-todoYellow border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-3 border-todoYellow border-opacity-20 rounded-full animate-pulse-soft"></div>
          </div>
          <p className="text-white/90 text-lg mt-4 animate-fade-in">
            Загрузка профилей...
          </p>
          <p className="text-white/70 text-sm mt-2 animate-fade-in animation-delay-300">
            Подбираем для вас наиболее совместимых попутчиков
          </p>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title="ToDoTrip - Общение" description="Ищите попутчиков для ваших путешествий">
      <div className={`mx-auto animate-fade-in ${isMobile ? 'w-full px-1' : 'max-w-md px-2'}`}>
        <DatingContainer 
          userProfile={profile}
          userTestResults={testResults}
        />
      </div>
    </PageLayout>
  );
};

export default Dating;

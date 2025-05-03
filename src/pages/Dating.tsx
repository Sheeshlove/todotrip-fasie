
import PageLayout from '@/components/PageLayout';
import { DatingContainer } from '@/components/dating/DatingContainer';
import { useDatingProfile } from '@/hooks/useDatingProfile';

const Dating = () => {
  const { profile, testResults, loading } = useDatingProfile();
  
  if (loading) {
    return (
      <PageLayout title="ToDoTrip - Общение" description="Ищите попутчиков для ваших путешествий">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <p className="text-white text-lg">Загрузка профилей...</p>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title="ToDoTrip - Общение" description="Ищите попутчиков для ваших путешествий">
      <DatingContainer 
        userProfile={profile}
        userTestResults={testResults}
      />
    </PageLayout>
  );
};

export default Dating;

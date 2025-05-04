import PageLayout from '@/components/PageLayout';
import { DatingContainer } from '@/components/dating/DatingContainer';
import { useDatingProfile } from '@/hooks/useDatingProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import LoadingIndicator from '@/components/LoadingIndicator';

const Dating = () => {
  const { profile, testResults, loading } = useDatingProfile();
  const isMobile = useIsMobile();
  
  // Keep a loading indicator just for the data fetching part
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <LoadingIndicator
          size="medium"
          message="Загрузка профилей..."
          submessage="Подбираем для вас наиболее совместимых попутчиков"
        />
      </div>
    );
  }
  
  return (
    <div className={`mx-auto animate-fade-in ${isMobile ? 'w-full px-1' : 'max-w-md px-2'}`}>
      <DatingContainer 
        userProfile={profile}
        userTestResults={testResults}
      />
    </div>
  );
};

export default Dating;

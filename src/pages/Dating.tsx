import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { DatingContainer } from '@/components/dating/DatingContainer';
import { useDatingProfile } from '@/hooks/useDatingProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import LoadingIndicator from '@/components/LoadingIndicator';
import { TestPromptDialog } from '@/components/profile/TestPromptDialog';
import { QuickPersonalityTest } from '@/components/profile/QuickPersonalityTest';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const Dating = () => {
  const { profile, testResults, loading } = useDatingProfile();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const [showTestPrompt, setShowTestPrompt] = useState(false);
  const [showQuickTest, setShowQuickTest] = useState(false);
  const [hasInteractedWithTest, setHasInteractedWithTest] = useState(false);

  // Check if user has seen the test prompt before
  useEffect(() => {
    if (user && !loading && !testResults && !hasInteractedWithTest) {
      const hasSeenPrompt = localStorage.getItem(`test_prompt_seen_${user.id}`);
      if (!hasSeenPrompt) {
        setShowTestPrompt(true);
      }
    }
  }, [user, loading, testResults, hasInteractedWithTest]);

  const handleTakeFullTest = () => {
    if (user) {
      localStorage.setItem(`test_prompt_seen_${user.id}`, 'true');
    }
    setShowTestPrompt(false);
    setHasInteractedWithTest(true);
  };

  const handleTakeQuickTest = () => {
    if (user) {
      localStorage.setItem(`test_prompt_seen_${user.id}`, 'true');
    }
    setShowQuickTest(true);
    setHasInteractedWithTest(true);
  };

  const handleSkipTest = () => {
    if (user) {
      localStorage.setItem(`test_prompt_seen_${user.id}`, 'true');
    }
    setShowTestPrompt(false);
    setHasInteractedWithTest(true);
  };

  const handleQuickTestComplete = () => {
    setShowQuickTest(false);
    // Refresh the profile data to get updated test results
    window.location.reload();
  };
  
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
      <TestPromptDialog
        open={showTestPrompt}
        onOpenChange={setShowTestPrompt}
        onTakeFullTest={handleTakeFullTest}
        onTakeQuickTest={handleTakeQuickTest}
        onSkipTest={handleSkipTest}
      />
      
      <Dialog open={showQuickTest} onOpenChange={setShowQuickTest}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Короткий тест личности</h2>
          <QuickPersonalityTest 
            onComplete={handleQuickTestComplete}
            onClose={() => setShowQuickTest(false)}
          />
        </DialogContent>
      </Dialog>
      
      <DatingContainer 
        userProfile={profile}
        userTestResults={testResults}
      />
    </div>
  );
};

export default Dating;

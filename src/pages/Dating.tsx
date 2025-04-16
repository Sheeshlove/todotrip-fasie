
import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Dating = () => {
  const { toast } = useToast();
  
  const handleInviteFriends = () => {
    // In a real app, this would use the Web Share API or copy to clipboard
    if (navigator.share) {
      navigator.share({
        title: 'ToDoTrip - AI Travel App',
        text: 'Join me on ToDoTrip, an AI-powered travel app for planning trips around Russia!',
        url: window.location.origin,
      }).then(() => {
        toast({
          title: "Успешно!",
          description: "Приглашение отправлено.",
        });
      }).catch(() => {
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(
      `Join me on ToDoTrip, an AI-powered travel app for planning trips around Russia! ${url}`
    );
    toast({
      title: "Ссылка скопирована!",
      description: "Теперь вы можете отправить её друзьям.",
    });
  };
  
  return (
    <PageLayout title="ToDoTrip - Find Travel Partners" description="Ищите попутчиков для ваших путешествий">
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Находите попутчиков</h1>
        
        <div className="bg-todoDarkGray rounded-lg p-6 max-w-md w-full">
          <p className="text-lg mb-8">Пока что никого нет, пригласи друзей!</p>
          
          <Button
            onClick={handleInviteFriends}
            className="bg-white text-black hover:bg-todoYellow transition-colors font-bold py-3 px-6 rounded-full w-full"
          >
            Позвать друзей!
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dating;

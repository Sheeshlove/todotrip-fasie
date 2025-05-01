
import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Share2, Users, UserPlus } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
        <div className="flex justify-center mb-6">
          <Users className="w-12 h-12 text-todoYellow" />
        </div>
        <h1 className="text-3xl font-bold mb-6 text-white">Находите попутчиков</h1>
        
        <Card className="bg-todoDarkGray/50 backdrop-blur-sm border-white/5 rounded-xl p-8 max-w-md w-full shadow-lg">
          <div className="flex justify-center mb-8">
            <div className="bg-todoBlack/50 w-20 h-20 rounded-full flex items-center justify-center">
              <UserPlus className="w-10 h-10 text-todoYellow" />
            </div>
          </div>
          
          <p className="text-lg mb-8 text-todoLightGray">Пока что никого нет, пригласи друзей!</p>
          
          <Button
            onClick={handleInviteFriends}
            className="bg-todoYellow text-black hover:bg-yellow-400 transition-all font-bold py-3 px-6 rounded-lg w-full flex items-center justify-center"
          >
            <Share2 className="mr-2 w-5 h-5" />
            Позвать друзей!
          </Button>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Dating;

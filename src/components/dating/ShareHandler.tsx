
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { EmptyState } from './EmptyState';

interface ShareHandlerProps {
  onInviteFriends: () => void;
}

export const ShareHandler: React.FC<ShareHandlerProps> = ({
  onInviteFriends
}) => {
  const { toast } = useToast();

  const handleInviteFriends = () => {
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
    <EmptyState onInviteFriends={handleInviteFriends} />
  );
};

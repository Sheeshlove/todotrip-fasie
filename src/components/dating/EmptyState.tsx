
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Share2 } from 'lucide-react';

interface EmptyStateProps {
  onInviteFriends: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onInviteFriends }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
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
          onClick={onInviteFriends}
          className="bg-todoYellow text-black hover:bg-yellow-400 transition-all font-bold py-3 px-6 rounded-lg w-full flex items-center justify-center"
        >
          <Share2 className="mr-2 w-5 h-5" />
          Позвать друзей!
        </Button>
      </Card>
    </div>
  );
};

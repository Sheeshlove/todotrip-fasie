
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Share2 } from 'lucide-react';

interface EmptyStateProps {
  onInviteFriends: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onInviteFriends
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-todoYellow/20 absolute -top-4 -left-4 animate-pulse"></div>
          <Users className="w-14 h-14 text-todoYellow relative z-10" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-todoYellow to-yellow-400">
        Находите попутчиков
      </h1>
      
      <Card className="bg-todoDarkGray/70 backdrop-blur-lg border-white/5 rounded-xl p-8 max-w-md w-full shadow-lg">
        <div className="flex justify-center mb-8">
          <div className="bg-todoBlack/60 w-24 h-24 rounded-full flex items-center justify-center shadow-inner border border-todoYellow/10">
            <UserPlus className="w-12 h-12 text-todoYellow" />
          </div>
        </div>
        
        <p className="text-lg mb-8 text-white/80">Больше никого нет, пригласи друзей!</p>
        
        <Button onClick={onInviteFriends} className="bg-todoYellow text-black hover:bg-yellow-400 transition-all font-bold py-4 px-6 rounded-xl w-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-101">
          <Share2 className="w-5 h-5" />
          Позвать друзей!
        </Button>
      </Card>
    </div>
  );
};

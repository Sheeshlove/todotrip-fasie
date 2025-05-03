
import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Share2, Users, UserPlus, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { UserCard } from '@/components/dating/UserCard';
import { useAuth } from '@/context/AuthContext';
import { SwipeControls } from '@/components/dating/SwipeControls';
import { EmptyState } from '@/components/dating/EmptyState';

const Dating = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Fetch user's profile to later compare hobbies
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, [user]);
  
  // Fetch other users' profiles
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setUsers(data);
          setCurrentUser(data[0]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Ошибка!",
          description: "Не удалось загрузить пользователей.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [user, toast]);
  
  const handleSwipe = (direction: 'left' | 'right') => {
    // Here you would implement actual matching logic
    // For now, we'll just simulate the swipe
    
    if (direction === 'right') {
      toast({
        title: "Лайк!",
        description: `Вы лайкнули профиль ${currentUser?.username || 'пользователя'}!`,
      });
    }
    
    // Move to the next profile
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentUser(users[currentIndex + 1]);
    } else {
      // No more profiles to show
      setCurrentUser(null);
    }
  };
  
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
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 py-6">
        {users.length > 0 && currentUser ? (
          <div className="w-full max-w-md">
            <UserCard 
              user={currentUser} 
              currentUserHobbies={userProfile?.hobbies || []} 
            />
            <SwipeControls onSwipe={handleSwipe} />
          </div>
        ) : (
          <EmptyState onInviteFriends={handleInviteFriends} />
        )}
      </div>
    </PageLayout>
  );
};

export default Dating;

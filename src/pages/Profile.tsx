
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { ProfileHobbies } from '@/components/profile/ProfileHobbies';
import { ProfileTrips } from '@/components/profile/ProfileTrips';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(profile?.hobbies || []);
  const [description, setDescription] = useState(profile?.description || '');
  const [age, setAge] = useState(profile?.age || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleProfileUpdate = async (avatarUrl?: string) => {
    if (!user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          hobbies: selectedHobbies,
          description,
          age,
          ...(avatarUrl && { avatar_url: avatarUrl }),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <PageLayout title="ТуДуТрип - Профиль" description="Ваш профиль">
      <div className="flex flex-col items-center gap-6 py-8 px-4">
        <ProfileHeader
          userId={user.id}
          email={user.email}
          age={profile?.age}
          avatarUrl={profile?.avatar_url}
          onImageUpdate={(url) => handleProfileUpdate(url)}
        />

        <ProfileInfo
          age={age}
          description={description}
          onAgeChange={setAge}
          onDescriptionChange={setDescription}
          onSave={() => handleProfileUpdate()}
          saving={saving}
        />

        <ProfileHobbies
          selectedHobbies={selectedHobbies}
          onHobbiesChange={(hobbies) => {
            setSelectedHobbies(hobbies);
            handleProfileUpdate();
          }}
        />

        <ProfileTrips />

        <Button 
          variant="outline" 
          className="w-full bg-todoDarkGray text-white hover:bg-todoDarkGray/80"
          onClick={() => navigate('/settings')}
        >
          Настройки
        </Button>

        <Button 
          className="w-full bg-todoYellow text-black hover:bg-yellow-400 text-xl py-6"
          onClick={() => navigate('/ai-trip')}
        >
          Вперёд!
        </Button>
      </div>
    </PageLayout>
  );
};

export default Profile;

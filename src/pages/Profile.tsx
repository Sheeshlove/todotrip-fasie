
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { HobbiesDialog } from '@/components/HobbiesDialog';
import { SavedRoutesDialog } from '@/components/SavedRoutesDialog';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';
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
        <h1 className="text-4xl font-bold text-todoYellow">ТуДуТрип</h1>
        
        <ProfileImageUpload 
          userId={user.id}
          currentImage={profile?.avatar_url}
          onImageUpdate={(url) => handleProfileUpdate(url)}
        />

        <div className="text-xl">
          <span className="text-todoYellow">{user.email}</span>
          {age && <span>, {age}</span>}
        </div>

        <Card className="w-full p-4 bg-todoDarkGray">
          <h3 className="text-white mb-2">Возраст</h3>
          <Input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Ваш возраст"
            className="bg-todoBlack text-white border-none mb-4"
          />
          <Button 
            onClick={() => handleProfileUpdate()}
            disabled={saving}
            className="w-full"
          >
            Сохранить
          </Button>
        </Card>

        <Card className="w-full p-4 bg-todoDarkGray">
          <h3 className="text-white mb-2">Описание профиля</h3>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="в начале было слово..."
            className="bg-todoBlack text-white border-none mb-4"
          />
          <Button 
            onClick={() => handleProfileUpdate()}
            disabled={saving}
            className="w-full"
          >
            Сохранить
          </Button>
        </Card>

        <Card className="w-full p-4 bg-todoDarkGray">
          <Input
            value={selectedHobbies.join(', ')}
            readOnly
            placeholder="Хобби"
            className="bg-todoBlack text-white border-none mb-2"
          />
          <HobbiesDialog
            selectedHobbies={selectedHobbies}
            onHobbiesChange={(hobbies) => {
              setSelectedHobbies(hobbies);
              handleProfileUpdate();
            }}
          />
        </Card>

        <Card className="w-full p-4 bg-todoDarkGray">
          <h3 className="text-white text-center mb-2">Ближайшие поездки</h3>
          <SavedRoutesDialog />
        </Card>

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

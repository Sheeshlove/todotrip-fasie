
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { HobbiesDialog } from '@/components/HobbiesDialog';
import { User, ImagePlus } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  
  // Simulated user data - in a real app this would come from your auth/user context
  const userData = {
    name: "User_name",
    age: "user_age",
    description: "Profile description",
  };

  return (
    <PageLayout title="ТуДуТрип - Профиль" description="Ваш профиль">
      <div className="flex flex-col items-center gap-6 py-8 px-4">
        {/* Logo */}
        <h1 className="text-4xl font-bold text-todoYellow">ТуДуТрип</h1>
        
        {/* Main Profile Picture */}
        <div className="relative w-full max-w-[300px] aspect-square">
          <Card className="w-full h-full flex items-center justify-center bg-todoDarkGray">
            <Avatar className="w-full h-full rounded-lg">
              <AvatarFallback className="w-full h-full bg-todoBlack text-todoYellow">
                <User className="w-1/3 h-1/3" />
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-4 right-4 bg-todoYellow p-2 rounded-full">
              <ImagePlus className="w-6 h-6 text-black" />
            </button>
          </Card>
        </div>

        {/* User Info */}
        <div className="text-xl">
          <span className="text-todoYellow">{userData.name}</span>
          <span>, {userData.age}</span>
        </div>

        {/* Photo Gallery */}
        <div className="w-full grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((num) => (
            <Card key={num} className="aspect-square flex items-center justify-center bg-todoDarkGray">
              <span className="text-todoMediumGray">pic {num}</span>
            </Card>
          ))}
        </div>

        {/* Profile Description */}
        <Card className="w-full p-4 bg-todoDarkGray">
          <p className="text-white">{userData.description}</p>
        </Card>

        {/* Hobbies Section */}
        <Card className="w-full p-4 bg-todoDarkGray">
          <h3 className="text-white text-center mb-2">Hobbies</h3>
          <HobbiesDialog
            selectedHobbies={selectedHobbies}
            onHobbiesChange={setSelectedHobbies}
          />
        </Card>

        {/* Upcoming Trips */}
        <Card className="w-full p-4 bg-todoDarkGray">
          <h3 className="text-white text-center mb-2">Ближайшие поездки</h3>
          <Button variant="outline" className="w-full">
            Добавить из сохранённого
          </Button>
        </Card>

        {/* Account Settings */}
        <Button 
          variant="outline" 
          className="w-full bg-todoDarkGray text-white hover:bg-todoDarkGray/80"
        >
          Поменять пароль, почту или номер телефона
        </Button>

        {/* Forward Button */}
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

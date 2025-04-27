
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';
import { User } from 'lucide-react';

interface ProfileHeaderProps {
  userId: string;
  email: string | undefined;
  age: string | null;
  avatarUrl: string | null;
  onImageUpdate: (url: string) => void;
}

export const ProfileHeader = ({ userId, email, age, avatarUrl, onImageUpdate }: ProfileHeaderProps) => {
  return (
    <>
      <h1 className="text-4xl font-bold text-todoYellow">ТуДуТрип</h1>
      <ProfileImageUpload 
        userId={userId}
        currentImage={avatarUrl}
        onImageUpdate={onImageUpdate}
      />
      <div className="text-xl">
        <span className="text-todoYellow">{email}</span>
        {age && <span>, {age}</span>}
      </div>
    </>
  );
};


import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserImageGallery } from './UserImageGallery';
import { CompatibilityCircle } from './CompatibilityCircle';
import { UserDetails } from './UserDetails';
import { UserHobbies } from './UserHobbies';
import { useIsMobile } from '@/hooks/use-mobile';

interface UserCardProps {
  user: any;
  currentUserHobbies: string[];
  compatibilityScore?: number;
  currentUserHasTakenTest: boolean;
  userHasTakenTest: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  currentUserHobbies,
  compatibilityScore = 100,
  currentUserHasTakenTest = false,
  userHasTakenTest = false 
}) => {
  const isMobile = useIsMobile();
  
  // Use profile image if available, otherwise set to null
  const [selectedImage, setSelectedImage] = useState<string | null>(
    user?.avatar_url || (user?.images && user.images.length > 0 ? 
      (typeof user.images === 'string' ? JSON.parse(user.images)[0] : user.images[0]) : 
      null)
  );
  
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };
  
  return (
    <Card className={`bg-todoDarkGray/70 backdrop-blur-md border-todoYellow/10 rounded-xl overflow-hidden shadow-lg ${isMobile ? 'max-w-[95vw]' : ''}`}>
      <UserImageGallery
        user={user}
        selectedImage={selectedImage}
        onImageSelect={handleImageClick}
      />

      {/* Compatibility Circle - under the photo */}
      <CompatibilityCircle
        compatibilityScore={compatibilityScore}
        currentUserHasTakenTest={currentUserHasTakenTest}
        userHasTakenTest={userHasTakenTest}
        username={user?.username}
      />
      
      {/* User info */}
      <CardContent className={`${isMobile ? 'p-3 space-y-3' : 'p-6 space-y-4'} bg-gradient-to-b from-todoDarkGray/70 to-todoBlack/50`}>
        <UserDetails user={user} />
        
        {/* Hobbies Section */}
        {user?.hobbies && user.hobbies.length > 0 && (
          <UserHobbies
            userHobbies={user.hobbies}
            currentUserHobbies={currentUserHobbies}
          />
        )}
      </CardContent>
    </Card>
  );
};


import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserImageGallery } from './UserImageGallery';
import { CompatibilityCircle } from './CompatibilityCircle';
import { UserDetails } from './UserDetails';
import { UserHobbies } from './UserHobbies';

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
  const [selectedImage, setSelectedImage] = useState<string | null>(user?.avatar_url || null);
  
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };
  
  return (
    <Card className="bg-todoDarkGray/70 backdrop-blur-md border-todoYellow/10 rounded-xl overflow-hidden shadow-lg">
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
      <CardContent className="p-6 space-y-5 bg-gradient-to-b from-todoDarkGray/70 to-todoBlack/50">
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

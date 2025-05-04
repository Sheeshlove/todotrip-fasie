
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface UserHobbiesProps {
  userHobbies: string[];
  currentUserHobbies: string[];
}

export const UserHobbies: React.FC<UserHobbiesProps> = ({
  userHobbies = [],
  currentUserHobbies = []
}) => {
  // Get common hobbies
  const commonHobbies = userHobbies.filter(hobby => 
    currentUserHobbies.includes(hobby)
  ) || [];
  
  // Get unique hobbies for this user
  const uniqueHobbies = userHobbies.filter(hobby => 
    !currentUserHobbies.includes(hobby)
  ) || [];
  
  if (commonHobbies.length === 0 && uniqueHobbies.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-3">
      <h4 className="text-left text-todoLightGray flex items-center gap-2">
        <span className="w-4 h-0.5 bg-todoYellow"></span>
        Хобби и интересы
      </h4>
      <div className="flex flex-wrap gap-2">
        {commonHobbies.map((hobby: string, index: number) => (
          <Badge 
            key={`common-${index}`} 
            className="bg-todoYellow text-black hover:bg-todoYellow/80 shadow-sm"
          >
            {hobby}
          </Badge>
        ))}
        
        {uniqueHobbies.map((hobby: string, index: number) => (
          <Badge 
            key={`unique-${index}`} 
            variant="outline"
            className="text-white/90 border-white/20 bg-todoBlack/30 hover:bg-todoBlack/50"
          >
            {hobby}
          </Badge>
        ))}
      </div>
    </div>
  );
};

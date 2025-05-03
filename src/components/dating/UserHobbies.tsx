
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
    <div className="space-y-2">
      <h4 className="text-left text-todoLightGray">Хобби:</h4>
      <div className="flex flex-wrap gap-2">
        {commonHobbies.map((hobby: string, index: number) => (
          <Badge 
            key={`common-${index}`} 
            className="bg-todoYellow text-black hover:bg-todoYellow/80"
          >
            {hobby}
          </Badge>
        ))}
        
        {uniqueHobbies.map((hobby: string, index: number) => (
          <Badge 
            key={`unique-${index}`} 
            variant="outline"
            className="text-white border-white/20 bg-transparent"
          >
            {hobby}
          </Badge>
        ))}
      </div>
    </div>
  );
};

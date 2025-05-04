
import React from 'react';
import { MapPin, Globe2 } from 'lucide-react';

interface UserDetailsProps {
  user: any;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  return (
    <div className="space-y-5">
      {/* Name, Age and Languages */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-white flex items-center">
            {user?.username || 'Пользователь'} 
            {user?.age && <span className="ml-2 text-todoYellow">{user.age}</span>}
          </h3>
        </div>
        
        {user?.location && (
          <div className="flex items-center gap-1 text-todoLightGray/80">
            <MapPin size={16} className="text-todoYellow" />
            <span>{user.location}</span>
          </div>
        )}
        
        {user?.languages && user.languages.length > 0 && (
          <div className="flex items-center gap-1 text-todoLightGray/80">
            <Globe2 size={16} className="text-todoYellow" />
            <div className="flex flex-wrap gap-1">
              {user.languages.map((language: string, index: number) => (
                <span key={index} className="text-sm">
                  {language}{index < user.languages.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Description */}
      {user?.description && (
        <p className="text-white/90 text-left border-l-2 border-todoYellow/30 pl-3 italic font-light">
          {user.description}
        </p>
      )}
      
      {/* Attitudes Section */}
      <div className="flex flex-wrap gap-4 text-sm">
        {user?.smoking_attitude && (
          <div className="px-3 py-1 rounded-full bg-todoDarkGray/80 text-todoLightGray">
            <span className="text-todoYellow">Курение:</span> {user.smoking_attitude}
          </div>
        )}
        
        {user?.drinking_attitude && (
          <div className="px-3 py-1 rounded-full bg-todoDarkGray/80 text-todoLightGray">
            <span className="text-todoYellow">Алкоголь:</span> {user.drinking_attitude}
          </div>
        )}
      </div>
    </div>
  );
};

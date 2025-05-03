
import React from 'react';

interface UserDetailsProps {
  user: any;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  return (
    <div className="space-y-4">
      {/* Name, Age and Languages */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-white">
            {user?.username || 'Пользователь'} 
            {user?.age && <span className="ml-2">{user.age}</span>}
          </h3>
        </div>
        
        {user?.languages && user.languages.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {user.languages.map((language: string, index: number) => (
              <span key={index} className="text-sm text-todoLightGray">
                {language}{index < user.languages.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Description */}
      {user?.description && (
        <p className="text-white text-left">
          {user.description}
        </p>
      )}
      
      {/* Attitudes Section */}
      <div className="space-y-2">
        {user?.smoking_attitude && (
          <div className="flex items-center space-x-2 text-left">
            <span className="text-todoLightGray">Курение:</span>
            <span className="text-white">{user.smoking_attitude}</span>
          </div>
        )}
        
        {user?.drinking_attitude && (
          <div className="flex items-center space-x-2 text-left">
            <span className="text-todoLightGray">Алкоголь:</span>
            <span className="text-white">{user.drinking_attitude}</span>
          </div>
        )}
      </div>
    </div>
  );
};

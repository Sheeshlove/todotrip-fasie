
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Info } from 'lucide-react';
import { getCompatibilityColor, getCompatibilityBgColor } from '@/services/compatibilityService';

interface UserCardProps {
  user: any;
  currentUserHobbies: string[];
  compatibilityScore?: number;
  onInfoClick?: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  currentUserHobbies,
  compatibilityScore = 100,
  onInfoClick 
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(user?.avatar_url || null);
  
  // Parse the images from json if they exist
  const userImages = user?.images ? 
    (typeof user.images === 'string' ? JSON.parse(user.images) : user.images) : 
    [];
    
  // Add avatar_url to images array if it exists and not already there
  const allImages = user?.avatar_url && !userImages.includes(user.avatar_url) 
    ? [user.avatar_url, ...userImages] 
    : userImages.length > 0 ? userImages : (user?.avatar_url ? [user.avatar_url] : []);
  
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };
  
  // Get common hobbies
  const commonHobbies = user?.hobbies?.filter((hobby: string) => 
    currentUserHobbies.includes(hobby)
  ) || [];
  
  // Get unique hobbies for this user
  const uniqueHobbies = user?.hobbies?.filter((hobby: string) => 
    !currentUserHobbies.includes(hobby)
  ) || [];
  
  // Get compatibility color based on score
  const compatibilityColorClass = getCompatibilityColor(compatibilityScore);
  const compatibilityBgClass = getCompatibilityBgColor(compatibilityScore);
  
  return (
    <Card className="bg-todoDarkGray/50 backdrop-blur-sm border-white/5 rounded-xl overflow-hidden shadow-lg">
      {/* Main profile image */}
      <div className="relative w-full aspect-square overflow-hidden">
        {selectedImage ? (
          <img 
            src={selectedImage} 
            alt={`${user?.username || 'User'}`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <User className="w-1/4 h-1/4 text-todoYellow" />
          </div>
        )}
        
        {/* Compatibility Circle */}
        <div 
          className={`absolute top-3 right-3 ${compatibilityBgClass} rounded-full w-12 h-12 flex items-center justify-center cursor-pointer`}
          onClick={onInfoClick}
          title="Нажмите для подробной информации о совместимости"
        >
          <span className="text-black font-bold text-sm">{compatibilityScore}%</span>
        </div>
        
        {/* Info button */}
        {onInfoClick && (
          <div 
            className="absolute top-3 left-3 bg-black/50 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
            onClick={onInfoClick}
          >
            <Info className="w-5 h-5 text-todoYellow" />
          </div>
        )}
      </div>
      
      {/* Image carousel */}
      {allImages.length > 1 && (
        <div className="p-4 bg-black/30">
          <Carousel className="w-full">
            <CarouselContent>
              {allImages.map((image: string, index: number) => (
                <CarouselItem key={index} className="basis-1/4 md:basis-1/5">
                  <div 
                    className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                      selectedImage === image ? 'border-todoYellow' : 'border-transparent'
                    }`}
                    onClick={() => handleImageClick(image)}
                  >
                    <img 
                      src={image} 
                      alt={`${user?.username || 'User'} ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </Carousel>
        </div>
      )}
      
      {/* User info */}
      <CardContent className="p-5 space-y-4">
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
        
        {/* Hobbies Section */}
        {(commonHobbies.length > 0 || uniqueHobbies.length > 0) && (
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
        )}
      </CardContent>
    </Card>
  );
};

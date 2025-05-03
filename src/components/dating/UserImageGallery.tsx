
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

interface UserImageGalleryProps {
  user: any;
  selectedImage: string | null;
  onImageSelect: (image: string) => void;
}

export const UserImageGallery: React.FC<UserImageGalleryProps> = ({
  user,
  selectedImage,
  onImageSelect
}) => {
  // Parse the images from json if they exist
  const userImages = user?.images ? 
    (typeof user.images === 'string' ? JSON.parse(user.images) : user.images) : 
    [];
    
  // Add avatar_url to images array if it exists and not already there
  const allImages = user?.avatar_url && !userImages.includes(user.avatar_url) 
    ? [user.avatar_url, ...userImages] 
    : userImages.length > 0 ? userImages : (user?.avatar_url ? [user.avatar_url] : []);
  
  return (
    <>
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
      </div>
      
      {/* Image carousel */}
      {allImages.length > 1 && (
        <div className="p-4 bg-black/30 mt-4">
          <Carousel className="w-full">
            <CarouselContent>
              {allImages.map((image: string, index: number) => (
                <CarouselItem key={index} className="basis-1/4 md:basis-1/5">
                  <div 
                    className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                      selectedImage === image ? 'border-todoYellow' : 'border-transparent'
                    }`}
                    onClick={() => onImageSelect(image)}
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
    </>
  );
};

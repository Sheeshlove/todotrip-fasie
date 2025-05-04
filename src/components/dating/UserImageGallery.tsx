
import React, { useState } from 'react';
import { User, Image as ImageIcon } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
  const [imageTransitioning, setImageTransitioning] = useState(false);
  
  // Parse the images from json if they exist
  const userImages = user?.images ? 
    (typeof user.images === 'string' ? JSON.parse(user.images) : user.images) : 
    [];
    
  // Add avatar_url to images array if it exists and not already there
  const allImages = user?.avatar_url && !userImages.includes(user.avatar_url) 
    ? [user.avatar_url, ...userImages] 
    : userImages.length > 0 ? userImages : (user?.avatar_url ? [user.avatar_url] : []);
  
  const hasNoImages = allImages.length === 0;
  const username = user?.username || 'Пользователь';
  
  const handleImageLoad = (imageUrl: string) => {
    setLoadingImages(prev => ({
      ...prev,
      [imageUrl]: false
    }));
  };
  
  const handleImageError = (imageUrl: string) => {
    setLoadingImages(prev => ({
      ...prev,
      [imageUrl]: false
    }));
  };
  
  const handleImageSelect = (image: string) => {
    if (image === selectedImage) return;
    
    setImageTransitioning(true);
    onImageSelect(image);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setImageTransitioning(false);
    }, 500);
  };
  
  return (
    <>
      {/* Main profile image - make it more impressive */}
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        {selectedImage ? (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-todoDarkGray/70 z-10"></div>
            {loadingImages[selectedImage] !== false && (
              <div className="absolute inset-0 flex items-center justify-center bg-todoDarkGray/70 z-5">
                <Skeleton className="w-full h-full bg-todoDarkGray/50 animate-pulse" />
              </div>
            )}
            <img 
              src={selectedImage} 
              alt={`${username}`} 
              className={`w-full h-full object-cover transition-all duration-700 ${
                imageTransitioning ? 'opacity-0 scale-110' : 'opacity-100 hover:scale-105'
              }`}
              onLoad={() => handleImageLoad(selectedImage)}
              onError={() => handleImageError(selectedImage)}
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-todoDarkGray to-black text-center p-6 animate-fade-in">
            <User className="w-1/4 h-1/4 text-todoYellow mb-4 animate-pulse-soft" />
            <p className="text-todoLightGray text-lg font-medium">
              {username} {hasNoImages ? 'пока не установил фото профиля' : ''}
            </p>
          </div>
        )}
      </div>
      
      {/* Image carousel - more polished */}
      {allImages.length > 1 && (
        <div className="p-4 bg-gradient-to-t from-black/60 to-transparent">
          <Carousel className="w-full">
            <CarouselContent>
              {allImages.map((image: string, index: number) => (
                <CarouselItem key={index} className="basis-1/4 md:basis-1/5 pl-2">
                  <div 
                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                      selectedImage === image 
                        ? 'border-2 border-todoYellow scale-105 shadow-glow' 
                        : 'border border-white/10 opacity-80 hover:opacity-100'
                    }`}
                    onClick={() => handleImageSelect(image)}
                  >
                    {loadingImages[image] !== false && (
                      <div className="absolute inset-0 flex items-center justify-center bg-todoDarkGray/50">
                        <ImageIcon size={24} className="text-todoYellow/50 animate-pulse" />
                      </div>
                    )}
                    <img 
                      src={image} 
                      alt={`${username} ${index + 1}`} 
                      className="w-full h-full object-cover transition-all duration-300 hover:scale-110"
                      onLoad={() => handleImageLoad(image)}
                      onError={() => handleImageError(image)}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1 bg-black/50 border-todoYellow/30 hover:bg-black/70 text-todoYellow transition-colors duration-300" />
            <CarouselNext className="right-1 bg-black/50 border-todoYellow/30 hover:bg-black/70 text-todoYellow transition-colors duration-300" />
          </Carousel>
        </div>
      )}
    </>
  );
};

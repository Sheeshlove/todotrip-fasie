
import { useRef, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { User, ImagePlus } from 'lucide-react';
import { useProfileImages } from '@/hooks/useProfileImages';

interface ProfileImageUploadProps {
  userId: string;
  currentImage: string | null;
  onImageUpdate: (url: string) => void;
}

export const ProfileImageUpload = ({ userId, currentImage, onImageUpdate }: ProfileImageUploadProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading } = useProfileImages(userId);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = await uploadImage(file, 'avatar');
      if (url) {
        onImageUpdate(url);
      }
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="relative w-full max-w-[300px] aspect-square mx-auto">
      <Card className="w-full h-full flex items-center justify-center bg-todoDarkGray">
        <Avatar className="w-full h-full rounded-lg">
          {currentImage && !imageError ? (
            <>
              {!imageLoaded && (
                <AvatarFallback className="w-full h-full bg-todoBlack text-todoYellow">
                  <User className="w-1/3 h-1/3" />
                </AvatarFallback>
              )}
              <AvatarImage 
                src={currentImage} 
                className={`object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </>
          ) : (
            <AvatarFallback className="w-full h-full bg-todoBlack text-todoYellow">
              <User className="w-1/3 h-1/3" />
            </AvatarFallback>
          )}
        </Avatar>
        <button 
          className="absolute bottom-4 right-4 bg-todoYellow p-2 rounded-full disabled:opacity-50"
          onClick={() => imageInputRef.current?.click()}
          disabled={uploading}
        >
          <ImagePlus className="w-6 h-6 text-black" />
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          disabled={uploading}
        />
      </Card>
    </div>
  );
};

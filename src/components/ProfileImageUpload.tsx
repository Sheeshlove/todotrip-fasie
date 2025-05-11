
import { useRef, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { User, ImagePlus, Camera } from 'lucide-react';
import { useProfileImages } from '@/hooks/useProfileImages';
import { toast } from 'sonner';

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
  const [isHovered, setIsHovered] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const url = await uploadImage(file, 'avatar');
        if (url) {
          onImageUpdate(url);
          toast.success('Фото профиля обновлено');
        }
      } catch (error) {
        toast.error('Ошибка при загрузке изображения');
        console.error(error);
      }
    }
  };

  return (
    <div className="relative w-full max-w-[200px] aspect-square mx-auto mb-8">
      <Card 
        className={`w-full h-full flex items-center justify-center bg-todoDarkGray/50 backdrop-blur-sm 
          border-white/5 rounded-xl shadow-lg overflow-hidden transition-all
          ${isHovered ? 'ring-2 ring-todoYellow/50' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Avatar className="w-full h-full rounded-lg border-none">
          {currentImage && !imageError ? (
            <React.Fragment>
              {!imageLoaded && (
                <AvatarFallback className="w-full h-full bg-todoBlack text-todoYellow">
                  <User className="w-1/3 h-1/3" />
                </AvatarFallback>
              )}
              <AvatarImage 
                src={currentImage} 
                className={`object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </React.Fragment>
          ) : (
            <AvatarFallback className="w-full h-full bg-todoBlack text-todoYellow">
              <User className="w-1/3 h-1/3" />
            </AvatarFallback>
          )}
        </Avatar>
        
        <div 
          className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 
            transition-opacity ${isHovered ? 'opacity-100' : ''} cursor-pointer`}
          onClick={() => imageInputRef.current?.click()}
        >
          <Camera className="w-10 h-10 text-todoYellow" />
        </div>
        
        <button 
          className={`absolute bottom-3 right-3 bg-todoYellow p-2 rounded-full 
            shadow-md transition-all disabled:opacity-50
            ${isHovered ? 'scale-110' : ''} hover:scale-110`}
          onClick={() => imageInputRef.current?.click()}
          disabled={uploading}
          aria-label="Изменить фото профиля"
        >
          <ImagePlus className="w-5 h-5 text-black" />
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
      
      <p className="text-xs text-center text-gray-500 mt-2">Нажмите для изменения фото профиля</p>
    </div>
  );
};

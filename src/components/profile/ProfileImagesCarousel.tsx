
import React, { useState, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useProfileImages } from '@/hooks/useProfileImages';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProfileImagesCarouselProps {
  userId: string;
  images: string[] | null;
  onImagesUpdate: (urls: string[]) => void;
}

export const ProfileImagesCarousel = ({
  userId,
  images,
  onImagesUpdate
}: ProfileImagesCarouselProps) => {
  const [uploading, setUploading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    uploadImage,
    deleteImage
  } = useProfileImages(userId);
  
  const userImages = images || [];
  const showAddButton = userImages.length < 10;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (userImages.length >= 10) {
      toast.error('Максимум 10 фотографий');
      return;
    }
    
    setUploading(true);
    try {
      const timestamp = Date.now();
      const url = await uploadImage(file, `image_${timestamp}`);
      if (url) {
        const updatedImages = [...userImages, url];
        onImagesUpdate(updatedImages);

        // Scroll to end to show the new image after a short delay
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Ошибка при загрузке изображения');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (confirm('Вы уверены, что хотите удалить это изображение?')) {
      try {
        const imagePath = imageUrl.split('/').pop();
        if (imagePath) {
          await deleteImage(imagePath);
        }

        // Filter out deleted image
        const updatedImages = userImages.filter(img => img !== imageUrl);

        // Notify parent about the change immediately
        onImagesUpdate(updatedImages);
        toast.success('Изображение удалено');
      } catch (error) {
        console.error('Error deleting image:', error);
        toast.error('Ошибка при удалении изображения');
      }
    }
  };

  return <div className="w-full max-w-md mx-auto mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-white">Ваши фотографии ({userImages.length}/10)</h3>
        {showAddButton && <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <label className="w-10 h-10 bg-todoYellow rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-400 transition-colors flex-shrink-0 ml-2" aria-label="Добавить фотографию">
                  <Plus className="w-6 h-6 text-black" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Добавить фото (максимум 10)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>}
      </div>
      
      {/* Scrollable thumbnails gallery with visible scrollbar */}
      <div className="relative">
        <div 
          ref={scrollContainerRef} 
          className="flex space-x-3 overflow-x-auto py-2 px-1" 
          style={{
            scrollbarWidth: 'thin',
            msOverflowStyle: 'auto'
          }}
        >
          {userImages.map((image, index) => (
            <div key={image} className="flex flex-col items-center">
              <div className="relative rounded-md overflow-hidden w-24 h-24 flex-shrink-0 mb-1 border border-todoBlack">
                <img src={image} alt={`Фото профиля ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <button 
                onClick={() => handleDeleteImage(image)} 
                className="p-1 text-red-600 hover:text-red-700 transition-colors" 
                aria-label="Удалить изображение" 
                title="Удалить изображение" 
                type="button"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          
          {/* Empty state when no images */}
          {userImages.length === 0 && !showAddButton && (
            <div className="flex-1 h-24 flex items-center justify-center text-todoMediumGray">
              Нет фотографий
            </div>
          )}
        </div>
        
        {/* Custom scrollbar styling - visible at the bottom */}
        <style jsx>{`
          div::-webkit-scrollbar {
            height: 4px;
            width: 4px;
          }
          div::-webkit-scrollbar-track {
            background: #333;
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb {
            background: #666;
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: #888;
          }
        `}</style>
      </div>
      
      {/* Instruction text for users */}
      <p className="text-sm text-gray-400 mt-2 text-center">
        Прокрутите для просмотра всех фотографий ({userImages.length}/10)
      </p>
    </div>;
};

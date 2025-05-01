
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from 'lucide-react';
import { useProfileImages } from '@/hooks/useProfileImages';
import { toast } from 'sonner';

interface ProfileImagesCarouselProps {
  userId: string;
  images: string[] | null;
  onImagesUpdate: (urls: string[]) => void;
}

export const ProfileImagesCarousel = ({ userId, images, onImagesUpdate }: ProfileImagesCarouselProps) => {
  const [uploading, setUploading] = useState(false);
  const { uploadImage, deleteImage } = useProfileImages(userId);
  
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
  
  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <h3 className="text-lg font-medium text-white mb-2">Ваши фотографии ({userImages.length}/10)</h3>
      
      {/* Scrollable thumbnails gallery - always show even if empty */}
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex space-x-3">
          {userImages.map((image, index) => (
            <div 
              key={image}
              className="flex flex-col items-center"
            >
              <div 
                className="relative rounded-md overflow-hidden w-20 h-20 flex-shrink-0 mb-1"
              >
                <img 
                  src={image} 
                  alt={`Фото профиля ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
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
          
          {/* Add photo button - always show if less than 10 images */}
          {showAddButton && (
            <label 
              className="w-20 h-20 flex-shrink-0 bg-todoYellow rounded-md flex items-center justify-center cursor-pointer hover:bg-yellow-400 transition-colors"
              aria-label="Добавить фотографию"
            >
              <Plus className="w-8 h-8 text-black" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

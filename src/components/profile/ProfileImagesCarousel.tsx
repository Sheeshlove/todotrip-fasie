
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { User, ImagePlus, X, Plus } from 'lucide-react';
import { useProfileImages } from '@/hooks/useProfileImages';
import { toast } from 'sonner';

interface ProfileImagesCarouselProps {
  userId: string;
  images: string[] | null;
  onImagesUpdate: (urls: string[]) => void;
}

export const ProfileImagesCarousel = ({ userId, images, onImagesUpdate }: ProfileImagesCarouselProps) => {
  const [uploading, setUploading] = useState(false);
  const [selectedMainImage, setSelectedMainImage] = useState<number>(0);
  const { uploadImage, deleteImage } = useProfileImages(userId);
  
  const userImages = images || [];
  const showAddButton = userImages.length < 10;

  // Get the current main image (or null if no images)
  const mainImage = userImages.length > 0 ? userImages[selectedMainImage] : null;

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
        
        // Find the index of deleted image
        const deletedIndex = userImages.indexOf(imageUrl);
        const updatedImages = userImages.filter(img => img !== imageUrl);
        
        // If we deleted the currently selected main image, reset to the first image
        if (deletedIndex === selectedMainImage) {
          setSelectedMainImage(0);
        }
        // If we deleted an image with a lower index than the selected one, adjust the selection index
        else if (deletedIndex < selectedMainImage) {
          setSelectedMainImage(prev => prev - 1);
        }
        
        // Notify parent about the change immediately
        onImagesUpdate(updatedImages);
        
        toast.success('Изображение удалено');
      } catch (error) {
        console.error('Error deleting image:', error);
        toast.error('Ошибка при удалении изображения');
      }
    }
  };

  // Function to select an image as the main image
  const selectMainImage = (index: number) => {
    setSelectedMainImage(index);
  };
  
  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <h3 className="text-lg font-medium text-white mb-2">Ваши фотографии ({userImages.length}/10)</h3>
      
      {/* Main image display area */}
      <div className="relative rounded-lg overflow-hidden aspect-[3/4] bg-todoDarkGray mb-3">
        {mainImage ? (
          <div className="relative w-full h-full">
            <img 
              src={mainImage} 
              alt="Main profile image"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => handleDeleteImage(mainImage)}
              className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
              aria-label="Удалить изображение"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-todoBlack">
            <User className="w-1/4 h-1/4 text-gray-500" />
          </div>
        )}
      </div>

      {/* Scrollable thumbnails carousel - always show even if empty */}
      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex space-x-2">
          {userImages.map((image, index) => (
            <div 
              key={image} 
              className={`relative rounded-md overflow-hidden transition-all cursor-pointer w-16 h-16 flex-shrink-0 
                ${index === selectedMainImage ? 'ring-2 ring-todoYellow' : ''}`}
              onClick={() => selectMainImage(index)}
            >
              <img 
                src={image} 
                alt={`Profile image ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
          
          {/* Add secondary photo button - always show if less than 10 images */}
          {showAddButton && (
            <label 
              className="w-16 h-16 flex-shrink-0 bg-todoYellow rounded-md flex items-center justify-center cursor-pointer hover:bg-yellow-400 transition-colors"
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

      {/* Add main button */}
      {userImages.length === 0 && (
        <label className="fixed bottom-24 right-4 bg-todoYellow p-2 rounded-full cursor-pointer disabled:opacity-50 z-10">
          <ImagePlus className="w-6 h-6 text-black" />
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
  );
};

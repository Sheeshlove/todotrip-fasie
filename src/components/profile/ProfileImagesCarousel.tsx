
import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { User, ImagePlus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProfileImages } from '@/hooks/useProfileImages';
import { toast } from 'sonner';

interface ProfileImagesCarouselProps {
  userId: string;
  images: string[] | null;
  onImagesUpdate: (urls: string[]) => void;
}

export const ProfileImagesCarousel = ({ userId, images, onImagesUpdate }: ProfileImagesCarouselProps) => {
  const [uploading, setUploading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
        setCurrentImageIndex(updatedImages.length - 1);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Ошибка при загрузке изображения');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (index: number) => {
    if (confirm('Вы уверены, что хотите удалить это изображение?')) {
      try {
        const imageUrl = userImages[index];
        const imagePath = imageUrl.split('/').pop();
        if (imagePath) {
          await deleteImage(imagePath);
        }
        
        const updatedImages = [...userImages];
        updatedImages.splice(index, 1);
        onImagesUpdate(updatedImages);
        
        if (currentImageIndex >= updatedImages.length) {
          setCurrentImageIndex(Math.max(0, updatedImages.length - 1));
        }
        
        toast.success('Изображение удалено');
      } catch (error) {
        console.error('Error deleting image:', error);
        toast.error('Ошибка при удалении изображения');
      }
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto mb-6 relative">
      <h3 className="text-lg font-medium text-white mb-2">Ваши фотографии ({userImages.length}/10)</h3>
      
      <div className="relative rounded-lg overflow-hidden aspect-[3/4] bg-todoDarkGray">
        {userImages.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {userImages.map((image, index) => (
                <CarouselItem key={image}>
                  <div className="relative w-full aspect-[3/4]">
                    <img 
                      src={image} 
                      alt={`Profile image ${index + 1}`} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <button
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
                      aria-label="Удалить изображение"
                    >
                      <X size={20} />
                    </button>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded-full text-sm">
                      {index + 1} / {userImages.length}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {userImages.length > 1 && (
              <>
                <CarouselPrevious 
                  className="left-2 bg-black/70 border-none hover:bg-black/90 text-white"
                />
                <CarouselNext 
                  className="right-2 bg-black/70 border-none hover:bg-black/90 text-white"
                />
              </>
            )}
          </Carousel>
        ) : (
          <div className="flex items-center justify-center h-full bg-todoBlack">
            <User className="w-1/4 h-1/4 text-gray-500" />
          </div>
        )}

        {showAddButton && (
          <label className="absolute bottom-4 right-4 bg-todoYellow p-2 rounded-full cursor-pointer disabled:opacity-50">
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
    </div>
  );
};

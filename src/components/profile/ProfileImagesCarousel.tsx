
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProfileImages } from '@/hooks/useProfileImages';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface ProfileImagesCarouselProps {
  userId: string;
  images: string[] | null;
  onImagesUpdate: (urls: string[]) => void;
}

export const ProfileImagesCarousel = ({ userId, images, onImagesUpdate }: ProfileImagesCarouselProps) => {
  const [uploading, setUploading] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { uploadImage, deleteImage } = useProfileImages(userId);
  
  const userImages = images || [];
  const showAddButton = userImages.length < 10;

  // Check if scrolling is possible
  useEffect(() => {
    const checkScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Also check on window resize
      window.addEventListener('resize', checkScroll);
      // Initial check
      checkScroll();

      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [userImages]);

  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

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
  
  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-white">Ваши фотографии ({userImages.length}/10)</h3>
        {showAddButton && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <label 
                  className="w-10 h-10 bg-todoYellow rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-400 transition-colors flex-shrink-0 ml-2"
                  aria-label="Добавить фотографию"
                >
                  <Plus className="w-6 h-6 text-black" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Добавить фото (максимум 10)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {/* Gallery with navigation controls */}
      <div className="relative">
        {/* Left scroll button */}
        {canScrollLeft && (
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-todoDarkGray border-todoBlack text-white hover:bg-todoBlack"
            onClick={scrollLeft}
            aria-label="Прокрутить влево"
          >
            <ChevronLeft size={16} />
          </Button>
        )}
        
        {/* Scrollable thumbnails gallery */}
        <div className="overflow-hidden relative">
          <div 
            ref={scrollContainerRef}
            className="flex space-x-3 overflow-x-auto scrollbar-hide py-2 px-1 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {userImages.map((image, index) => (
              <div 
                key={image}
                className="flex flex-col items-center"
              >
                <div 
                  className="relative rounded-md overflow-hidden w-24 h-24 flex-shrink-0 mb-1 border border-todoBlack"
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
            
            {/* Empty state when no images */}
            {userImages.length === 0 && !showAddButton && (
              <div className="flex-1 h-24 flex items-center justify-center text-todoMediumGray">
                Нет фотографий
              </div>
            )}
          </div>
        </div>
        
        {/* Right scroll button */}
        {canScrollRight && (
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-todoDarkGray border-todoBlack text-white hover:bg-todoBlack" 
            onClick={scrollRight}
            aria-label="Прокрутить вправо"
          >
            <ChevronRight size={16} />
          </Button>
        )}
      </div>
      
      {/* Instruction text for users */}
      <p className="text-sm text-todoMediumGray mt-2 text-center">
        {userImages.length < 10 
          ? `Вы можете добавить еще ${10 - userImages.length} фото` 
          : "Достигнут лимит в 10 фотографий"}
      </p>
    </div>
  );
};

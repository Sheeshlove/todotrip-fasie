
import { useState, useRef, useCallback } from 'react';
import { useProfileImages } from '@/hooks/useProfileImages';
import { toast } from 'sonner';

export const useProfileImagesCarousel = (userId: string, images: string[] | null, onImagesUpdate: (urls: string[]) => void) => {
  const [uploading, setUploading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
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
  
  // Function to move an image in the array (reorder)
  const moveImage = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const draggedImage = userImages[dragIndex];
      const newImages = [...userImages];
      newImages.splice(dragIndex, 1);
      newImages.splice(hoverIndex, 0, draggedImage);
      
      // Update the images order
      onImagesUpdate(newImages);
    },
    [userImages, onImagesUpdate]
  );

  return {
    userImages,
    showAddButton,
    uploading,
    scrollContainerRef,
    handleImageUpload,
    handleDeleteImage,
    moveImage
  };
};

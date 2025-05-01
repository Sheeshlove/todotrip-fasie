
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableImageItem } from './DraggableImageItem';
import { AddImageButton } from './AddImageButton';
import { useProfileImagesCarousel } from '@/hooks/useProfileImagesCarousel';
import "@/styles/custom-scrollbar.css";

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
  const {
    userImages,
    showAddButton,
    uploading,
    scrollContainerRef,
    handleImageUpload,
    handleDeleteImage,
    moveImage
  } = useProfileImagesCarousel(userId, images, onImagesUpdate);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full max-w-md mx-auto mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-white">Ваши фотографии ({userImages.length}/10)</h3>
          {showAddButton && <AddImageButton onImageUpload={handleImageUpload} uploading={uploading} />}
        </div>
        
        {/* Scrollable thumbnails gallery with styled scrollbar */}
        <div className="relative">
          <div 
            ref={scrollContainerRef} 
            className="flex space-x-3 overflow-x-auto py-2 px-1 custom-scrollbar" 
          >
            {userImages.map((image, index) => (
              <DraggableImageItem 
                key={image}
                image={image}
                index={index}
                moveImage={moveImage}
                handleDeleteImage={handleDeleteImage}
              />
            ))}
            
            {/* Empty state when no images */}
            {userImages.length === 0 && !showAddButton && (
              <div className="flex-1 h-24 flex items-center justify-center text-todoMediumGray">
                Нет фотографий
              </div>
            )}
          </div>
        </div>
        
        {/* Instruction text for users */}
        <p className="text-sm text-gray-400 mt-2 text-center">
          Прокрутите для просмотра всех фотографий, перетащите для изменения порядка ({userImages.length}/10)
        </p>
      </div>
    </DndProvider>
  );
};

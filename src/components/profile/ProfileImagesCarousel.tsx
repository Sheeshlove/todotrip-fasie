
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
      <div className="w-full max-w-md mx-auto mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-white/90">Галерея ({userImages.length}/10)</h3>
          {showAddButton && <AddImageButton onImageUpload={handleImageUpload} uploading={uploading} />}
        </div>
        
        <div className="bg-todoDarkGray/50 backdrop-blur-sm rounded-xl p-3 border border-white/5 shadow-lg">
          <div 
            ref={scrollContainerRef} 
            className="flex space-x-4 overflow-x-auto py-2 px-1 custom-scrollbar min-h-[120px]" 
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
            {userImages.length === 0 && (
              <div className="flex-1 h-24 flex items-center justify-center text-todoMediumGray/70 w-full">
                <p className="text-sm">Нет фотографий</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Instruction text for users */}
        <p className="text-xs text-gray-500 mt-2 text-center">
          ◀️ Прокрутите для просмотра • Перетащите для изменения порядка ▶️
        </p>
      </div>
    </DndProvider>
  );
};

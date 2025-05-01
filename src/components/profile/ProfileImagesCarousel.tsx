
import React, { useState, useRef, useCallback } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useProfileImages } from '@/hooks/useProfileImages';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import "@/styles/custom-scrollbar.css";

interface ProfileImagesCarouselProps {
  userId: string;
  images: string[] | null;
  onImagesUpdate: (urls: string[]) => void;
}

// Type for the draggable image item
interface DragItem {
  index: number;
  id: string;
  type: string;
}

// Component for each draggable image item
const DraggableImageItem = ({ 
  image, 
  index, 
  moveImage, 
  handleDeleteImage 
}: { 
  image: string; 
  index: number; 
  moveImage: (dragIndex: number, hoverIndex: number) => void; 
  handleDeleteImage: (imageUrl: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'IMAGE',
    item: { index, id: image },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const [, drop] = useDrop({
    accept: 'IMAGE',
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      // Get horizontal middle
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      
      // Get pixels to the left
      const hoverClientX = clientOffset!.x - hoverBoundingRect.left;
      
      // Only perform the move when the mouse has crossed half of the item's width
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }
      
      // Time to actually perform the action
      moveImage(dragIndex, hoverIndex);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      item.index = hoverIndex;
    },
  });
  
  const opacity = isDragging ? 0.4 : 1;
  
  // Initialize drag and drop refs
  drag(drop(ref));
  
  return (
    <div 
      ref={ref} 
      style={{ opacity }} 
      className="flex flex-col items-center"
    >
      <div className="relative rounded-md overflow-hidden w-24 h-24 flex-shrink-0 mb-1 border border-todoBlack group">
        <img 
          src={image} 
          alt={`Фото профиля ${index + 1}`} 
          className="w-full h-full object-cover" 
          loading="lazy" 
        />
        <button 
          onClick={() => handleDeleteImage(image)} 
          className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity" 
          aria-label="Удалить изображение" 
          title="Удалить изображение" 
          type="button"
        >
          <Trash2 size={12} />
        </button>
        <div className="absolute bottom-1 left-1 p-1 text-white opacity-0 group-hover:opacity-70 cursor-move">
          <GripVertical size={16} />
        </div>
      </div>
    </div>
  );
};

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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full max-w-md mx-auto mb-6">
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


import React, { useRef } from 'react';
import { Trash2, GripVertical } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Type for the draggable image item
interface DragItem {
  index: number;
  id: string;
  type: string;
}

interface DraggableImageItemProps {
  image: string;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  handleDeleteImage: (imageUrl: string) => void;
}

export const DraggableImageItem = ({
  image,
  index,
  moveImage,
  handleDeleteImage
}: DraggableImageItemProps) => {
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
  
  // Initialize drag and drop refs
  drag(drop(ref));
  
  return (
    <div 
      ref={ref} 
      style={{ opacity: isDragging ? 0.4 : 1 }} 
      className="flex flex-col items-center transition-all"
    >
      <div className="relative rounded-lg overflow-hidden w-24 h-24 flex-shrink-0 
        border border-white/10 group shadow-md transition-transform 
        hover:scale-[1.03] hover:shadow-lg">
        <img 
          src={image} 
          alt={`Фото профиля ${index + 1}`} 
          className="w-full h-full object-cover" 
          loading="lazy" 
        />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => handleDeleteImage(image)} 
                className="absolute top-1 right-1 p-1.5 bg-black/50 backdrop-blur-sm hover:bg-red-600 
                  rounded-full text-white opacity-0 group-hover:opacity-100 transition-all" 
                aria-label="Удалить изображение" 
                type="button"
              >
                <Trash2 size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-black/80 border-white/10 text-xs">
              <p>Удалить</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-black/40 
          backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 
          cursor-move transition-opacity flex items-center justify-center">
          <GripVertical size={14} className="mr-1" /> <span className="text-xs">Переместить</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 mt-1">{index + 1}</span>
    </div>
  );
};

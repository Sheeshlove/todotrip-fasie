
import React, { useRef } from 'react';
import { Trash2, GripVertical } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';

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

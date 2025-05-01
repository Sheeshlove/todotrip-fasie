
import React from 'react';
import { Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AddImageButtonProps {
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
}

export const AddImageButton = ({ onImageUpload, uploading }: AddImageButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <label 
            className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all 
              flex-shrink-0 ${uploading 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-todoYellow hover:bg-yellow-400 hover:scale-105 hover:shadow-md'}`} 
            aria-label="Добавить фотографию"
          >
            <Plus className="w-5 h-5 text-black" />
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={onImageUpload} 
              disabled={uploading} 
            />
          </label>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-black/80 border-white/10 text-xs">
          <p>Добавить фото</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

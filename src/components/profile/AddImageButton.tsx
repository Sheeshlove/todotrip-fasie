
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
          <label className="w-10 h-10 bg-todoYellow rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-400 transition-colors flex-shrink-0 ml-2" aria-label="Добавить фотографию">
            <Plus className="w-6 h-6 text-black" />
            <input type="file" accept="image/*" className="hidden" onChange={onImageUpload} disabled={uploading} />
          </label>
        </TooltipTrigger>
        <TooltipContent>
          <p>Добавить фото (максимум 10)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

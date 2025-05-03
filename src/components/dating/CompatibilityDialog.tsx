
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getCompatibilityColor, getCompatibilityBgColor } from '@/services/compatibilityService';
import { CircleInfo, Heart } from 'lucide-react';

interface CompatibilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  compatibilityScore: number;
  analysis: Record<string, string>;
}

export const CompatibilityDialog: React.FC<CompatibilityDialogProps> = ({
  isOpen,
  onClose,
  compatibilityScore,
  analysis
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-todoDarkGray border-white/10 text-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
            <Heart className="text-todoYellow w-5 h-5" />
            Совместимость
            <Heart className="text-todoYellow w-5 h-5" />
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Score display */}
          <div className="flex justify-center">
            <div className={`${getCompatibilityBgColor(compatibilityScore)} w-24 h-24 rounded-full flex items-center justify-center`}>
              <span className="text-black text-2xl font-bold">{compatibilityScore}%</span>
            </div>
          </div>
          
          {/* Overall analysis */}
          {analysis.overall && (
            <div className="bg-todoBlack/30 p-4 rounded-lg">
              <p className="text-center font-medium">{analysis.overall}</p>
            </div>
          )}
          
          {/* Trait-by-trait analysis */}
          <div className="space-y-3">
            {Object.entries(analysis).filter(([key]) => key !== 'overall').map(([trait, text]) => (
              <div key={trait} className="bg-todoDarkGray/60 p-3 rounded-lg border border-white/10">
                <h3 className="font-medium mb-1 flex items-center gap-1">
                  <CircleInfo className="w-4 h-4 text-todoYellow" />
                  {trait === 'openness' && 'Открытость опыту'}
                  {trait === 'conscientiousness' && 'Добросовестность'}
                  {trait === 'extraversion' && 'Экстраверсия'}
                  {trait === 'agreeableness' && 'Доброжелательность'}
                  {trait === 'neuroticism' && 'Нейротизм'}
                </h3>
                <p className="text-sm text-todoLightGray">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

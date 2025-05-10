
import React from 'react';
import { Sparkles } from 'lucide-react';
import PreferenceSlider from './PreferenceSlider';

interface PreferencesSectionProps {
  childFriendly: number[];
  setChildFriendly: (value: number[]) => void;
  culturalProgram: number[];
  setCulturalProgram: (value: number[]) => void;
  sociability: number[];
  setSociability: (value: number[]) => void;
  relaxation: number[];
  setRelaxation: (value: number[]) => void;
  popularity: number[];
  setPopularity: (value: number[]) => void;
  instagrammability: number[];
  setInstagrammability: (value: number[]) => void;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({
  childFriendly,
  setChildFriendly,
  culturalProgram,
  setCulturalProgram,
  sociability,
  setSociability,
  relaxation,
  setRelaxation,
  popularity,
  setPopularity,
  instagrammability,
  setInstagrammability,
}) => {
  return (
    <>
      <div className="border-t border-white/5 pt-6 mb-2">
        <h3 className="text-white/90 text-sm font-medium mb-4 flex items-center">
          <Sparkles size={16} className="mr-2 text-todoYellow" /> Настройка предпочтений
        </h3>
      </div>
      
      <div className="space-y-6">
        <PreferenceSlider
          value={childFriendly}
          onChange={setChildFriendly}
          leftLabel="место не для детей"
          rightLabel="место только для детей"
        />
        
        <PreferenceSlider
          value={culturalProgram}
          onChange={setCulturalProgram}
          leftLabel="отключаем мозг"
          rightLabel="думаем о высоком"
        />
        
        <PreferenceSlider
          value={sociability}
          onChange={setSociability}
          leftLabel="хиккуем"
          rightLabel="экстравертимся"
        />
        
        <PreferenceSlider
          value={relaxation}
          onChange={setRelaxation}
          leftLabel="активный отдых"
          rightLabel="релакс"
        />
        
        <PreferenceSlider
          value={popularity}
          onChange={setPopularity}
          leftLabel="я тут один"
          rightLabel="популярное место"
        />
        
        <PreferenceSlider
          value={instagrammability}
          onChange={setInstagrammability}
          leftLabel="я только посмотреть"
          rightLabel="фоткай меня"
        />
      </div>
    </>
  );
};

export default PreferencesSection;


import React from 'react';
import { Card } from '@/components/ui/card';
import { Construction } from 'lucide-react';
import TripMap from './TripMap';

const UnderDevelopmentMessage: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-todoDarkGray/50 backdrop-blur-sm border-white/5 p-6 rounded-xl shadow-lg text-center">
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
          <Construction size={64} className="text-todoYellow animate-pulse" />
          <h2 className="text-2xl font-bold text-white">
            :( Эта часть всё ещё находится в разработке, но скоро мы её закончим!
          </h2>
          <p className="text-todoLightGray">
            This section is still under development, but we'll finish it soon!
          </p>
        </div>
      </Card>
      
      <Card className="bg-todoDarkGray/50 backdrop-blur-sm border-white/5 p-4 rounded-xl shadow-lg">
        <h3 className="text-white text-lg font-medium mb-4 px-2">
          Предварительный просмотр маршрута / Route Preview
        </h3>
        <TripMap />
      </Card>
    </div>
  );
};

export default UnderDevelopmentMessage;

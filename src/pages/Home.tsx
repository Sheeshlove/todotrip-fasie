
import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { preloadImages } from '@/data/placeholderImages';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight, Map, Info, Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Home = () => {
  const { profile } = useAuth();
  const userCity = profile?.city || 'Санкт-Петербург';
  
  useEffect(() => {
    preloadImages();
  }, []);
  
  return (
    <PageLayout title="ToDoTrip - Главная" description="AI-powered travel route planner">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4 py-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-todoYellow mb-2">Добро пожаловать в ToDoTrip</h1>
            <p className="text-todoLightGray">Ваш персональный помощник для путешествий по России</p>
          </div>
          
          <Card className="bg-todoDarkGray border-todoLightGray/10 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-todoYellow/20 p-3 rounded-full mr-4">
                <Map className="w-6 h-6 text-todoYellow" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Популярные направления</h2>
                <p className="text-sm text-todoMediumGray">Изучите лучшие места для посещения</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <DestinationButton city={userCity} />
              <DestinationButton city="Москва" disabled />
              <DestinationButton city="Сочи" disabled />
            </div>
          </Card>
          
          <Card className="bg-todoDarkGray border-todoLightGray/10 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-todoYellow/20 p-3 rounded-full mr-4">
                <Info className="w-6 h-6 text-todoYellow" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">О приложении</h2>
                <p className="text-sm text-todoMediumGray">Как работает ToDoTrip</p>
              </div>
            </div>
            
            <p className="text-todoLightGray mb-4">
              ToDoTrip поможет вам спланировать идеальный маршрут, найти интересные места и 
              забронировать услуги у наших партнеров.
            </p>
            
            <div className="flex justify-between">
              <Link to="/partners">
                <Button variant="secondary" className="bg-todoBlack border border-todoLightGray/20 hover:bg-todoBlack/80">
                  Партнеры
                </Button>
              </Link>
              <Link to="/dating">
                <Button variant="secondary" className="bg-todoBlack border border-todoLightGray/20 hover:bg-todoBlack/80">
                  Общение
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

const DestinationButton = ({ city, disabled = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!disabled) {
      navigate(`/ai-trip?city=${encodeURIComponent(city)}`);
    }
  };

  return (
    <Button 
      className={`w-full justify-between text-left ${
        disabled 
          ? 'bg-todoBlack/30 text-todoMediumGray cursor-not-allowed' 
          : 'bg-todoBlack text-white hover:bg-todoBlack/80'
      }`}
      disabled={disabled}
      onClick={handleClick}
    >
      <div className="flex items-center">
        <Camera className="w-4 h-4 mr-2" />
        <span>{city}</span>
      </div>
      {disabled ? (
        <span className="text-xs">Скоро</span>
      ) : (
        <ChevronRight className="w-4 h-4" />
      )}
    </Button>
  );
};

export default Home;

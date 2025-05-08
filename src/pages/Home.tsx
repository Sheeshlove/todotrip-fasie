
import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { preloadImages } from '@/data/placeholderImages';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight, Home as HomeIcon, Info, Camera, Users, Sparkles, Handshake, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Home = () => {
  const { profile } = useAuth();
  const userCity = profile?.city || '';

  useEffect(() => {
    preloadImages();
  }, []);

  // Function to get destination buttons in the correct order
  const getDestinationButtons = () => {
    const buttons = [];

    // Always show Санкт-Петербург first (clickable)
    buttons.push(<DestinationButton key="spb" city="Санкт-Петербург" disabled={false} />);

    // Show user's city if it's not Санкт-Петербург and not empty
    if (userCity && userCity !== 'Санкт-Петербург') {
      buttons.push(<DestinationButton key="usercity" city={userCity} disabled={true} />);
    }

    // Always show Москва and Сочи (disabled)
    buttons.push(<DestinationButton key="moscow" city="Москва" disabled={true} />);
    buttons.push(<DestinationButton key="sochi" city="Сочи" disabled={true} />);
    return buttons;
  };

  return (
    <PageLayout title="ToDoTrip - Главная" description="AI-powered travel route planner">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4 py-8">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-todoYellow mb-3">Добро пожаловать в ToDoTrip</h1>
            <p className="text-todoLightGray">Ваш персональный помощник для путешествий по России</p>
          </div>
          
          <Card className="bg-todoDarkGray/50 backdrop-blur-sm border-white/5 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center mb-6">
              <div className="bg-todoYellow/20 p-3 rounded-full mr-4">
                <HomeIcon className="w-6 h-6 text-todoYellow" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Популярные направления</h2>
                <p className="text-sm text-todoLightGray">Изучите лучшие места для посещения</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {getDestinationButtons()}
            </div>
          </Card>
          
          <Card className="bg-todoDarkGray/50 backdrop-blur-sm border-white/5 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center mb-6">
              <div className="bg-todoYellow/20 p-3 rounded-full mr-4">
                <Users className="w-6 h-6 text-todoYellow" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">О приложении</h2>
                <p className="text-sm text-todoLightGray">Как работает ToDoTrip</p>
              </div>
            </div>
            
            <p className="text-todoLightGray mb-6 leading-relaxed">
              ToDoTrip поможет вам спланировать идеальный маршрут, найти интересные места и 
              забронировать услуги у наших партнеров.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <Link to="/partners">
                <Button variant="secondary" className="w-full bg-todoBlack border border-white/10 hover:bg-todoDarkGray hover:border-todoYellow/30 transition-all">
                  <Handshake size={18} className="mr-2" />
                  Партнеры
                </Button>
              </Link>
              <Link to="/dating">
                <Button variant="secondary" className="w-full bg-todoBlack border border-white/10 hover:bg-todoDarkGray hover:border-todoYellow/30 transition-all">
                  <MessageCircle size={18} className="mr-2" />
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
      className={`w-full justify-between text-left transition-all ${
        disabled ? 'bg-todoBlack/30 text-todoMediumGray cursor-not-allowed' : 'bg-todoBlack/60 text-white hover:bg-todoBlack hover:scale-102 hover:shadow-md'
      }`} 
      disabled={disabled} 
      onClick={handleClick}
    >
      <div className="flex items-center">
        <Camera className="w-4 h-4 mr-2" />
        <span>{city}</span>
      </div>
      {disabled ? (
        <span className="text-xs bg-gray-800 px-2 py-1 rounded-full">Скоро</span>
      ) : (
        <ChevronRight className="w-4 h-4" />
      )}
    </Button>
  );
};

export default Home;

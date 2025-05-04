
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Home, Handshake, MessageCircle, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const BottomMenu = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const menuItems = [
    { path: '/', name: 'Главная', icon: Home },
    { path: '/partners', name: 'Партнёры', icon: Handshake },
    { path: '/dating', name: 'Общение', icon: MessageCircle },
    { path: '/profile', name: 'Профиль', icon: User },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 w-full bg-todoDarkGray/90 backdrop-blur-md border-t border-white/5 py-2 px-2 flex justify-around z-30 transition-all">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center ${isMobile ? 'px-2 py-1.5' : 'px-3 py-2'} rounded-lg transition-all hover:scale-105 ${
              isActive ? 'text-todoYellow bg-todoBlack/30' : 'text-todoLightGray hover:text-white'
            }`}
          >
            <item.icon size={isMobile ? 20 : 24} className={`${isMobile ? '' : 'mb-1'} ${isActive ? 'animate-pulse' : ''}`} />
            <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-unbounded`}>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomMenu;

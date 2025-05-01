
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Map, ShoppingBag, Heart, User } from 'lucide-react';

const BottomMenu = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', name: 'Главная', icon: Map },
    { path: '/partners', name: 'Партнёры', icon: ShoppingBag },
    { path: '/dating', name: 'Общение', icon: Heart },
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
            className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all hover:scale-105 ${
              isActive ? 'text-todoYellow bg-todoBlack/30' : 'text-todoLightGray hover:text-white'
            }`}
          >
            <item.icon size={24} className={`mb-1 ${isActive ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-unbounded">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomMenu;


import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Map, ShoppingBag, Heart, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BottomMenu = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', name: 'Главная', icon: Map },
    { path: '/partners', name: 'Партнёры', icon: ShoppingBag },
    { path: '/dating', name: 'Общение', icon: Heart },
    { path: '/profile', name: 'Профиль', icon: User },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 w-full bg-todoDarkGray border-t border-gray-800 py-2 px-2 flex justify-around z-30">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center px-2 py-1 rounded-lg transition-colors ${
              isActive ? 'text-todoYellow bg-todoBlack/20' : 'text-todoMediumGray hover:text-todoLightGray'
            }`}
          >
            <item.icon size={24} className="mb-1" />
            <span className="text-xs font-unbounded">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomMenu;

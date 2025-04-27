
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Map, Bot, Heart, LogOut, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const BottomMenu = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const menuItems = [
    { path: '/', name: 'Подбор пути', icon: Map },
    { path: '/ai-trip', name: 'Нейросеть', icon: Bot },
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
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="flex flex-col items-center justify-center px-2 py-1 rounded-lg transition-colors text-todoMediumGray hover:text-todoLightGray">
            <LogOut size={24} className="mb-1" />
            <span className="text-xs font-unbounded">Выйти</span>
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-todoDarkGray border-todoBlack">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Выход из аккаунта</AlertDialogTitle>
            <AlertDialogDescription className="text-todoMediumGray">
              Вы уверены, что хотите выйти из аккаунта?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent text-white hover:bg-transparent hover:text-white/80 border-todoBlack">
              Нет
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={signOut}
              className="bg-[#ea384c] text-white hover:bg-[#ea384c]/80"
            >
              Да
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BottomMenu;

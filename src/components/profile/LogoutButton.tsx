
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
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

export const LogoutButton = () => {
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          className="w-full"
        >
          Выйти из аккаунта
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-todoDarkGray border-todoBlack">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Выход из аккаунта</AlertDialogTitle>
          <AlertDialogDescription className="text-todoMediumGray">
            Вы уверены, что хотите выйти из аккаунта? Это действие завершит текущую сессию и вам потребуется авторизоваться повторно.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent text-white hover:bg-transparent hover:text-white/80 border-todoBlack">
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleLogout}
            className="bg-[#ea384c] text-white hover:bg-[#ea384c]/80"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Выход...' : 'Выйти'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

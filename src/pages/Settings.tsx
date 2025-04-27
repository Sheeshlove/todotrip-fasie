import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
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

const Settings = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear test account credentials
    localStorage.removeItem('testEmail');
    localStorage.removeItem('testPassword');
    // Navigate to profile page which will show login screen
    navigate('/profile');
  };

  return (
    <PageLayout title="ТуДуТрип - Настройки" description="Настройки профиля">
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-todoYellow">Настройки профиля</h1>
        
        <div className="bg-todoDarkGray rounded-lg p-6 max-w-md w-full space-y-4">
          <Button 
            variant="outline" 
            className="w-full bg-todoBlack text-white hover:bg-todoBlack/80"
            onClick={() => {/* TODO: Implement email change */}}
          >
            Поменять почту
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full bg-todoBlack text-white hover:bg-todoBlack/80"
            onClick={() => {/* TODO: Implement phone change */}}
          >
            Поменять номер телефона
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full bg-todoBlack text-white hover:bg-todoBlack/80"
            onClick={() => {/* TODO: Implement password change */}}
          >
            Поменять пароль
          </Button>

          <Button 
            variant="outline" 
            className="w-full bg-todoBlack text-white hover:bg-todoBlack/80"
            onClick={() => navigate('/contact')}
          >
            Связаться с нами
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full bg-transparent text-[#ea384c] hover:bg-transparent hover:text-[#ea384c]/80 border-none flex items-center gap-2"
              >
                <LogOut size={20} />
                Выйти
              </Button>
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
                  onClick={handleLogout}
                  className="bg-[#ea384c] text-white hover:bg-[#ea384c]/80"
                >
                  Да
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;


import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
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
  );
};

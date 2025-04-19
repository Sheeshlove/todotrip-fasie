
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  
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
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;

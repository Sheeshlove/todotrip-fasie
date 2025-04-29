
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ProfileEditor } from '@/components/profile/ProfileEditor';
import { PersonalityTest } from '@/components/profile/PersonalityTest';
import { TestResultsDisplay } from '@/components/profile/TestResultsDisplay';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageLayout from '@/components/PageLayout';
import BottomMenu from '@/components/BottomMenu';
import { Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('login');
  const [showTest, setShowTest] = useState(false);

  if (loading) {
    return (
      <PageLayout title="ТуДуТрип - Профиль" description="Профиль пользователя">
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
          <Loader2 className="h-12 w-12 animate-spin text-todoYellow" />
          <p className="mt-4 text-white">Загрузка...</p>
        </div>
        <BottomMenu />
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout title="ТуДуТрип - Профиль" description="Авторизация пользователя">
        <div className="min-h-[85vh] pb-16">
          <div className="max-w-md mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 text-todoYellow text-center">Профиль</h1>
            
            <Tabs 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-0">
                <div className="p-4 bg-todoDarkGray rounded-lg">
                  <p className="text-white mb-4">
                    Войдите в свой аккаунт, чтобы получить доступ к личному профилю и сохраненным маршрутам
                  </p>
                  <Button 
                    className="w-full bg-todoYellow text-black hover:bg-yellow-400 mb-4" 
                    onClick={() => navigate('/login')}
                  >
                    Войти
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="register" className="mt-0">
                <div className="p-4 bg-todoDarkGray rounded-lg">
                  <p className="text-white mb-4">
                    Создайте аккаунт, чтобы сохранять маршруты и получить доступ ко всем функциям приложения
                  </p>
                  <Button 
                    className="w-full bg-todoYellow text-black hover:bg-yellow-400 mb-4" 
                    onClick={() => navigate('/register')}
                  >
                    Создать аккаунт
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <BottomMenu />
      </PageLayout>
    );
  }

  return (
    <PageLayout title="ТуДуТрип - Профиль" description="Профиль пользователя">
      <div className="min-h-[85vh] pb-16">
        <div className="max-w-md mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6 text-todoYellow text-center">Мой профиль</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="profile">Профиль</TabsTrigger>
              <TabsTrigger value="account">Аккаунт</TabsTrigger>
              <TabsTrigger value="personality">Личность</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileEditor activeTab="profile" />
            </TabsContent>

            <TabsContent value="account">
              <ProfileEditor activeTab="account" />
            </TabsContent>

            <TabsContent value="personality">
              {showTest ? (
                <PersonalityTest onComplete={() => setShowTest(false)} />
              ) : (
                <TestResultsDisplay onTakeTest={() => setShowTest(true)} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <BottomMenu />
    </PageLayout>
  );
};

export default ProfilePage;


import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProfileForm } from './ProfileForm';
import { AccountSettings } from './AccountSettings';

export const ProfileEditor = () => {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="profile">Профиль</TabsTrigger>
        <TabsTrigger value="account">Аккаунт</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card className="bg-todoDarkGray border-todoBlack">
          <CardContent className="pt-6">
            <ProfileForm />
            <Separator className="my-6 bg-todoBlack" />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="account">
        <AccountSettings />
      </TabsContent>
    </Tabs>
  );
};

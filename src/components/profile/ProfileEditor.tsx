
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProfileForm } from './ProfileForm';
import { AccountSettings } from './AccountSettings';

interface ProfileEditorProps {
  activeTab: 'profile' | 'account';
}

export const ProfileEditor = ({ activeTab }: ProfileEditorProps) => {
  return (
    <>
      {activeTab === 'profile' && (
        <Card className="bg-todoDarkGray border-todoBlack">
          <CardContent className="pt-6">
            <ProfileForm />
            <Separator className="my-6 bg-todoBlack" />
          </CardContent>
        </Card>
      )}

      {activeTab === 'account' && (
        <AccountSettings />
      )}
    </>
  );
};

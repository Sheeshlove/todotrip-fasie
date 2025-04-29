
import { Card, CardContent } from '@/components/ui/card';
import { EmailChangeForm } from './EmailChangeForm';
import { PasswordChangeForm } from './PasswordChangeForm';
import { LogoutButton } from './LogoutButton';

export const AccountSettings = () => {
  return (
    <>
      <Card className="bg-todoDarkGray border-todoBlack mb-6">
        <CardContent className="pt-6">
          <h3 className="text-lg font-bold text-white mb-4">Изменить email</h3>
          <EmailChangeForm />
        </CardContent>
      </Card>

      <Card className="bg-todoDarkGray border-todoBlack">
        <CardContent className="pt-6">
          <h3 className="text-lg font-bold text-white mb-4">Изменить пароль</h3>
          <PasswordChangeForm />
        </CardContent>
      </Card>

      <Card className="bg-todoDarkGray border-todoBlack mt-6">
        <CardContent className="pt-6">
          <LogoutButton />
        </CardContent>
      </Card>
    </>
  );
};

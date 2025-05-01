
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ProfileForm } from './ProfileForm';
import { AccountSettings } from './AccountSettings';

interface ProfileEditorProps {
  activeTab: 'profile' | 'account';
}

export const ProfileEditor = ({ activeTab }: ProfileEditorProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {activeTab === 'profile' && (
        <div className="animate-fade-in">
          <ProfileForm />
        </div>
      )}

      {activeTab === 'account' && (
        <div className="animate-fade-in">
          <AccountSettings />
        </div>
      )}
    </div>
  );
};

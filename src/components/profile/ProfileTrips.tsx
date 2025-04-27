
import { Card } from '@/components/ui/card';
import { SavedRoutesDialog } from '@/components/SavedRoutesDialog';

export const ProfileTrips = () => {
  return (
    <Card className="w-full p-4 bg-todoDarkGray">
      <h3 className="text-white text-center mb-2">Ближайшие поездки</h3>
      <SavedRoutesDialog />
    </Card>
  );
};

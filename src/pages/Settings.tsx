
import PageLayout from '@/components/PageLayout';

const Settings = () => {
  return (
    <PageLayout title="ToDoTrip - Settings" description="Настройки приложения">
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Настройки</h1>
        
        <div className="bg-todoDarkGray rounded-lg p-6 max-w-md w-full">
          <p className="text-lg leading-relaxed">
            Пока нечего настраивать, но мы это исправим. 
            <br /><br />
            Тыкайся с другими экранами пока, путник.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;

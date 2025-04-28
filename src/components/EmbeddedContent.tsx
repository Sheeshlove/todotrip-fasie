
import { useEffect, useState } from 'react';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const EmbeddedContent = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const partnerUrl = 'https://scantour.ru/testtest.html?my_module=todotrip.work@gmail.com';

  const loadContent = async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      await fetch(partnerUrl, {
        mode: 'no-cors',
        cache: 'force-cache'
      });
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load partner content:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleRetry = () => {
    loadContent();
  };

  if (hasError) {
    return (
      <div className="w-full h-[400px] bg-todoDarkGray rounded-lg overflow-hidden flex items-center justify-center p-4 font-unbounded">
        <Alert variant="destructive" className="max-w-md bg-todoDarkGray border-red-500">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <AlertTitle className="text-red-500 mb-2">Ошибка загрузки контента</AlertTitle>
          <AlertDescription className="text-todoMediumGray mb-4">
            Не удалось загрузить предложения от партнеров. Проверьте соединение и попробуйте снова.
          </AlertDescription>
          <Button 
            onClick={handleRetry}
            className="bg-todoYellow hover:bg-todoYellow/80 text-todoBlack flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Попробовать снова
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[1200px] bg-todoDarkGray rounded-lg overflow-hidden font-unbounded">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-todoBlack/80 z-10">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-todoYellow animate-spin" />
            <p className="text-todoMediumGray">Загрузка предложений партнёров...</p>
          </div>
        </div>
      )}
      
      <iframe
        src={partnerUrl}
        className={`w-full h-full border-0 transition-opacity duration-300 ${isLoaded && !isLoading ? 'opacity-100' : 'opacity-0'}`}
        style={{
          colorScheme: 'dark',
          fontFamily: 'Unbounded, system-ui, sans-serif'
        }}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
};

export default EmbeddedContent;

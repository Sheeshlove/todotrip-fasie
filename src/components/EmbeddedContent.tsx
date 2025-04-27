
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const EmbeddedContent = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const preloadContent = async () => {
      try {
        await fetch('https://scantour.ru/testtest.html?my_module=todotrip.work@gmail.com', {
          mode: 'no-cors',
          cache: 'force-cache'
        });
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to preload content:', error);
        setIsLoaded(true); // Still show the content even if preload fails
      }
    };

    preloadContent();
  }, []);

  return (
    <div className="relative w-full h-[1200px] bg-todoDarkGray rounded-lg overflow-hidden font-unbounded">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-todoBlack/80 z-10">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-todoYellow animate-spin" />
            <p className="text-todoMediumGray">Загрузка предложений партнёров...</p>
          </div>
        </div>
      )}
      
      <iframe
        src="https://scantour.ru/testtest.html?my_module=todotrip.work@gmail.com"
        className={`w-full h-full border-0 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          colorScheme: 'dark',
          fontFamily: 'Unbounded, system-ui, sans-serif'
        }}
        loading="lazy"
      />
    </div>
  );
};

export default EmbeddedContent;

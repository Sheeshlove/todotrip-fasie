import { useEffect, useState } from 'react';

const EmbeddedContent = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Preload the content
    const preloadContent = async () => {
      try {
        // Preload the main content
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

  if (!isLoaded) {
    return null;
  }

  return (
    <object 
      data="https://scantour.ru/testtest.html?my_module=todotrip.work@gmail.com" 
      width="100%" 
      height="1200"
    >
      <embed 
        src="https://scantour.ru/testtest.html?my_module=321" 
        width="100%" 
        height="1200"
      />
      Error: Embedded data could not be displayed.
    </object>
  );
};

export default EmbeddedContent; 

import React, { useEffect, useRef, useState } from 'react';

interface YandexMapProps {
  className?: string;
}

declare global {
  interface Window {
    ymaps: any;
  }
}

const YandexMap: React.FC<YandexMapProps> = ({ className }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const apiKey = 'fea68787-dfe1-486c-8af0-0d931902537d';
  const scriptId = 'yandex-maps-script';

  useEffect(() => {
    // Check if script already exists
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    const initMap = () => {
      console.log('Initializing Yandex Map');
      if (!mapRef.current) {
        console.error('Map container not found');
        return;
      }

      if (!window.ymaps) {
        console.error('Yandex Maps API not loaded');
        setMapError('Ошибка загрузки API карт / Map API loading error');
        return;
      }

      try {
        window.ymaps.ready(() => {
          console.log('Yandex Maps API ready, creating map');
          try {
            const map = new window.ymaps.Map(mapRef.current, {
              center: [59.95, 30.3], // Saint Petersburg coordinates
              zoom: 12,
              controls: ['zoomControl', 'fullscreenControl']
            });
            
            // Add a placemark at the city center
            const placemark = new window.ymaps.Placemark([59.95, 30.3], {
              hintContent: 'Санкт-Петербург',
              balloonContent: 'Центр маршрута'
            }, {
              iconColor: '#FFCC00' // Yellow icon to match the app theme
            });
            
            map.geoObjects.add(placemark);
            console.log('Map created successfully');
          } catch (error) {
            console.error('Error creating map:', error);
            setMapError('Ошибка инициализации карты / Map initialization error');
          }
        });
      } catch (error) {
        console.error('Error in Yandex Maps ready callback:', error);
        setMapError('Ошибка инициализации карты / Map initialization error');
      }
    };

    const loadScript = () => {
      if (!script) {
        console.log('Creating Yandex Maps script tag');
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
        script.async = true;
        script.onerror = () => {
          console.error('Failed to load Yandex Maps script');
          setMapError('Ошибка загрузки API карт / Map API loading error');
        };
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        // Script already exists, just initialize map
        console.log('Yandex Maps script already exists');
        if (window.ymaps) {
          initMap();
        } else {
          script.onload = initMap;
        }
      }
    };

    loadScript();

    // Clean up function
    return () => {
      // We don't remove the script as it might be used by other components
      // Instead, we just clean up our event listeners
      if (script) {
        script.onload = null;
        script.onerror = null;
      }
    };
  }, [apiKey]);

  return (
    <div className={`relative w-full h-[400px] ${className || ''}`}>
      {mapError ? (
        <div className="flex items-center justify-center h-full w-full bg-todoDarkGray/80 rounded-xl">
          <p className="text-todoYellow py-2 px-4 bg-black/50 rounded-lg">{mapError}</p>
        </div>
      ) : (
        <>
          <div 
            ref={mapRef} 
            className="h-full w-full rounded-xl overflow-hidden"
            style={{ minHeight: '400px' }}
          />
          <div className="absolute bottom-3 left-3 bg-black/70 text-white py-1 px-3 text-xs rounded-full">
            Карта построения маршрута / Route planning map
          </div>
        </>
      )}
    </div>
  );
};

export default YandexMap;

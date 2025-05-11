
import React, { useEffect, useRef, useState } from 'react';

interface YandexMapProps {
  className?: string;
}

const YandexMap: React.FC<YandexMapProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef<boolean>(false);
  
  // Hardcoded API key to avoid environment variable issues
  // Жестко закодированный ключ API для избежания проблем с переменными окружения
  const apiKey = 'fea68787-dfe1-486c-8af0-0d931902537d';

  useEffect(() => {
    // Avoid multiple script loads
    // Избегаем множественной загрузки скриптов
    if (scriptLoadedRef.current) return;
    
    const loadYandexMaps = () => {
      try {
        // Create script element
        // Создаем элемент script
        const script = document.createElement('script');
        script.src = `https://api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=ru_RU`;
        script.id = 'yandex-maps-script';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          console.log('Yandex Maps script loaded successfully');
          scriptLoadedRef.current = true;
          initMap();
        };
        
        script.onerror = (error) => {
          console.error('Error loading Yandex Maps script:', error);
          setMapError('Ошибка загрузки карты. Пожалуйста, проверьте подключение к интернету / Map loading error. Please check your internet connection');
          setIsLoading(false);
        };
        
        // Add script to document
        // Добавляем скрипт в документ
        document.head.appendChild(script);
      } catch (error) {
        console.error('Error in loadYandexMaps:', error);
        setMapError('Ошибка инициализации карты / Map initialization error');
        setIsLoading(false);
      }
    };
    
    const initMap = async () => {
      try {
        if (!mapRef.current || !window.ymaps3) {
          console.error('Map container or ymaps3 not available');
          return;
        }

        // Wait for ymaps to be ready
        // Ждем, пока ymaps будет готов
        await window.ymaps3.ready;
        console.log('ymaps3 is ready');

        const { YMap, YMapDefaultSchemeLayer } = window.ymaps3;

        // Create new map instance
        // Создаем новый экземпляр карты
        const map = new YMap(mapRef.current, {
          location: {
            // Saint Petersburg coordinates
            // Координаты Санкт-Петербурга
            center: [30.3350986, 59.9342802],
            zoom: 12
          }
        });

        map.addChild(new YMapDefaultSchemeLayer());
        setIsLoading(false);
        
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Ошибка инициализации карты / Map initialization error');
        setIsLoading(false);
      }
    };

    loadYandexMaps();
    
    // Cleanup function
    // Функция очистки
    return () => {
      const script = document.getElementById('yandex-maps-script');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []); // Empty dependency array to run only once

  return (
    <div className={`relative w-full h-[400px] ${className || ''}`}>
      {isLoading && (
        <div className="flex items-center justify-center h-full w-full bg-todoDarkGray/80 rounded-xl">
          <p className="text-todoYellow py-2 px-4 bg-black/50 rounded-lg">
            Загрузка карты... / Loading map...
          </p>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="rounded-xl w-full h-full"
        style={{ display: isLoading ? 'none' : 'block' }}
      />
      {!isLoading && !mapError && (
        <div className="absolute bottom-3 left-3 bg-black/70 text-white py-1 px-3 text-xs rounded-full">
          Карта построения маршрута / Route planning map
        </div>
      )}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-todoDarkGray/80 rounded-xl">
          <p className="text-todoYellow py-2 px-4 bg-black/50 rounded-lg text-center">
            {mapError}
          </p>
        </div>
      )}
    </div>
  );
};

export default YandexMap;

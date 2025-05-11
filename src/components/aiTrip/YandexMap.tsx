import React, { useEffect, useRef, useState } from 'react';

interface YandexMapProps {
  className?: string;
}

declare global {
  interface Window {
    ymaps3: any;
  }
}

const YandexMap: React.FC<YandexMapProps> = ({ className }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get API key from environment variables
  // Получаем API ключ из переменных окружения
  const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;
  
  // Validate API key
  // Проверяем наличие API ключа
  useEffect(() => {
    if (!apiKey) {
      console.error(
        'Yandex Maps API key is missing. Please add NEXT_PUBLIC_YANDEX_MAPS_API_KEY to your .env.local file / ' +
        'Отсутствует API ключ Яндекс Карт. Добавьте NEXT_PUBLIC_YANDEX_MAPS_API_KEY в файл .env.local'
      );
      setMapError(
        'Ошибка конфигурации: отсутствует API ключ / ' +
        'Configuration error: API key is missing'
      );
      setIsLoading(false);
      return;
    }
  }, [apiKey]);

  const scriptId = 'yandex-maps-script-v3';

  useEffect(() => {
    // Don't proceed if API key is missing
    // Не продолжаем, если отсутствует API ключ
    if (!apiKey) return;

    let script = document.getElementById(scriptId) as HTMLScriptElement;
    let retryCount = 0;
    const maxRetries = 3;
    
    const initMap = async () => {
      if (!mapRef.current) {
        console.error('Map container not found / Контейнер карты не найден');
        setMapError('Ошибка инициализации: контейнер карты не найден / Initialization error: map container not found');
        setIsLoading(false);
        return;
      }

      if (!window.ymaps3 || !window.ymaps3.ready) {
        console.error('Yandex Maps API v3 not fully loaded / API Яндекс Карт v3 не полностью загружен');
        setMapError('Ошибка загрузки API карт / Map API loading error');
        setIsLoading(false);
        return;
      }

      try {
        await window.ymaps3.ready;
        
        const { YMap, YMapDefaultSchemeLayer } = window.ymaps3;
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.destroy();
          mapInstanceRef.current = null;
        }
        
        const map = new YMap(
          mapRef.current,
          {
            location: {
              center: [30.3, 59.95],
              zoom: 12
            }
          }
        );
        
        map.addChild(new YMapDefaultSchemeLayer());
        mapInstanceRef.current = map;
        setIsLoading(false);
      } catch (error) {
        console.error('Error creating map / Ошибка создания карты:', error);
        setMapError(`Ошибка инициализации карты: ${error instanceof Error ? error.message : 'Unknown error'} / Map initialization error`);
        setIsLoading(false);
      }
    };

    const loadScript = () => {
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=ru_RU`;
        script.async = true;
        
        script.onerror = (error) => {
          console.error('Failed to load Yandex Maps v3 script / Не удалось загрузить скрипт Яндекс Карт v3:', error);
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying script load (attempt ${retryCount}) / Повторная попытка загрузки скрипта (попытка ${retryCount})`);
            setTimeout(loadScript, 1000 * retryCount);
          } else {
            setMapError('Ошибка загрузки API карт после нескольких попыток / Map API loading error after multiple attempts');
            setIsLoading(false);
          }
        };
        
        script.onload = () => {
          initMap();
        };
        
        document.head.appendChild(script);
      } else {
        if (window.ymaps3) {
          initMap();
        } else {
          script.onload = initMap;
        }
      }
    };

    loadScript();

    return () => {
      if (mapInstanceRef.current && typeof mapInstanceRef.current.destroy === 'function') {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
      if (script) {
        script.onload = null;
        script.onerror = null;
      }
    };
  }, [apiKey]);

  return (
    <div className={`relative w-full h-[400px] ${className || ''}`}>
      {isLoading && (
        <div className="flex items-center justify-center h-full w-full bg-todoDarkGray/80 rounded-xl">
          <p className="text-todoYellow py-2 px-4 bg-black/50 rounded-lg">
            Загрузка карты... / Loading map...
          </p>
        </div>
      )}
      {mapError && !isLoading && (
        <div className="flex items-center justify-center h-full w-full bg-todoDarkGray/80 rounded-xl">
          <p className="text-todoYellow py-2 px-4 bg-black/50 rounded-lg">{mapError}</p>
        </div>
      )}
      {!mapError && !isLoading && (
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

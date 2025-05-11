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
  const [useStaticMap, setUseStaticMap] = useState(false);
  
  // TEMPORARY: Hardcoded API key for development
  // ВРЕМЕННО: Жестко закодированный API ключ для разработки
  const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || 'fea68787-dfe1-486c-8af0-0d931902537d';

  // Static map URL for fallback
  // URL статической карты для запасного варианта
  const staticMapUrl = `https://static-maps.yandex.ru/v1?apikey=${apiKey}&ll=30.3,59.95&z=12&l=map&size=600,400`;

  useEffect(() => {
    let isMounted = true;
    let scriptLoadAttempts = 0;
    const maxAttempts = 2;

    const loadScript = () => {
      if (!isMounted) return;

      // Check if script already exists
      // Проверяем, существует ли скрипт уже
      const existingScript = document.getElementById('yandex-maps-script');
      if (existingScript) {
        if (window.ymaps3) {
          initializeMap();
        }
        return;
      }

      // Create new script
      // Создаем новый скрипт
      const script = document.createElement('script');
      script.id = 'yandex-maps-script';
      script.type = 'text/javascript';

      // Basic attributes
      // Базовые атрибуты
      script.async = true;

      // Error handling
      // Обработка ошибок
      script.onerror = () => {
        console.error(`Script load attempt ${scriptLoadAttempts + 1} failed / Попытка загрузки скрипта ${scriptLoadAttempts + 1} не удалась`);
        
        if (scriptLoadAttempts < maxAttempts) {
          scriptLoadAttempts++;
          // Try loading from a different CDN
          // Пробуем загрузить с другого CDN
          script.src = `https://enterprise.api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=ru_RU`;
          document.head.appendChild(script);
        } else {
          console.log('Falling back to static map / Переход на статическую карту');
          setUseStaticMap(true);
          setIsLoading(false);
        }
      };

      // Success handling
      // Обработка успешной загрузки
      script.onload = () => {
        if (!isMounted) return;
        
        // Wait for ymaps3 to be available
        // Ждем доступности ymaps3
        const checkYmaps = setInterval(() => {
          if (window.ymaps3) {
            clearInterval(checkYmaps);
            initializeMap();
          }
        }, 100);

        // Timeout after 5 seconds
        // Таймаут после 5 секунд
        setTimeout(() => {
          clearInterval(checkYmaps);
          if (isMounted) {
            console.log('Ymaps3 initialization timeout, falling back to static map / Таймаут инициализации ymaps3, переход на статическую карту');
            setUseStaticMap(true);
            setIsLoading(false);
          }
        }, 5000);
      };

      // Set source and append
      // Устанавливаем источник и добавляем
      script.src = `https://api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=ru_RU`;
      document.head.appendChild(script);
    };

    const initializeMap = async () => {
      if (!isMounted || !mapRef.current) return;

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
        
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Map initialization error / Ошибка инициализации карты:', error);
        if (isMounted) {
          setUseStaticMap(true);
          setIsLoading(false);
        }
      }
    };

    loadScript();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
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
      {!isLoading && (
        <>
          {useStaticMap ? (
            <div className="h-full w-full rounded-xl overflow-hidden">
              <img 
                src={staticMapUrl}
                alt="Static map / Статическая карта"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/70 text-white py-1 px-3 text-xs rounded-full">
                Статическая карта / Static map
              </div>
            </div>
          ) : (
            <>
              <div 
                ref={mapRef} 
                className="h-full w-full rounded-xl overflow-hidden"
                style={{ minHeight: '400px' }}
                data-testid="map-container"
              />
              <div className="absolute bottom-3 left-3 bg-black/70 text-white py-1 px-3 text-xs rounded-full">
                Карта построения маршрута / Route planning map
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default YandexMap;

import React, { useEffect, useRef, useState } from 'react';

interface YandexMapProps {
  className?: string;
}

declare global {
  interface Window {
    ymaps3: any;
    loadYandexMap: () => Promise<void>;
  }
}

const YandexMap: React.FC<YandexMapProps> = ({ className }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContainerMounted, setIsContainerMounted] = useState(false);
  
  // TEMPORARY: Hardcoded API key for development
  // ВРЕМЕННО: Жестко закодированный API ключ для разработки
  const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || 'fea68787-dfe1-486c-8af0-0d931902537d';

  // Handle container mount
  // Обработка монтирования контейнера
  useEffect(() => {
    if (mapRef.current) {
      console.log('Map container mounted / Контейнер карты смонтирован');
      setIsContainerMounted(true);
    }
  }, []);

  // Initialize Yandex Maps loader
  // Инициализация загрузчика Яндекс Карт
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Define the loader function if it doesn't exist
    // Определяем функцию загрузчика, если она не существует
    if (!window.loadYandexMap) {
      window.loadYandexMap = async () => {
        return new Promise((resolve, reject) => {
          if (window.ymaps3) {
            resolve();
            return;
          }

          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = `https://api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=ru_RU`;
          script.async = true;

          script.onload = () => {
            // Wait for ymaps3 to be fully initialized
            // Ждем полной инициализации ymaps3
            const checkYmaps = setInterval(() => {
              if (window.ymaps3 && window.ymaps3.ready) {
                clearInterval(checkYmaps);
                resolve();
              }
            }, 100);

            // Timeout after 10 seconds
            // Таймаут после 10 секунд
            setTimeout(() => {
              clearInterval(checkYmaps);
              reject(new Error('Yandex Maps initialization timeout'));
            }, 10000);
          };

          script.onerror = (error) => {
            reject(error);
          };

          document.head.appendChild(script);
        });
      };
    }
  }, [apiKey]);

  // Load and initialize the map
  // Загрузка и инициализация карты
  useEffect(() => {
    // Only proceed if container is mounted
    // Продолжаем только если контейнер смонтирован
    if (!isContainerMounted) {
      console.log('Waiting for container to mount / Ожидание монтирования контейнера');
      return;
    }

    const initMap = async () => {
      try {
        console.log('Starting map initialization / Начало инициализации карты');
        
        // Double check container
        // Двойная проверка контейнера
        if (!mapRef.current) {
          console.error('Map container not found after mount / Контейнер карты не найден после монтирования');
          throw new Error('Map container not found after mount / Контейнер карты не найден после монтирования');
        }

        // Load Yandex Maps
        // Загружаем Яндекс Карты
        await window.loadYandexMap();
        console.log('Yandex Maps loaded / Яндекс Карты загружены');

        const { YMap, YMapDefaultSchemeLayer } = window.ymaps3;

        // Clean up existing map instance if it exists
        // Очищаем существующий экземпляр карты, если он существует
        if (mapInstanceRef.current) {
          mapInstanceRef.current.destroy();
          mapInstanceRef.current = null;
        }

        // Create new map instance
        // Создаем новый экземпляр карты
        const map = new YMap(
          mapRef.current,
          {
            location: {
              center: [30.3, 59.95],
              zoom: 12
            }
          }
        );

        // Add default layer
        // Добавляем слой по умолчанию
        map.addChild(new YMapDefaultSchemeLayer());
        
        mapInstanceRef.current = map;
        console.log('Map initialized successfully / Карта успешно инициализирована');
        setIsLoading(false);
      } catch (error) {
        console.error('Map initialization error / Ошибка инициализации карты:', error);
        setMapError(
          `Ошибка инициализации карты: ${error instanceof Error ? error.message : 'Неизвестная ошибка'} / ` +
          `Map initialization error: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
        setIsLoading(false);
      }
    };

    initMap();

    // Cleanup function
    // Функция очистки
    return () => {
      if (mapInstanceRef.current && typeof mapInstanceRef.current.destroy === 'function') {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [isContainerMounted]); // Only re-run when container mount state changes

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
          <p className="text-todoYellow py-2 px-4 bg-black/50 rounded-lg text-center">
            {mapError}
          </p>
        </div>
      )}
      {!mapError && !isLoading && (
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
    </div>
  );
};

export default YandexMap;

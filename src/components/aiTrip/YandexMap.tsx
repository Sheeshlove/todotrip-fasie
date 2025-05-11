import React, { useEffect, useState } from 'react';
import { YMaps, Map, ZoomControl, FullscreenControl } from '@pbe/react-yandex-maps';

interface YandexMapProps {
  className?: string;
}

const YandexMap: React.FC<YandexMapProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Get API key from environment
  // Получаем API ключ из окружения
  const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

  // Check if API key is available
  // Проверяем наличие API ключа
  useEffect(() => {
    if (!apiKey) {
      setMapError(
        'API ключ Яндекс Карт не найден. Пожалуйста, добавьте NEXT_PUBLIC_YANDEX_MAPS_API_KEY в .env.local / ' +
        'Yandex Maps API key not found. Please add NEXT_PUBLIC_YANDEX_MAPS_API_KEY to .env.local'
      );
      setIsLoading(false);
    }
  }, [apiKey]);

  if (!apiKey) {
    return (
      <div className={`relative w-full h-[400px] ${className || ''}`}>
        <div className="flex items-center justify-center h-full w-full bg-todoDarkGray/80 rounded-xl">
          <p className="text-todoYellow py-2 px-4 bg-black/50 rounded-lg text-center">
            {mapError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-[400px] ${className || ''}`}>
      {isLoading && (
        <div className="flex items-center justify-center h-full w-full bg-todoDarkGray/80 rounded-xl">
          <p className="text-todoYellow py-2 px-4 bg-black/50 rounded-lg">
            Загрузка карты... / Loading map...
          </p>
        </div>
      )}
      <YMaps
        query={{
          apikey: apiKey,
          lang: 'ru_RU',
        }}
      >
        <Map
          defaultState={{
            center: [59.95, 30.3],
            zoom: 12,
          }}
          width="100%"
          height="100%"
          className="rounded-xl"
          onLoad={() => setIsLoading(false)}
          onError={(error: Error) => {
            console.error('Map error / Ошибка карты:', error);
            setMapError(
              'Ошибка загрузки карты. Пожалуйста, проверьте подключение к интернету / ' +
              'Map loading error. Please check your internet connection'
            );
            setIsLoading(false);
          }}
        >
          <ZoomControl options={{ position: { right: 10, top: 10 } }} />
          <FullscreenControl options={{ position: { right: 10, top: 50 } }} />
        </Map>
      </YMaps>
      {!isLoading && !mapError && (
        <div className="absolute bottom-3 left-3 bg-black/70 text-white py-1 px-3 text-xs rounded-full">
          Карта построения маршрута / Route planning map
        </div>
      )}
      {mapError && !isLoading && (
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

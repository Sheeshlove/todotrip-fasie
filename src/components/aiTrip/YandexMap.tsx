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
  const apiKey = 'fea68787-dfe1-486c-8af0-0d931902537d';
  const scriptId = 'yandex-maps-script-v3';

  useEffect(() => {
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    const initMap = async () => {
      if (!mapRef.current) {
        console.error('Map container not found');
        return;
      }

      if (!window.ymaps3) {
        console.error('Yandex Maps API v3 not loaded');
        setMapError('Ошибка загрузки API карт / Map API loading error');
        return;
      }

      try {
        await window.ymaps3.ready;
        
        const { YMap, YMapDefaultSchemeLayer } = window.ymaps3;
        
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
      } catch (error) {
        console.error('Error creating map:', error);
        setMapError('Ошибка инициализации карты / Map initialization error');
      }
    };

    const loadScript = () => {
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=ru_RU`;
        script.async = true;
        script.onerror = () => {
          console.error('Failed to load Yandex Maps v3 script');
          setMapError('Ошибка загрузки API карт / Map API loading error');
        };
        script.onload = initMap;
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

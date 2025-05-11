import React, { useEffect, useRef } from 'react';
interface YandexMapProps {
  className?: string;
}
declare global {
  interface Window {
    ymaps: any;
  }
}
const YandexMap: React.FC<YandexMapProps> = ({
  className
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const apiKey = 'fea68787-dfe1-486c-8af0-0d931902537d';
  useEffect(() => {
    // Load Yandex Maps script
    const script = document.createElement('script');
    script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${apiKey}`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);
    return () => {
      // Cleanup script when component unmounts
      document.head.removeChild(script);
    };
  }, []);
  const initMap = () => {
    if (!mapRef.current) return;

    // Initialize map when API is loaded
    window.ymaps.ready(() => {
      const map = new window.ymaps.Map(mapRef.current, {
        center: [59.95, 30.3],
        // Saint Petersburg coordinates
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

      // Add a copyright notice
      const copyrightNotice = new window.ymaps.control.FullscreenControl({
        data: {
          content: 'ToDoTrip AI маршрут'
        }
      });
      map.controls.add(copyrightNotice);
    });
  };
  return <div className={`relative w-full ${className || ''}`}>
      <div ref={mapRef} className="h-[400px] rounded-xl overflow-hidden" />
      
    </div>;
};
export default YandexMap;
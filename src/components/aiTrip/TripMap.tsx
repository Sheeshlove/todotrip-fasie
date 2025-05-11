
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface TripMapProps {
  className?: string;
}

const TripMap: React.FC<TripMapProps> = ({ className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with the provided API key
    mapboxgl.accessToken = 'fea68787-dfe1-486c-8af0-0d931902537d';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Using dark style to match our app theme
      center: [30.3, 59.95], // Setting default center to Saint Petersburg
      zoom: 11,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Initial marker for Saint Petersburg center
    new mapboxgl.Marker({ color: '#FFCC00' }) // Yellow marker
      .setLngLat([30.3, 59.95])
      .addTo(map.current);

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className={`relative w-full ${className || ''}`}>
      <div ref={mapContainer} className="h-[400px] rounded-xl overflow-hidden" />
      <div className="absolute bottom-3 left-3 bg-black/70 text-white py-1 px-3 text-xs rounded-full">
        Карта построения маршрута / Route planning map
      </div>
    </div>
  );
};

export default TripMap;

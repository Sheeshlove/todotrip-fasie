
import { useState, useEffect } from 'react';
import { russianCities } from '@/data/cities';

export type GeolocationStatus = 'idle' | 'loading' | 'success' | 'error';

export const useGeolocation = () => {
  const [status, setStatus] = useState<GeolocationStatus>('idle');
  const [city, setCity] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detectCity = () => {
    if (!navigator.geolocation) {
      setError('Геолокация не поддерживается вашим браузером');
      setStatus('error');
      return;
    }

    setStatus('loading');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use OpenStreetMap Nominatim for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            { headers: { 'Accept-Language': 'ru' } }
          );
          
          if (!response.ok) {
            throw new Error('Не удалось определить город');
          }
          
          const data = await response.json();
          let detectedCity = data.address.city || 
                           data.address.town || 
                           data.address.village || 
                           data.address.county || 
                           null;
                           
          // If city is found, try to match it with our list of Russian cities
          if (detectedCity) {
            // Try to find the city in our list
            const matchedCity = russianCities.find(city => 
              city.toLowerCase().includes(detectedCity.toLowerCase()) ||
              detectedCity.toLowerCase().includes(city.toLowerCase())
            );
            
            if (matchedCity) {
              detectedCity = matchedCity;
            }
          }
          
          setCity(detectedCity);
          setStatus('success');
        } catch (err) {
          console.error('Error getting location:', err);
          setError('Ошибка при определении местоположения');
          setStatus('error');
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError(
          err.code === 1 
            ? 'Доступ к геолокации запрещен' 
            : 'Ошибка при определении местоположения'
        );
        setStatus('error');
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0 
      }
    );
  };

  return { city, status, error, detectCity };
};

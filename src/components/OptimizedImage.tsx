import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  placeholderColor?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderColor = '#F3F4F6', // Light gray default
  objectFit = 'cover',
  priority = false,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(priority ? src : null);

  // Handle intersection observer for lazy loading
  useEffect(() => {
    if (priority || imageSrc) return;

    let observer: IntersectionObserver;
    let imgElement: HTMLImageElement | null = null;

    const onIntersection: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          if (imgElement && observer) {
            observer.unobserve(imgElement);
          }
        }
      });
    };

    const observerOptions = {
      rootMargin: '200px', // Load when within 200px of viewport
      threshold: 0.01
    };

    observer = new IntersectionObserver(onIntersection, observerOptions);
    imgElement = document.getElementById(`image-${src.split('/').pop()}`) as HTMLImageElement;
    
    if (imgElement) {
      observer.observe(imgElement);
    }

    return () => {
      if (imgElement && observer) {
        observer.unobserve(imgElement);
      }
      observer.disconnect();
    };
  }, [src, priority, imageSrc]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setIsError(true);
    onError?.();
  };

  // Build style objects
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: width || '100%',
    height: height || '100%',
    backgroundColor: placeholderColor,
  };

  const imageStyle: React.CSSProperties = {
    objectFit,
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    width: '100%',
    height: '100%'
  };

  return (
    <div style={containerStyle} className={className} id={`image-${src.split('/').pop()}`}>
      {imageSrc && !isError && (
        <img
          src={imageSrc}
          alt={alt}
          style={imageStyle}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
      
      {isError && (
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#EEE',
            color: '#888'
          }}
        >
          {alt || 'Image not available'}
        </div>
      )}
    </div>
  );
};

export default OptimizedImage; 
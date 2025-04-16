
import { useState, useRef, useEffect, TouchEvent, MouseEvent } from 'react';
import { onboardingBackgrounds, preloadImages } from '@/data/placeholderImages';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchMoveX, setTouchMoveX] = useState<number | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  const swiperWrapperRef = useRef<HTMLDivElement>(null);
  
  // Preload images on component mount
  useEffect(() => {
    preloadImages();
    setImagesLoaded(true);
  }, []);
  
  // Background images for the screens
  const bgImages = onboardingBackgrounds;
  
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
    setIsDragging(true);
  };
  
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging || touchStartX === null) return;
    
    const moveX = e.touches[0].clientX;
    setTouchMoveX(moveX);
    
    const diff = moveX - touchStartX;
    
    // Add resistance at the edges
    if ((currentIndex === 0 && diff > 0) || (currentIndex === 2 && diff < 0)) {
      if (swiperWrapperRef.current) {
        swiperWrapperRef.current.style.transform = `translateX(calc(-${currentIndex * 100}% + ${diff / 3}px))`;
      }
    } else {
      if (swiperWrapperRef.current) {
        swiperWrapperRef.current.style.transform = `translateX(calc(-${currentIndex * 100}% + ${diff}px))`;
      }
    }
  };
  
  const handleTouchEnd = () => {
    if (!isDragging || touchStartX === null || touchMoveX === null) {
      setIsDragging(false);
      return;
    }
    
    const diff = touchMoveX - touchStartX;
    const threshold = window.innerWidth * 0.2; // 20% of screen width
    
    if (diff < -threshold && currentIndex < 2) {
      // Swipe left
      goToSlide(currentIndex + 1);
    } else if (diff > threshold && currentIndex > 0) {
      // Swipe right
      goToSlide(currentIndex - 1);
    } else {
      // Return to current slide
      goToSlide(currentIndex);
    }
    
    setIsDragging(false);
    setTouchMoveX(null);
  };
  
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setTouchStartX(e.clientX);
    setIsDragging(true);
    e.preventDefault(); // Prevent text selection during drag
  };
  
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || touchStartX === null) return;
    
    const moveX = e.clientX;
    setTouchMoveX(moveX);
    
    const diff = moveX - touchStartX;
    
    // Add resistance at the edges
    if ((currentIndex === 0 && diff > 0) || (currentIndex === 2 && diff < 0)) {
      if (swiperWrapperRef.current) {
        swiperWrapperRef.current.style.transform = `translateX(calc(-${currentIndex * 100}% + ${diff / 3}px))`;
      }
    } else {
      if (swiperWrapperRef.current) {
        swiperWrapperRef.current.style.transform = `translateX(calc(-${currentIndex * 100}% + ${diff}px))`;
      }
    }
  };
  
  const handleMouseUp = () => {
    handleTouchEnd();
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (swiperWrapperRef.current) {
      swiperWrapperRef.current.style.transform = `translateX(-${index * 100}%)`;
    }
  };
  
  const handleNextClick = () => {
    if (currentIndex < 2) {
      goToSlide(currentIndex + 1);
    }
  };
  
  const handleRegisterClick = () => {
    onComplete();
  };
  
  return (
    <div className="swiper-container w-full h-screen relative overflow-hidden">
      <div 
        ref={swiperWrapperRef}
        className="swiper-wrapper flex h-full transition-transform duration-500 ease-in-out will-change-transform"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* First Screen */}
        <section 
          className="screen" 
          style={{ backgroundImage: `url(${bgImages[0]})` }}
          aria-label="Welcome screen"
        >
          <div className="screen-content">
            <div className="logo" aria-label="ToDoTrip logo">ToDoTrip</div>
            <h1 className="text-4xl md:text-5xl font-black mb-5">Привет, это ToDoTrip</h1>
          </div>
        </section>
        
        {/* Second Screen */}
        <section 
          className="screen" 
          style={{ backgroundImage: `url(${bgImages[1]})` }}
          aria-label="About screen"
        >
          <div className="screen-content">
            <p className="text-2xl md:text-3xl font-normal mb-7 leading-normal">
              Мы создаём туристические маршруты для путешествий по России
            </p>
          </div>
        </section>
        
        {/* Third Screen */}
        <section 
          className="screen" 
          style={{ backgroundImage: `url(${bgImages[2]})` }}
          aria-label="Features screen"
        >
          <div className="screen-content">
            <p className="text-2xl md:text-3xl font-normal mb-7 leading-normal">
              ...а также помогаем искать попутчиков по интересам
            </p>
          </div>
          <button 
            className="swiper-button absolute"
            onClick={handleRegisterClick}
            aria-label="Регистрация"
          >
            Регистрация!
          </button>
        </section>
      </div>

      {/* Next Button (not shown on last slide) */}
      {currentIndex < 2 && (
        <button 
          className="swiper-button"
          onClick={handleNextClick} 
          aria-label="Перейти к следующему экрану"
        >
          дальше
        </button>
      )}

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-0 w-full flex justify-center z-10" role="tablist">
        {[0, 1, 2].map((index) => (
          <span 
            key={index}
            className={`pagination-dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            role="tab"
            aria-selected={currentIndex === index}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default OnboardingScreen;

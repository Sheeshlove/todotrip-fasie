
import { useState, useEffect, useRef } from 'react';
import { SendIcon, Loader2 } from 'lucide-react';
import { generateTrip, TripSuggestion } from '@/data/tripData';

const suggestedDestinations = [
  "Озеро духов, Алтай",
  "Долина гейзеров, Камчатка",
  "Плато Путорана",
  "Ленские столбы, Якутия",
  "Куршская коса",
  "Эльбрус, ночёвка в бочках",
  "Остров Ольхон, Байкал",
  "Кунгурская ледяная пещера",
  "Соловецкие острова",
  "Долина Лотосов, Астрахань"
];

const placeholderTexts = [
  "Собери маршрут как будто ты главный герой комедийного роад-муви 2000-х",
  "Россия глазами инопланетянина, прилетевшего за борщом",
  "По следам великих мемов",
  "Путешествие по городам с самыми смешными названиями",
  "Маршрут типа ты персонаж в славянском фэнтези",
  "Где-то между \"хочу в отпуск\" и \"куда ж я попал\"",
  "Тур для интроверта: маршрут с минимальным контактом с людьми"
];

const TripPlanner: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholderTexts[0]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrip, setGeneratedTrip] = useState<TripSuggestion | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Cycle through placeholder texts
  useEffect(() => {
    const interval = setInterval(() => {
      updatePlaceholder();
    }, 15000);
    
    return () => clearInterval(interval);
  }, [placeholderIndex]);
  
  const updatePlaceholder = () => {
    const nextIndex = (placeholderIndex + 1) % placeholderTexts.length;
    setPlaceholderIndex(nextIndex);
    setCurrentPlaceholder(placeholderTexts[nextIndex]);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      handleSendClick();
    }
  };
  
  const handleSendClick = () => {
    if (inputValue.trim() === '' || isGenerating) return;
    
    setIsGenerating(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const trip = generateTrip(inputValue);
      setGeneratedTrip(trip);
      setIsGenerating(false);
      setInputValue('');
    }, 1500);
  };
  
  return (
    <div className="font-unbounded">
      {/* Header */}
      <div className="px-5 py-5 flex justify-between items-center border-b border-gray-800">
        <div className="w-10"></div>
        <div className="text-todoYellow text-2xl md:text-3xl font-black">ToDoTrip</div>
        <div className="w-10"></div>
      </div>
      
      {/* Main Content */}
      <div className="h-[calc(100vh-160px)] flex flex-col justify-center items-center p-5 text-center">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-todoYellow" />
            <p className="text-lg md:text-xl">Создаем ваш идеальный маршрут...</p>
          </div>
        ) : generatedTrip ? (
          <div className="max-w-md w-full mx-auto p-6 bg-todoDarkGray rounded-lg shadow-lg animate-fade-in">
            <h2 className="text-xl md:text-2xl font-bold text-todoYellow mb-4">{generatedTrip.title}</h2>
            <p className="text-base md:text-lg mb-6">{generatedTrip.description}</p>
            <button 
              onClick={() => setGeneratedTrip(null)}
              className="bg-todoYellow text-black font-bold py-2 px-6 rounded-full transition-all hover:shadow-lg"
            >
              Создать новый маршрут
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl md:text-2xl mb-8">Куда вы хотели бы отправиться?</h2>
            
            {/* Scrollable Suggestions */}
            <div className="horizontal-scroll overflow-x-auto w-full">
              <div className="inline-flex gap-2.5 px-5">
                {suggestedDestinations.map((destination, index) => (
                  <div 
                    key={index}
                    className="suggestion-pill bg-todoDarkGray px-4 py-2 rounded-full cursor-pointer transition-colors hover:bg-gray-700 whitespace-nowrap"
                    onClick={() => handleSuggestionClick(destination)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSuggestionClick(destination);
                      }
                    }}
                    role="button"
                  >
                    {destination}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Footer with Input */}
      <div className="fixed bottom-16 left-0 w-full p-5 border-t border-gray-800 bg-todoBlack">
        <div className="bg-todoDarkGray rounded-[20px] py-2.5 px-5 flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentPlaceholder}
            className="bg-transparent border-none w-full text-white font-unbounded text-base outline-none placeholder:animate-fadeInOut"
            aria-label="Введите место назначения"
            disabled={isGenerating}
          />
          <button
            onClick={handleSendClick}
            className={`${isGenerating ? 'bg-gray-500 cursor-not-allowed' : 'bg-todoYellow cursor-pointer'} text-black rounded-full w-10 h-10 flex justify-center items-center ml-2.5`}
            aria-label="Отправить"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <SendIcon size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;

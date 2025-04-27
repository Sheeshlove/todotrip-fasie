import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Button, ButtonVariant } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import { PartnersFilters } from '@/components/PartnersFilters';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
}

interface FilterState {
  priceRange: [number, number];
  sortBy: string | null;
  allInclusive: boolean;
  hotOffers: boolean;
  aiRecommended: boolean;
}

interface PartnersFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

const Partners = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 99999999],
    sortBy: null,
    allInclusive: false,
    hotOffers: false,
    aiRecommended: false
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // TODO: Implement filter logic with API call
    console.log('Filters changed:', newFilters);
  };

  const fetchOffers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/offers');
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }
      const data = await response.json();
      setOffers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [filters]); // Refetch when filters change

  const handleOfferClick = (offerId: string) => {
    navigate(`/partners/${offerId}`);
  };

  const content = (
    <div className="flex flex-col min-h-[100vh] pb-20">
      <div className="flex items-center justify-between p-4 bg-todoDarkGray sticky top-0 z-20">
        <h1 className="text-xl font-bold text-white">Партнёры</h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-transparent border-todoYellow text-todoYellow"
          onClick={toggleFilters}
        >
          <Filter size={18} />
          Фильтры
        </Button>
      </div>

      {showFilters && (
        <Card className="m-4 p-4 bg-todoDarkGray border-0">
          <PartnersFilters onFilterChange={handleFilterChange} />
        </Card>
      )}

      <div className="w-full h-[1200px]">
        <object 
          data="https://scantour.ru/testtest.html?my_module=todotrip.work@gmail.com" 
          width="100%" 
          height="1200"
        >
          <embed 
            src="https://scantour.ru/testtest.html?my_module=321" 
            width="100%" 
            height="1200"
          />
          Error: Embedded data could not be displayed.
        </object>
      </div>

      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Loader2 className="w-8 h-8 text-todoYellow animate-spin mb-4" />
            <p className="text-todoMediumGray">Загрузка предложений...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-xl font-bold mb-4 text-red-500">Ошибка загрузки</h2>
            <p className="text-todoMediumGray">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4 border-todoYellow text-todoYellow"
              onClick={fetchOffers}
            >
              Попробовать снова
            </Button>
          </div>
        ) : offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-xl font-bold mb-4">Пока что тут ничего нет, но не волнуйтесь, скоро всё будет!</h2>
            <p className="text-todoMediumGray">Мы активно работаем над добавлением новых предложений от партнёров</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((offer) => (
              <Card 
                key={offer.id} 
                className="p-4 bg-todoDarkGray border-0 cursor-pointer hover:bg-todoBlack/20 transition-colors"
                onClick={() => handleOfferClick(offer.id)}
              >
                {offer.image && (
                  <img 
                    src={offer.image} 
                    alt={offer.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold text-white mb-2">{offer.title}</h3>
                <p className="text-todoMediumGray mb-4">{offer.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-todoYellow font-bold">{offer.price} ₽</span>
                  <Button variant="outline" className="border-todoYellow text-todoYellow">
                    Подробнее
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );

  return (
    <PageLayout 
      title="ТуДуТрип - Партнёры" 
      description="Маркетплейс партнёров ТуДуТрип"
    >
      {content}
    </PageLayout>
  );
};

export default Partners;

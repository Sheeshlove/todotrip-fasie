import { useState, useEffect, lazy, Suspense } from 'react';
import PageLayout from '@/components/PageLayout';
import { Button, ButtonVariant } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import { PartnersFilters } from '@/components/PartnersFilters';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOffers } from '@/hooks/useOffers';
import { Pagination } from '@/components/ui/pagination';

// Lazy load the embedded content
const EmbeddedContent = lazy(() => import('@/components/EmbeddedContent'));

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
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 99999999],
    sortBy: null,
    allInclusive: false,
    hotOffers: false,
    aiRecommended: false
  });

  const { data, isLoading, error, isFetching } = useOffers(currentPage, filters);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOfferClick = (offerId: string) => {
    navigate(`/partners/${offerId}`);
  };

  const content = (
    <div className="flex flex-col min-h-[100vh] pb-20 bg-todoBlack font-unbounded">
      <div className="flex items-center justify-between p-4 bg-todoDarkGray sticky top-0 z-20">
        <h1 className="text-xl font-bold text-white">Партнёры</h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-transparent border-todoYellow text-todoYellow hover:bg-todoBlack/20"
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

      <div className="w-full h-[1200px] bg-todoBlack">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-todoYellow animate-spin" />
          </div>
        }>
          <EmbeddedContent />
        </Suspense>
      </div>

      <ScrollArea className="flex-1 p-4 bg-todoBlack">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Loader2 className="w-8 h-8 text-todoYellow animate-spin mb-4" />
            <p className="text-todoMediumGray">Загрузка предложений...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-xl font-bold mb-4 text-red-500">Ошибка загрузки</h2>
            <p className="text-todoMediumGray">{error instanceof Error ? error.message : 'An error occurred'}</p>
          </div>
        ) : !data?.offers.length ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-xl font-bold mb-4 text-white">Пока что тут ничего нет, но не волнуйтесь, скоро всё будет!</h2>
            <p className="text-todoMediumGray">Мы активно работаем над добавлением новых предложений от партнёров</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.offers.map((offer) => (
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
                      loading="lazy"
                    />
                  )}
                  <h3 className="text-lg font-semibold text-white mb-2">{offer.title}</h3>
                  <p className="text-todoMediumGray mb-4">{offer.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-todoYellow font-bold">{offer.price} ₽</span>
                    <Button 
                      variant="outline" 
                      className="border-todoYellow text-todoYellow hover:bg-todoBlack/20"
                    >
                      Подробнее
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {data.total > data.pageSize && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(data.total / data.pageSize)}
                onPageChange={handlePageChange}
              />
            )}

            {isFetching && (
              <div className="fixed bottom-4 right-4 bg-todoDarkGray p-2 rounded-lg shadow-lg">
                <Loader2 className="w-4 h-4 text-todoYellow animate-spin" />
              </div>
            )}
          </>
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

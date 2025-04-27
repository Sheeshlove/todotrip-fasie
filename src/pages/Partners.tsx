
import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import PageLayout from '@/components/PageLayout';
import { PartnersFilters } from '@/components/PartnersFilters';
import { useOffers } from '@/hooks/useOffers';
import { SearchBar } from '@/components/partners/SearchBar';
import { DateRangeSelector } from '@/components/partners/DateRangeSelector';
import { OfferGrid } from '@/components/partners/OfferGrid';

const EmbeddedContent = lazy(() => import('@/components/EmbeddedContent'));

const Partners = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState<[Date | null, Date | null]>([null, null]);
  const [filters, setFilters] = useState({
    priceRange: [0, 350000] as [number, number],
    sortBy: null as string | null,
    allInclusive: false,
    hotOffers: false,
    aiRecommended: false,
    dateRange: date,
    searchQuery: ''
  });

  const { data, isLoading, error, isFetching } = useOffers(currentPage, filters);

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters({ ...newFilters, searchQuery, dateRange: date });
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setFilters(prev => ({ ...prev, searchQuery: event.target.value }));
  };

  const handleDateSelect = (dates: [Date | null, Date | null]) => {
    setDate(dates);
    setFilters(prev => ({ ...prev, dateRange: dates }));
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
      <div className="flex items-center justify-between gap-4 p-4 bg-todoDarkGray sticky top-0 z-20">
        <div className="flex-1 flex items-center gap-4">
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
          <DateRangeSelector date={date} onSelect={handleDateSelect} />
        </div>
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
        <Card className="fixed bottom-20 right-4 z-30 w-80 p-4 bg-todoDarkGray border-0">
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
        <OfferGrid
          offers={data?.offers || []}
          isLoading={isLoading}
          error={error instanceof Error ? error : null}
          total={data?.total || 0}
          currentPage={currentPage}
          pageSize={data?.pageSize || 12}
          onPageChange={handlePageChange}
          onOfferClick={handleOfferClick}
        />

        {isFetching && (
          <div className="fixed bottom-4 right-4 bg-todoDarkGray p-2 rounded-lg shadow-lg">
            <Loader2 className="w-4 h-4 text-todoYellow animate-spin" />
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

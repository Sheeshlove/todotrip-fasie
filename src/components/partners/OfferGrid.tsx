
import { Loader2 } from 'lucide-react';
import { OfferCard } from './OfferCard';
import { Pagination } from '@/components/ui/pagination';

interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
}

interface OfferGridProps {
  offers: Offer[];
  isLoading: boolean;
  error: Error | null;
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onOfferClick: (id: string) => void;
}

export const OfferGrid = ({ 
  offers, 
  isLoading, 
  error, 
  total, 
  currentPage, 
  pageSize, 
  onPageChange,
  onOfferClick 
}: OfferGridProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-todoYellow animate-spin mb-4" />
        <p className="text-todoMediumGray">Загрузка предложений...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-xl font-bold mb-4 text-red-500">Ошибка загрузки</h2>
        <p className="text-todoMediumGray">{error.message}</p>
      </div>
    );
  }

  if (!offers.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-xl font-bold mb-4 text-white">Пока что тут ничего нет, но не волнуйтесь, скоро всё будет!</h2>
        <p className="text-todoMediumGray">Мы активно работаем над добавлением новых предложений от партнёров</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
            {...offer}
            onClick={onOfferClick}
          />
        ))}
      </div>

      {total > pageSize && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(total / pageSize)}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

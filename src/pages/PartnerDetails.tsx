import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  details?: string;
  location?: string;
  duration?: string;
  included?: string[];
}

const PartnerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOfferDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual API call
        const response = await fetch(`/api/offers/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch offer details');
        }
        const data = await response.json();
        setOffer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOfferDetails();
    }
  }, [id]);

  const handleBack = () => {
    navigate('/partners');
  };

  const content = (
    <div className="flex flex-col min-h-[100vh] pb-20">
      <div className="flex items-center p-4 bg-todoDarkGray sticky top-0 z-20">
        <Button 
          variant="ghost" 
          className="text-todoYellow"
          onClick={handleBack}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold text-white ml-4">Детали предложения</h1>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 text-todoYellow animate-spin mb-4" />
          <p className="text-todoMediumGray">Загрузка деталей...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <h2 className="text-xl font-bold mb-4 text-red-500">Ошибка загрузки</h2>
          <p className="text-todoMediumGray">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4 border-todoYellow text-todoYellow"
            onClick={() => window.location.reload()}
          >
            Попробовать снова
          </Button>
        </div>
      ) : offer ? (
        <div className="p-4 space-y-6">
          {offer.image && (
            <img 
              src={offer.image} 
              alt={offer.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">{offer.title}</h2>
            <p className="text-todoMediumGray">{offer.description}</p>
            
            {offer.details && (
              <div className="bg-todoDarkGray p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Подробности</h3>
                <p className="text-todoMediumGray">{offer.details}</p>
              </div>
            )}
            
            {offer.location && (
              <div className="flex items-center gap-2 text-todoMediumGray">
                <span className="font-semibold">Место:</span>
                <span>{offer.location}</span>
              </div>
            )}
            
            {offer.duration && (
              <div className="flex items-center gap-2 text-todoMediumGray">
                <span className="font-semibold">Длительность:</span>
                <span>{offer.duration}</span>
              </div>
            )}
            
            {offer.included && offer.included.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Что включено:</h3>
                <ul className="list-disc list-inside text-todoMediumGray">
                  {offer.included.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-4">
              <span className="text-2xl font-bold text-todoYellow">{offer.price} ₽</span>
              <Button className="bg-todoYellow text-black hover:bg-yellow-400">
                Забронировать
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <h2 className="text-xl font-bold mb-4">Предложение не найдено</h2>
          <p className="text-todoMediumGray">К сожалению, запрашиваемое предложение не существует</p>
          <Button 
            variant="outline" 
            className="mt-4 border-todoYellow text-todoYellow"
            onClick={handleBack}
          >
            Вернуться к списку
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <PageLayout 
      title="ТуДуТрип - Детали предложения" 
      description="Подробная информация о предложении партнёра"
    >
      {content}
    </PageLayout>
  );
};

export default PartnerDetails; 
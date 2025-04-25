
import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import { PartnersFilters } from '@/components/PartnersFilters';
import { ScrollArea } from '@/components/ui/scroll-area';

const Partners = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [offers, setOffers] = useState<any[]>([]); // Would be replaced with actual data in a real app

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <PageLayout title="ТуДуТрип - Партнёры" description="Маркетплейс партнёров ТуДуТрип">
      <div className="flex flex-col min-h-[100vh] pb-20">
        <div className="flex items-center justify-between p-4 bg-todoDarkGray sticky top-0 z-20">
          <h1 className="text-xl font-bold text-white">Партнёры</h1>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-transparent border-todoYellow text-todoYellow"
            onClick={toggleFilters}
            object data="https://scantour.ru/testtest.html?my_module=todotrip.work@gmail.com" width="100%" height="1200"> <embed src="https://scantour.ru/testtest.html?my_module=321" width="100%" height="1200"> </embed> Error: Embedded data could not be displayed. </object>
          >
            <Filter size={18} />
            Фильтры
          </Button>
        </div>

        {showFilters && (
          <Card className="m-4 p-4 bg-todoDarkGray border-0">
            <PartnersFilters />
          </Card>
        )}

        <ScrollArea className="flex-1 p-4">
          {offers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <h2 className="text-xl font-bold mb-4">Пока что тут ничего нет, но не волнуйтесь, скоро всё будет!</h2>
              <p className="text-todoMediumGray">Мы активно работаем над добавлением новых предложений от партнёров</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.map((offer) => (
                <Card key={offer.id} className="p-4 bg-todoDarkGray border-0">
                  {/* Offer content would go here */}
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </PageLayout>
  );
};

export default Partners;

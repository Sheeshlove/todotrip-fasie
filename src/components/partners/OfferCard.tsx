
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface OfferCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  onClick: (id: string) => void;
}

export const OfferCard = ({ id, title, description, price, image, onClick }: OfferCardProps) => {
  return (
    <Card 
      className="p-4 bg-todoDarkGray border-0 cursor-pointer hover:bg-todoBlack/20 transition-colors"
      onClick={() => onClick(id)}
    >
      {image && (
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover rounded-lg mb-4"
          loading="lazy"
        />
      )}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-todoMediumGray mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-todoYellow font-bold">{price} ₽</span>
        <Button 
          variant="outline" 
          className="border-todoYellow text-todoYellow hover:bg-todoBlack/20"
        >
          Подробнее
        </Button>
      </div>
    </Card>
  );
};


import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { 
  ArrowDown, 
  ArrowUp, 
  Sparkles, 
  Flame, 
  Bot,
} from 'lucide-react';

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

export function PartnersFilters({ onFilterChange }: PartnersFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("100000");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [allInclusive, setAllInclusive] = useState(false);
  const [hotOffers, setHotOffers] = useState(false);
  const [aiRecommended, setAiRecommended] = useState(false);

  // Sync slider and input fields
  useEffect(() => {
    setMinPrice(priceRange[0].toString());
    setMaxPrice(priceRange[1].toString());
  }, [priceRange]);

  const handlePriceRangeChange = (values: number[]) => {
    if (values.length === 2) {
      setPriceRange([values[0], values[1]]);
    }
  };

  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMinPrice(value);
    if (value && !isNaN(Number(value))) {
      const numValue = Number(value);
      // Ensure min doesn't exceed max
      if (numValue <= priceRange[1]) {
        setPriceRange([numValue, priceRange[1]]);
      }
    }
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMaxPrice(value);
    if (value && !isNaN(Number(value))) {
      const numValue = Number(value);
      // Ensure max doesn't fall below min
      if (numValue >= priceRange[0]) {
        setPriceRange([priceRange[0], numValue]);
      }
    }
  };

  const handleReset = () => {
    setPriceRange([0, 100000]);
    setMinPrice("0");
    setMaxPrice("100000");
    setSortBy(null);
    setAllInclusive(false);
    setHotOffers(false);
    setAiRecommended(false);
  };

  const handleApplyFilters = () => {
    onFilterChange({
      priceRange,
      sortBy,
      allInclusive,
      hotOffers,
      aiRecommended
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Диапазон цен</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="min-price" className="text-sm text-todoMediumGray">От</Label>
            <Input
              id="min-price"
              type="number"
              value={minPrice}
              onChange={handleMinPriceChange}
              className="bg-todoBlack border-gray-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="max-price" className="text-sm text-todoMediumGray">До</Label>
            <Input
              id="max-price"
              type="number"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="bg-todoBlack border-gray-700 text-white"
            />
          </div>
        </div>
        <div className="py-6">
          <Slider
            value={priceRange}
            min={0}
            max={100000}
            step={1000}
            onValueChange={handlePriceRangeChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Сортировка</h3>
        <ToggleGroup type="single" value={sortBy} onValueChange={setSortBy} className="flex justify-start">
          <ToggleGroupItem value="cheapToExpensive" className="flex items-center gap-1 border border-gray-700">
            <ArrowUp size={16} />
            Дешевле
          </ToggleGroupItem>
          <ToggleGroupItem value="expensiveToCheap" className="flex items-center gap-1 border border-gray-700">
            <ArrowDown size={16} />
            Дороже
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Дополнительные фильтры</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-todoMediumGray" />
            <Label htmlFor="all-inclusive" className="cursor-pointer">
              Всё включено
            </Label>
          </div>
          <Switch
            id="all-inclusive"
            checked={allInclusive}
            onCheckedChange={setAllInclusive}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-todoMediumGray" />
            <Label htmlFor="hot-offers" className="cursor-pointer">
              Горящие предложения
            </Label>
          </div>
          <Switch
            id="hot-offers"
            checked={hotOffers}
            onCheckedChange={setHotOffers}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-todoMediumGray" />
            <Label htmlFor="ai-recommended" className="cursor-pointer">
              Рекомендации ИИ
            </Label>
          </div>
          <Switch
            id="ai-recommended"
            checked={aiRecommended}
            onCheckedChange={setAiRecommended}
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button 
          variant="outline" 
          className="flex-1 border-gray-700 text-todoMediumGray"
          onClick={handleReset}
        >
          Сбросить
        </Button>
        <Button 
          className="flex-1 bg-todoYellow text-black hover:bg-yellow-400"
          onClick={handleApplyFilters}
        >
          Применить
        </Button>
      </div>
    </div>
  );
}

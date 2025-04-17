
import { FC, useEffect, useRef } from 'react';
import { Sight } from './SightCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock, CreditCard } from 'lucide-react';

interface RouteResultProps {
  selectedSights: Sight[];
  onReset: () => void;
}

// Saint Petersburg coordinates for map centering
const SPB_CENTER = { lat: 59.9343, lng: 30.3351 };

const RouteResult: FC<RouteResultProps> = ({ selectedSights, onReset }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Calculate total visit time (assume each sight takes ~2 hours)
  const totalTimeHours = selectedSights.length * 2;
  
  // Calculate estimated cost (extract numbers from price strings and sum them)
  const totalCost = selectedSights.reduce((sum, sight) => {
    const priceMatch = sight.price.match(/\d+/);
    const price = priceMatch ? parseInt(priceMatch[0], 10) : 0;
    return sum + price;
  }, 0);

  // This function will render a simple map representation
  useEffect(() => {
    if (!mapRef.current || selectedSights.length === 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = mapRef.current.offsetWidth;
    canvas.height = mapRef.current.offsetHeight;
    mapRef.current.innerHTML = '';
    mapRef.current.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simplified map rendering with route
    renderSimpleMap(ctx, canvas.width, canvas.height, selectedSights);
  }, [selectedSights]);

  // Render a simple stylized map with the route
  const renderSimpleMap = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    sights: Sight[]
  ) => {
    // Clear canvas with dark background
    ctx.fillStyle = '#1e2130';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines for map effect
    ctx.strokeStyle = '#2a2f45';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Vertical grid lines
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // If no sights, just show empty map
    if (sights.length === 0) return;

    // Simulate positions for sights in Saint Petersburg
    // In a real app, these would come from real coordinates
    const positions = generateSimulatedPositions(sights.length, width, height);

    // Draw connections between points (the route)
    ctx.strokeStyle = '#ffbb00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(positions[0].x, positions[0].y);
    
    for (let i = 1; i < positions.length; i++) {
      ctx.lineTo(positions[i].x, positions[i].y);
    }
    
    ctx.stroke();

    // Draw points for each sight
    for (let i = 0; i < positions.length; i++) {
      const { x, y } = positions[i];
      
      // Point border
      ctx.fillStyle = i === 0 ? '#4CAF50' : i === positions.length - 1 ? '#F44336' : '#ffbb00';
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
      
      // Point inner
      ctx.fillStyle = '#1e2130';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Point number
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((i + 1).toString(), x, y);
    }

    // Add a compass rose
    drawCompassRose(ctx, width - 40, height - 40, 20);
    
    // Add "Saint Petersburg" label
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Санкт-Петербург', 10, 10);
  };

  // Generate simulated positions for the sights
  const generateSimulatedPositions = (count: number, width: number, height: number) => {
    const center = { x: width / 2, y: height / 2 };
    const radius = Math.min(width, height) * 0.35;
    const positions = [];

    // Create a spiral pattern
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const distance = (i / count) * radius;
      const x = center.x + Math.cos(angle) * distance;
      const y = center.y + Math.sin(angle) * distance;
      positions.push({ x, y });
    }

    return positions;
  };

  // Draw a simple compass rose
  const drawCompassRose = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const directions = [
      { letter: 'С', angle: 0 },
      { letter: 'В', angle: Math.PI / 2 },
      { letter: 'Ю', angle: Math.PI },
      { letter: 'З', angle: Math.PI * 1.5 }
    ];
    
    // Draw circle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw direction pointers
    ctx.strokeStyle = '#ffbb00';
    ctx.lineWidth = 2;
    
    directions.forEach(dir => {
      const startX = x;
      const startY = y;
      const endX = x + Math.sin(dir.angle) * size * 0.8;
      const endY = y - Math.cos(dir.angle) * size * 0.8;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Add direction letter
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const textX = x + Math.sin(dir.angle) * size * 0.9;
      const textY = y - Math.cos(dir.angle) * size * 0.9;
      ctx.fillText(dir.letter, textX, textY);
    });
  };
  
  return (
    <div className="py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="icon" onClick={onReset}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold text-todoYellow">Ваш маршрут</h2>
        <div className="w-9"></div> {/* Empty div for alignment */}
      </div>
      
      <div className="bg-todoDarkGray rounded-xl p-4 mb-6">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="text-todoYellow" size={20} />
            <span>Достопримечательностей: {selectedSights.length}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="text-todoYellow" size={20} />
            <span>Примерное время: {totalTimeHours} ч</span>
          </div>
          
          <div className="flex items-center gap-2">
            <CreditCard className="text-todoYellow" size={20} />
            <span>Примерная стоимость: {totalCost} ₽</span>
          </div>
        </div>
        
        <div 
          ref={mapRef} 
          className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center mb-4 overflow-hidden"
        >
          <p className="text-gray-400">Загрузка карты...</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-2">Точки маршрута:</h3>
        
        {selectedSights.map((sight, index) => (
          <div key={sight.id} className="bg-todoDarkGray rounded-lg p-4 flex gap-4">
            <div className="flex-shrink-0 bg-gray-600 w-16 h-16 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold">{index + 1}</span>
            </div>
            
            <div>
              <h4 className="font-bold text-todoYellow">{sight.name}</h4>
              <p className="text-sm text-gray-300 mt-1">{sight.price} • {sight.hours.split(';')[0]}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button
          className="bg-todoYellow hover:bg-todoYellow/90 text-black font-bold py-3 px-8 rounded-xl text-lg"
          onClick={onReset}
        >
          Создать новый маршрут
        </Button>
      </div>
    </div>
  );
};

export default RouteResult;

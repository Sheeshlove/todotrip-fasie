
export interface TripSuggestion {
  id: string;
  title: string;
  description: string;
}

// Mock function to generate a random trip based on user input
export const generateTrip = (input: string): TripSuggestion => {
  const id = Math.random().toString(36).substring(2, 9);
  
  // Simplistic but illustrative response generation
  const destinations = [
    "Алтай", "Байкал", "Камчатка", "Калининград", "Карелия", "Владивосток", 
    "Сочи", "Крым", "Санкт-Петербург", "Казань", "Эльбрус"
  ];
  
  const activities = [
    "треккинг по горам", "посещение музеев", "плавание в озере", "поход в пещеры",
    "полет на параплане", "катание на лодке", "фотоохота", "дегустация местной кухни",
    "изучение древних памятников", "катание на собачьих упряжках"
  ];
  
  const randomDestination = destinations[Math.floor(Math.random() * destinations.length)];
  const randomActivity1 = activities[Math.floor(Math.random() * activities.length)];
  const randomActivity2 = activities[Math.floor(Math.random() * activities.length)];
  
  return {
    id,
    title: `Путешествие в ${randomDestination}`,
    description: `Ваш идеальный маршрут включает ${randomActivity1} и ${randomActivity2}. Это путешествие идеально подходит для ${input.toLowerCase().includes('интроверт') ? 'спокойного отдыха вдали от толпы' : 'увлекательного приключения'}!`
  };
};


// Define the personality questions (IPIP-NEO-120 for travelers)
export interface Question {
  id: string;
  text: string;
  trait: string;
  direction: 'positive' | 'negative';
}

export const questions: Question[] = [
  // Openness questions
  { id: 'O1', text: 'Мне нравится исследовать неизвестные места в поездках.', trait: 'openness', direction: 'positive' },
  { id: 'O2', text: 'Я часто выбираю маршруты, которые ведут вне туристических троп.', trait: 'openness', direction: 'positive' },
  { id: 'O3', text: 'Посещение музеев, галерей или природных заповедников входит в список моих приоритетов.', trait: 'openness', direction: 'positive' },
  { id: 'O4', text: 'Я охотно пробую новые виды активностей в путешествиях.', trait: 'openness', direction: 'positive' },
  { id: 'O5', text: 'Я ищу уникальные культурные впечатления, даже если это требует усилий.', trait: 'openness', direction: 'positive' },
  
  // Conscientiousness questions
  { id: 'C1', text: 'Я всегда бронирую жильё и билеты заранее.', trait: 'conscientiousness', direction: 'positive' },
  { id: 'C2', text: 'Я люблю, когда программа дня расписана чётко.', trait: 'conscientiousness', direction: 'positive' },
  { id: 'C3', text: 'Я редко откладываю подготовку к поездке на последний момент.', trait: 'conscientiousness', direction: 'positive' },
  { id: 'C4', text: 'Я тщательно проверяю визовые требования и страховку перед поездкой.', trait: 'conscientiousness', direction: 'positive' },
  { id: 'C5', text: 'Я предпочитаю иметь чёткий список вещей, которые нужно взять с собой.', trait: 'conscientiousness', direction: 'positive' },
  
  // Extraversion questions
  { id: 'E1', text: 'Я люблю общаться с местными жителями во время поездок.', trait: 'extraversion', direction: 'positive' },
  { id: 'E2', text: 'Я получаю удовольствие от участия в туристических группах.', trait: 'extraversion', direction: 'positive' },
  { id: 'E3', text: 'Я чувствую прилив энергии, посещая шумные рынки и площади.', trait: 'extraversion', direction: 'positive' },
  { id: 'E4', text: 'Мне нравится проводить вечера в барах и клубах за границей.', trait: 'extraversion', direction: 'positive' },
  { id: 'E5', text: 'Я часто завожу новые знакомства в поездках.', trait: 'extraversion', direction: 'positive' },
  
  // Agreeableness questions
  { id: 'A1', text: 'Я всегда стараюсь уважать местные обычаи и традиции.', trait: 'agreeableness', direction: 'positive' },
  { id: 'A2', text: 'Я терпелив к людям, которые говорят на другом языке.', trait: 'agreeableness', direction: 'positive' },
  { id: 'A3', text: 'Я охотно помогаю другим туристам в пути.', trait: 'agreeableness', direction: 'positive' },
  { id: 'A4', text: 'Я легко иду на компромиссы с попутчиками.', trait: 'agreeableness', direction: 'positive' },
  { id: 'A5', text: 'Я стараюсь избегать конфликтов в поездках.', trait: 'agreeableness', direction: 'positive' },
  
  // Neuroticism questions
  { id: 'N1', text: 'Я легко начинаю беспокоиться, если что-то идёт не по плану.', trait: 'neuroticism', direction: 'positive' },
  { id: 'N2', text: 'Я сильно нервничаю при задержках рейсов.', trait: 'neuroticism', direction: 'positive' },
  { id: 'N3', text: 'Я переживаю, если теряю ориентиры в незнакомом городе.', trait: 'neuroticism', direction: 'positive' },
  { id: 'N4', text: 'Я тревожусь о сохранности своих вещей в поездке.', trait: 'neuroticism', direction: 'positive' },
  { id: 'N5', text: 'Я склонен волноваться при пересечении границ.', trait: 'neuroticism', direction: 'positive' },
];

export const options = [
  { value: '1', label: 'Совсем не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Нейтрален' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Полностью согласен' },
];

export const traitDescriptions: {[key: string]: string} = {
  openness: 'Открытость новому опыту: Склонность к исследованию новых мест, маршрутов вне туристических троп и интерес к разным культурам в путешествиях.',
  conscientiousness: 'Сознательность: Тщательное планирование поездок, внимание к деталям и соблюдение чётко структурированного плана путешествия.',
  extraversion: 'Экстраверсия: Стремление к общению с местными жителями, участию в групповых активностях и публичных мероприятиях во время путешествий.',
  agreeableness: 'Доброжелательность: Уважение к местным традициям, готовность помогать другим туристам и избегать конфликтов в поездках.',
  neuroticism: 'Нейротизм: Склонность беспокоиться о деталях путешествия, испытывать стресс при изменениях планов и тревожиться о безопасности.'
};


// Short version of the OCEAN personality test
import { Question, options } from './personalityTestQuestions';

export const quickQuestions: Question[] = [
  // Openness questions (4 questions)
  { id: 'QO1', text: 'Мне нравится исследовать неизвестные места в поездках.', trait: 'openness', direction: 'positive' },
  { id: 'QO2', text: 'Я часто выбираю маршруты, которые ведут вне туристических троп.', trait: 'openness', direction: 'positive' },
  { id: 'QO3', text: 'Я охотно пробую новые виды активностей в путешествиях.', trait: 'openness', direction: 'positive' },
  { id: 'QO4', text: 'Я легко адаптируюсь к новому образу жизни в другой стране.', trait: 'openness', direction: 'positive' },
  
  // Conscientiousness questions (4 questions)
  { id: 'QC1', text: 'Я всегда бронирую жильё и билеты заранее.', trait: 'conscientiousness', direction: 'positive' },
  { id: 'QC2', text: 'Я тщательно проверяю визовые требования и страховку перед поездкой.', trait: 'conscientiousness', direction: 'positive' },
  { id: 'QC3', text: 'Я стараюсь придерживаться заранее составленного маршрута.', trait: 'conscientiousness', direction: 'positive' },
  { id: 'QC4', text: 'Я тщательно рассчитываю бюджет поездки.', trait: 'conscientiousness', direction: 'positive' },
  
  // Extraversion questions (4 questions)
  { id: 'QE1', text: 'Я люблю общаться с местными жителями во время поездок.', trait: 'extraversion', direction: 'positive' },
  { id: 'QE2', text: 'Мне нравится проводить вечера в барах и клубах за границей.', trait: 'extraversion', direction: 'positive' },
  { id: 'QE3', text: 'Я часто завожу новые знакомства в поездках.', trait: 'extraversion', direction: 'positive' },
  { id: 'QE4', text: 'Мне легко вступать в разговор с незнакомыми людьми в поездке.', trait: 'extraversion', direction: 'positive' },
  
  // Agreeableness questions (4 questions)
  { id: 'QA1', text: 'Я всегда стараюсь уважать местные обычаи и традиции.', trait: 'agreeableness', direction: 'positive' },
  { id: 'QA2', text: 'Я терпелив к людям, которые говорят на другом языке.', trait: 'agreeableness', direction: 'positive' },
  { id: 'QA3', text: 'Я охотно помогаю другим туристам в пути.', trait: 'agreeableness', direction: 'positive' },
  { id: 'QA4', text: 'Я легко иду на компромиссы с попутчиками.', trait: 'agreeableness', direction: 'positive' },
  
  // Neuroticism questions (4 questions)
  { id: 'QN1', text: 'Я легко начинаю беспокоиться, если что-то идёт не по плану.', trait: 'neuroticism', direction: 'positive' },
  { id: 'QN2', text: 'Я сильно нервничаю при задержках рейсов.', trait: 'neuroticism', direction: 'positive' },
  { id: 'QN3', text: 'Я переживаю, если теряю ориентиры в незнакомом городе.', trait: 'neuroticism', direction: 'positive' },
  { id: 'QN4', text: 'Я тревожусь о сохранности своих вещей в поездке.', trait: 'neuroticism', direction: 'positive' },
];

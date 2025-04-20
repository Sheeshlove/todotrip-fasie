
import { Sight } from '@/components/RouteSelection/SightCard';

export const spbSights: Sight[] = [
  {
    id: 1,
    name: 'Государственный Эрмитаж',
    description: 'Один из крупнейших и старейших музеев мира, хранящий более 3 миллионов произведений искусства. Расположен в Зимнем дворце, он поражает великолепием интерьеров и богатством коллекций.',
    price: 'от 500 ₽',
    hours: 'вт, чт, сб, вс: 10:30–18:00; ср, пт: 10:30–21:00; пн: выходной',
    website: 'hermitagemuseum.org',
    websiteUrl: 'https://www.hermitagemuseum.org/wps/portal/hermitage/',
    contacts: '+7 (812) 710-90-79',
    imageUrl: '/placeholder.svg'
  },
  {
    id: 2,
    name: 'Петропавловская крепость',
    description: 'Историческое ядро города, основанное Петром I в 1703 году, с собором, где похоронены российские императоры. С крепости ежедневно в полдень раздается пушечный выстрел.',
    price: 'вход на территорию бесплатный; музеи — от 450 ₽',
    hours: 'ежедневно 9:30–21:00',
    website: 'peterandpaul.ru',
    websiteUrl: 'https://www.spbmuseum.ru/themuseum/museum_complex/peterpaul_fortress/',
    contacts: '+7 (812) 498-05-00',
    imageUrl: '/placeholder.svg'
  },
  {
    id: 3,
    name: 'Исаакиевский собор',
    description: 'Величественный собор с позолоченным куполом, откуда открывается панорамный вид на город. Интерьеры поражают мозаиками и колоннами из малахита и лазурита.',
    price: 'от 350 ₽',
    hours: 'ежедневно 10:00–18:00; ср: выходной; вечерние программы: 18:00–21:30 (с 23 июля по 30 сентября)',
    website: 'isaakievskiy.spb.ru',
    websiteUrl: 'https://isaakievskiy.spb.ru/',
    contacts: '+7 (812) 315-97-32',
    imageUrl: '/placeholder.svg'
  },
  {
    id: 4,
    name: 'Храм Спаса на Крови',
    description: 'Яркий памятник в русском стиле, построенный на месте смертельного ранения императора Александра II. Внутри — одна из крупнейших коллекций мозаик в мире.',
    price: 'от 350 ₽',
    hours: 'ежедневно 10:00–18:00; ср: выходной; с 1 мая по 30 сентября: 18:00–21:30 (без экскурсионного обслуживания)',
    website: 'spasnanekrovi.ru',
    websiteUrl: 'https://spasnanekrovi.ru/',
    contacts: '+7 (812) 315-16-36',
    imageUrl: '/placeholder.svg'
  },
  {
    id: 5,
    name: 'Русский музей',
    description: 'Крупнейшее собрание русского изобразительного искусства от икон до авангарда. Основное здание — Михайловский дворец, окруженный живописным садом.',
    price: 'от 500 ₽',
    hours: 'пн, ср, пт, сб, вс: 10:00–18:00; чт: 13:00–21:00; вт: выходной',
    website: 'rusmuseum.ru',
    websiteUrl: 'https://www.rusmuseum.ru/',
    contacts: '+7 (812) 595-42-48',
    imageUrl: '/placeholder.svg'
  },
  {
    id: 6,
    name: 'Мариинский театр',
    description: 'Один из ведущих театров оперы и балета в мире, где выступали Шаляпин, Уланова, Нуреев. Современные постановки сочетаются с классическим репертуаром.',
    price: 'от 500 ₽',
    hours: 'в зависимости от расписания спектаклей',
    website: 'mariinsky.ru',
    websiteUrl: 'https://www.mariinsky.ru/',
    contacts: '+7 (812) 326-41-41',
    imageUrl: '/placeholder.svg'
  },
  {
    id: 7,
    name: 'Крейсер «Аврора»',
    description: 'Легендарный корабль, выстрел которого ознаменовал начало Октябрьской революции. Сегодня — музей, рассказывающий о морской истории России.',
    price: 'от 400 ₽',
    hours: 'ежедневно 10:30–16:00; пн, пт: выходной',
    website: 'navalmuseum.ru',
    websiteUrl: 'https://navalmuseum.ru/',
    contacts: '+7 (812) 230-62-96',
    imageUrl: '/placeholder.svg'
  },
  {
    id: 8,
    name: 'Музей Фаберже',
    description: 'Уникальная коллекция ювелирных изделий, включая знаменитые императорские пасхальные яйца. Расположен в Шуваловском дворце на набережной Фонтанки.',
    price: 'от 450 ₽',
    hours: 'ежедневно 10:00–20:45',
    website: 'fabergemuseum.ru',
    websiteUrl: 'https://fabergemuseum.ru/',
    contacts: '+7 (812) 230-62-96',
    imageUrl: '/placeholder.svg'
  }
];

export function preloadSightImages() {
  spbSights.forEach((sight) => {
    if (sight.imageUrl) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = sight.imageUrl;
      document.head.appendChild(link);
    }
  });
}


type HobbyCategory = {
  title: string;
  hobbies: string[];
};

export const hobbiesData: HobbyCategory[] = [
  {
    title: "Творчество и искусство",
    hobbies: [
      "Рисование",
      "Живопись",
      "Фотография",
      "Видеомонтаж",
      "Танцы",
      "Пение",
      "Театр",
      "Скульптура",
      "Керамика",
      "Диджеинг"
    ]
  },
  {
    title: "📚 Образование и мышление",
    hobbies: [
      "Чтение",
      "Письмо",
      "Изучение языков",
      "История",
      "Психология",
      "Философия",
      "Поэзия",
      "Настольные игры",
      "Викторины",
      "Шахматы"
    ]
  },
  // ... all other categories follow the same pattern
];

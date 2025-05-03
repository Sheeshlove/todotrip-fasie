
/**
 * Compatibility Service
 * Calculates compatibility between users based on their OCEAN personality traits
 * English/Russian documentation for easy maintenance
 */

/**
 * Calculate compatibility between two users based on their personality test results
 * Расчет совместимости между двумя пользователями на основе их результатов теста личности
 */
export const calculateCompatibility = (
  user1Results: any | null,
  user2Results: any | null
): number => {
  // If either user doesn't have test results, return default value
  // Если у одного из пользователей нет результатов теста, вернуть значение по умолчанию
  if (!user1Results || !user2Results) {
    return 75; // Default moderate-high compatibility when data is missing
  }

  // 1. Calculate trait differences
  // Расчет разницы между чертами личности
  const opennessDiff = Math.abs(user1Results.openness - user2Results.openness);
  const conscientiousnessDiff = Math.abs(user1Results.conscientiousness - user2Results.conscientiousness);
  const extraversionDiff = Math.abs(user1Results.extraversion - user2Results.extraversion);
  const agreeablenessDiff = Math.abs(user1Results.agreeableness - user2Results.agreeableness);
  const neuroticismDiff = Math.abs(user1Results.neuroticism - user2Results.neuroticism);

  // 2. Calculate similarity score (higher means more similar)
  // Расчет показателя схожести (выше значит более похожи)
  const rawSimilarity = (
    opennessDiff + 
    conscientiousnessDiff + 
    extraversionDiff + 
    agreeablenessDiff + 
    neuroticismDiff
  ) / 5;
  
  const similarityScore = 100 - rawSimilarity;

  // 3. Calculate extraversion complement (how well they balance each other)
  // Расчет комплементарности экстраверсии (насколько хорошо они дополняют друг друга)
  const extraversionComplement = 100 - Math.abs(user1Results.extraversion + user2Results.extraversion - 100);

  // 4. Calculate complementary score
  // Расчет показателя взаимодополняемости
  const complementaryScore = (
    extraversionComplement + 
    (100 - agreeablenessDiff) + 
    (100 - neuroticismDiff)
  ) / 3;

  // 5. Calculate overall compatibility (weighted average of similarity and complementary scores)
  // Расчет общей совместимости (средневзвешенное значение показателей схожести и взаимодополняемости)
  const overallCompatibility = (similarityScore * 0.5) + (complementaryScore * 0.5);
  
  // Ensure the result is between 0 and 100
  // Убедимся, что результат находится в диапазоне от 0 до 100
  return Math.min(100, Math.max(0, Math.round(overallCompatibility)));
};

/**
 * Get color based on compatibility score
 * Получение цвета на основе показателя совместимости
 */
export const getCompatibilityColor = (score: number): string => {
  if (score >= 80) return 'text-green-500'; // High compatibility (80-100%)
  if (score >= 50) return 'text-todoYellow'; // Medium-high compatibility (50-80%)
  if (score >= 25) return 'text-orange-400'; // Medium-low compatibility (25-50%)
  return 'text-red-500'; // Low compatibility (0-25%)
};

/**
 * Get background color class based on compatibility score
 * Получение класса цвета фона на основе показателя совместимости
 */
export const getCompatibilityBgColor = (score: number): string => {
  if (score >= 80) return 'bg-green-500/90'; // High compatibility (80-100%)
  if (score >= 50) return 'bg-todoYellow/90'; // Medium-high compatibility (50-80%)
  if (score >= 25) return 'bg-orange-400/90'; // Medium-low compatibility (25-50%)
  return 'bg-red-500/90'; // Low compatibility (0-25%)
};

/**
 * Get detailed analysis of compatibility between two users
 * Получение детального анализа совместимости между двумя пользователями
 */
export const getCompatibilityAnalysis = (
  user1Results: any,
  user2Results: any
): Record<string, string> => {
  if (!user1Results || !user2Results) {
    return {
      overall: "Недостаточно данных для полного анализа. Предложите пользователям пройти тест личности.",
    };
  }

  const analysis: Record<string, string> = {};
  
  // Analyze openness compatibility
  // Анализ совместимости по открытости новому опыту
  const opennessDiff = Math.abs(user1Results.openness - user2Results.openness);
  if (opennessDiff < 20) {
    analysis.openness = "Схожий уровень открытости новому опыту. Вы, вероятно, будете иметь похожие интересы к исследованию и творчеству.";
  } else if (user1Results.openness > 70 && user2Results.openness < 30) {
    analysis.openness = "Значительные различия в открытости. Один из вас стремится к новым впечатлениям, в то время как другой предпочитает стабильность.";
  } else {
    analysis.openness = "Умеренные различия в открытости. Это может создать баланс между новизной и комфортом.";
  }
  
  // Analyze conscientiousness compatibility
  // Анализ совместимости по добросовестности
  const conscientiousnessDiff = Math.abs(user1Results.conscientiousness - user2Results.conscientiousness);
  if (conscientiousnessDiff < 20) {
    analysis.conscientiousness = "Похожий уровень организованности и ответственности. Вы, скорее всего, будете иметь схожие подходы к планированию путешествий.";
  } else if (user1Results.conscientiousness > 70 && user2Results.conscientiousness < 30) {
    analysis.conscientiousness = "Один из вас очень организован и методичен, а другой более спонтанен. Это может вызывать трения при планировании.";
  } else {
    analysis.conscientiousness = "Умеренные различия в организованности, что может помочь сбалансировать планирование и спонтанность в путешествиях.";
  }
  
  // Analyze extraversion compatibility with special formula
  // Анализ совместимости по экстраверсии с использованием специальной формулы
  const extraversionSum = user1Results.extraversion + user2Results.extraversion;
  const extraversionComplement = 100 - Math.abs(extraversionSum - 100);
  
  if (extraversionComplement > 80) {
    analysis.extraversion = "Отлично сбалансированная пара по экстраверсии. Ваши энергии хорошо дополняют друг друга.";
  } else if (extraversionSum > 140) {
    analysis.extraversion = "Оба довольно общительны и энергичны. Вы будете активно общаться, но иногда может не хватать спокойного времени.";
  } else if (extraversionSum < 60) {
    analysis.extraversion = "Оба предпочитаете спокойное времяпрепровождение. Комфортное общение, но может не хватать инициативы в новых ситуациях.";
  } else {
    analysis.extraversion = "Умеренный баланс энергии и спокойствия. Хорошее сочетание для разнообразных активностей.";
  }
  
  // Overall assessment
  // Общая оценка
  const overallScore = calculateCompatibility(user1Results, user2Results);
  if (overallScore >= 80) {
    analysis.overall = "Высокая совместимость! У вас есть отличные шансы на гармоничное путешествие вместе.";
  } else if (overallScore >= 60) {
    analysis.overall = "Хорошая совместимость. С некоторым компромиссом вы можете отлично провести время вместе.";
  } else {
    analysis.overall = "Умеренная совместимость. Потребуется больше общения и компромиссов для успешного совместного путешествия.";
  }
  
  return analysis;
};

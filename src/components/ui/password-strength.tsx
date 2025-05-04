import { useEffect, useState } from 'react';
import { Progress } from './progress';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let score = 0;
    let feedback = '';

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const strengthPercentage = (score / 6) * 100;

    if (strengthPercentage === 0) {
      feedback = 'Введите пароль';
    } else if (strengthPercentage <= 33) {
      feedback = 'Слабый пароль';
    } else if (strengthPercentage <= 66) {
      feedback = 'Средний пароль';
    } else {
      feedback = 'Сильный пароль';
    }

    setStrength(strengthPercentage);
    setMessage(feedback);
  }, [password]);

  const getColor = () => {
    if (strength <= 33) return 'bg-red-500';
    if (strength <= 66) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-2">
      <Progress value={strength} className={getColor()} />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
} 
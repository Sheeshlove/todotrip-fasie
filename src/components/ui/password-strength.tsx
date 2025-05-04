
import { useEffect, useState } from 'react';
import { Progress } from './progress';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState('');
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    // Reset for empty passwords
    if (!password) {
      setStrength(0);
      setMessage('Введите пароль');
      setRequirements({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      });
      return;
    }

    // Check individual requirements
    const hasLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    
    setRequirements({
      length: hasLength,
      uppercase: hasUpperCase,
      lowercase: hasLowerCase,
      number: hasNumber,
      special: hasSpecial
    });

    // Calculate strength score (0-100)
    let score = 0;
    if (hasLength) score += 20;
    if (hasUpperCase) score += 20;
    if (hasLowerCase) score += 20;
    if (hasNumber) score += 20;
    if (hasSpecial) score += 20;

    // Additional factor: password entropy based on length
    const entropyBonus = Math.min(20, password.length - 8);
    if (entropyBonus > 0) {
      score += entropyBonus;
    }

    // Cap at 100
    score = Math.min(100, score);
    setStrength(score);

    // Set appropriate message
    if (score === 0) {
      setMessage('Введите пароль');
    } else if (score <= 20) {
      setMessage('Очень слабый пароль');
    } else if (score <= 40) {
      setMessage('Слабый пароль');
    } else if (score <= 60) {
      setMessage('Средний пароль');
    } else if (score <= 80) {
      setMessage('Хороший пароль');
    } else {
      setMessage('Отличный пароль');
    }
  }, [password]);

  const getColor = () => {
    if (strength <= 20) return 'bg-red-500';
    if (strength <= 40) return 'bg-orange-500';
    if (strength <= 60) return 'bg-yellow-500';
    if (strength <= 80) return 'bg-green-400';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-2">
      <Progress value={strength} className={`h-1.5 ${getColor()}`} />
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <RequirementCheck 
          fulfilled={requirements.length} 
          label="Минимум 8 символов" 
        />
        <RequirementCheck 
          fulfilled={requirements.uppercase} 
          label="Заглавная буква" 
        />
        <RequirementCheck 
          fulfilled={requirements.lowercase} 
          label="Строчная буква" 
        />
        <RequirementCheck 
          fulfilled={requirements.number} 
          label="Цифра" 
        />
        <RequirementCheck 
          fulfilled={requirements.special} 
          label="Специальный символ" 
        />
      </div>
      
      <p className={`text-sm font-medium ${getTextColor(strength)}`}>{message}</p>
    </div>
  );
}

function RequirementCheck({ fulfilled, label }: { fulfilled: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1 text-xs">
      {fulfilled ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <X className="h-3 w-3 text-red-500" />
      )}
      <span className={fulfilled ? "text-green-500/80" : "text-red-500/80"}>
        {label}
      </span>
    </div>
  );
}

function getTextColor(strength: number): string {
  if (strength <= 20) return 'text-red-500';
  if (strength <= 40) return 'text-orange-500';
  if (strength <= 60) return 'text-yellow-500';
  if (strength <= 80) return 'text-green-400';
  return 'text-green-500';
}

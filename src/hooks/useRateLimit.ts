import { useState, useCallback } from 'react';

interface RateLimitOptions {
  maxAttempts: number;
  timeWindow: number; // in milliseconds
  lockoutDuration: number; // in milliseconds
}

export const useRateLimit = (options: RateLimitOptions) => {
  const [attempts, setAttempts] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    
    // Remove attempts outside the time window
    const recentAttempts = attempts.filter(time => now - time < options.timeWindow);
    setAttempts(recentAttempts);

    // Check if locked out
    if (isLocked && lockoutEndTime && now < lockoutEndTime) {
      const remainingTime = Math.ceil((lockoutEndTime - now) / 1000);
      throw new Error(`Too many attempts. Please try again in ${remainingTime} seconds.`);
    }

    // Reset lock if lockout period has ended
    if (isLocked && lockoutEndTime && now >= lockoutEndTime) {
      setIsLocked(false);
      setLockoutEndTime(null);
    }

    // Check if too many attempts
    if (recentAttempts.length >= options.maxAttempts) {
      setIsLocked(true);
      setLockoutEndTime(now + options.lockoutDuration);
      throw new Error(`Too many attempts. Please try again in ${Math.ceil(options.lockoutDuration / 1000)} seconds.`);
    }

    // Add new attempt
    setAttempts([...recentAttempts, now]);
  }, [attempts, isLocked, lockoutEndTime, options]);

  return {
    checkRateLimit,
    isLocked,
    remainingAttempts: options.maxAttempts - attempts.length,
    lockoutEndTime
  };
}; 
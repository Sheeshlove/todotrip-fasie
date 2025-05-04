
import { useState, useCallback, useEffect } from 'react';

interface RateLimitOptions {
  maxAttempts: number;
  timeWindow: number; // in milliseconds
  lockoutDuration: number; // in milliseconds
  storagePrefix?: string; // prefix for localStorage keys
}

interface RateLimitState {
  attempts: number[];
  isLocked: boolean;
  lockoutEndTime: number | null;
}

const STORAGE_PREFIX = 'todotrip_security_';

export const useRateLimit = (options: RateLimitOptions) => {
  const storageKey = `${options.storagePrefix || STORAGE_PREFIX}ratelimit`;
  
  // Initialize state from localStorage if available
  const [state, setState] = useState<RateLimitState>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error('Failed to parse rate limit data from localStorage');
    }
    
    return {
      attempts: [],
      isLocked: false,
      lockoutEndTime: null
    };
  });
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save rate limit data to localStorage');
    }
  }, [state, storageKey]);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    
    // Remove attempts outside the time window
    const recentAttempts = state.attempts.filter(time => now - time < options.timeWindow);
    
    // Check if locked out
    if (state.isLocked && state.lockoutEndTime && now < state.lockoutEndTime) {
      const remainingTime = Math.ceil((state.lockoutEndTime - now) / 1000);
      throw new Error(`Слишком много попыток. Пожалуйста, попробуйте снова через ${remainingTime} секунд.`);
    }

    // Reset lock if lockout period has ended
    if (state.isLocked && state.lockoutEndTime && now >= state.lockoutEndTime) {
      setState({
        attempts: [],
        isLocked: false,
        lockoutEndTime: null
      });
      return;
    }

    // Check if too many attempts
    if (recentAttempts.length >= options.maxAttempts) {
      const newLockoutEndTime = now + options.lockoutDuration;
      
      setState({
        attempts: recentAttempts,
        isLocked: true,
        lockoutEndTime: newLockoutEndTime
      });
      
      throw new Error(`Слишком много попыток. Пожалуйста, попробуйте снова через ${Math.ceil(options.lockoutDuration / 1000)} секунд.`);
    }

    // Add new attempt
    setState({
      attempts: [...recentAttempts, now],
      isLocked: state.isLocked,
      lockoutEndTime: state.lockoutEndTime
    });
  }, [state, options]);

  const resetRateLimit = useCallback(() => {
    setState({
      attempts: [],
      isLocked: false,
      lockoutEndTime: null
    });
  }, []);

  return {
    checkRateLimit,
    resetRateLimit,
    isLocked: state.isLocked,
    remainingAttempts: options.maxAttempts - state.attempts.length,
    lockoutEndTime: state.lockoutEndTime
  };
};

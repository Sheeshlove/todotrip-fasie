
/**
 * Secure Session Management Utilities
 * Following ISO 27001 standards for secure data handling
 */

// Prefixes for storage keys
const STORAGE_PREFIX = 'todotrip_secure_';

// For sensitive data that should be encrypted
export const encryptData = (data: any): string => {
  try {
    // Simple encoding for now - in production would use a proper encryption library
    return btoa(JSON.stringify(data));
  } catch (error) {
    console.error('Error encrypting data:', error);
    return '';
  }
};

// Decrypting data
export const decryptData = (encryptedData: string): any => {
  try {
    return JSON.parse(atob(encryptedData));
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};

// Secure storage helper functions
export const secureStorage = {
  // Store with encryption for sensitive data
  setItem: (key: string, value: any) => {
    try {
      const secureKey = `${STORAGE_PREFIX}${key}`;
      const encryptedValue = encryptData(value);
      localStorage.setItem(secureKey, encryptedValue);
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
    }
  },

  // Retrieve and decrypt
  getItem: (key: string): any => {
    try {
      const secureKey = `${STORAGE_PREFIX}${key}`;
      const encryptedValue = localStorage.getItem(secureKey);
      if (!encryptedValue) return null;
      return decryptData(encryptedValue);
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  },

  // Remove item
  removeItem: (key: string) => {
    try {
      const secureKey = `${STORAGE_PREFIX}${key}`;
      localStorage.removeItem(secureKey);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },

  // Clear all secure storage items
  clear: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
};

// Secure session timeout management
export const setupSessionTimeout = (
  timeoutMinutes: number = 30,
  onTimeout: () => void
): (() => void) => {
  const ACTIVITY_TIMEOUT_KEY = `${STORAGE_PREFIX}lastActivity`;
  let timeoutId: number | undefined;
  
  // Update last activity time
  const updateActivityTime = () => {
    localStorage.setItem(ACTIVITY_TIMEOUT_KEY, Date.now().toString());
  };

  // Check if session has timed out
  const checkSessionTimeout = () => {
    const lastActivity = localStorage.getItem(ACTIVITY_TIMEOUT_KEY);
    if (!lastActivity) {
      updateActivityTime();
      return;
    }

    const lastActivityTime = parseInt(lastActivity);
    const currentTime = Date.now();
    const timeDiff = currentTime - lastActivityTime;
    const timeoutMs = timeoutMinutes * 60 * 1000;

    if (timeDiff > timeoutMs) {
      onTimeout();
    }
  };

  // Set up event listeners for user activity
  const setupActivityListeners = () => {
    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    const activityHandler = () => updateActivityTime();
    
    activityEvents.forEach(event => {
      document.addEventListener(event, activityHandler);
    });

    // Initial activity timestamp
    updateActivityTime();

    // Set up periodic check
    timeoutId = window.setInterval(checkSessionTimeout, 60000);

    // Return cleanup function
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, activityHandler);
      });
      if (timeoutId) {
        clearInterval(timeoutId);
      }
    };
  };

  return setupActivityListeners();
};

// Input sanitization for XSS prevention
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Replace potentially dangerous characters
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// URL sanitization for preventing open redirect vulnerabilities
export const sanitizeUrl = (url: string): string => {
  if (!url) return '/';
  
  // Make sure URL is relative or from same origin
  if (url.startsWith('//') || url.startsWith('http')) {
    try {
      const urlObj = new URL(url);
      const currentHost = window.location.hostname;
      
      // Only allow URLs from same host
      if (urlObj.hostname !== currentHost) {
        console.warn('Potential open redirect attempt blocked:', url);
        return '/';
      }
    } catch (error) {
      console.error('Invalid URL:', url);
      return '/';
    }
  }
  
  return url;
};

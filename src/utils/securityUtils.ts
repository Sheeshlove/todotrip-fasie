
/**
 * Security Utilities for ISO 27001 Compliance
 * Contains functions for input validation, sanitization, and security checks
 */

// Regular expressions for validation
const PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^\+?[0-9]{10,15}$/,
  PASSWORD_STRENGTH: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  HTML_TAGS: /<[^>]*>/g,
  SCRIPT_TAGS: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  SQL_INJECTION: /(\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|DROP|ALTER|CREATE|TABLE|OR|AND|UNION)\b)/i
};

// Input validation functions
export const validate = {
  /**
   * Validates an email address
   * @param email Email address to validate
   * @returns True if email is valid
   */
  email: (email: string): boolean => {
    return PATTERNS.EMAIL.test(email);
  },
  
  /**
   * Validates a phone number
   * @param phone Phone number to validate
   * @returns True if phone number is valid
   */
  phone: (phone: string): boolean => {
    return PATTERNS.PHONE.test(phone);
  },
  
  /**
   * Validates password strength
   * @param password Password to validate
   * @returns Object containing validation results
   */
  password: (password: string): { 
    isValid: boolean;
    hasMinLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasDigit: boolean;
    hasSpecialChar: boolean;
  } => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: PATTERNS.PASSWORD_STRENGTH.test(password),
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasDigit,
      hasSpecialChar
    };
  },
  
  /**
   * Validates a URL
   * @param url URL to validate
   * @returns True if URL is valid
   */
  url: (url: string): boolean => {
    return PATTERNS.URL.test(url);
  }
};

// Input sanitization functions
export const sanitize = {
  /**
   * Sanitizes user input to prevent XSS attacks
   * @param input User input to sanitize
   * @returns Sanitized string
   */
  xss: (input: string): string => {
    if (!input) return '';
    
    return input
      .replace(PATTERNS.HTML_TAGS, '')
      .replace(PATTERNS.SCRIPT_TAGS, '')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\//g, '&#x2F;');
  },
  
  /**
   * Sanitizes SQL input to prevent injection
   * @param input SQL input to sanitize
   * @returns Sanitized string or empty if high risk detected
   */
  sql: (input: string): string => {
    if (!input) return '';
    
    // High risk SQL injection attempt
    if (PATTERNS.SQL_INJECTION.test(input)) {
      console.warn('Potential SQL injection attempt detected:', input);
      return '';
    }
    
    return input
      .replace(/'/g, "''")
      .replace(/;/g, '');
  },
  
  /**
   * Sanitizes URL parameters
   * @param url URL to sanitize
   * @returns Sanitized URL
   */
  url: (url: string): string => {
    if (!url) return '';
    
    // Prevent javascript: protocol
    if (url.toLowerCase().includes('javascript:')) {
      console.warn('Potential XSS attack detected in URL:', url);
      return '';
    }
    
    // Only allow http, https protocols or relative paths
    if (url.includes(':') && !url.startsWith('http:') && !url.startsWith('https:')) {
      console.warn('Potentially unsafe URL protocol:', url);
      return '';
    }
    
    return url;
  }
};

// Security utilities
export const security = {
  /**
   * Generates a secure random string
   * @param length Length of the string to generate
   * @returns Random string
   */
  generateRandomString: (length: number = 32): string => {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },
  
  /**
   * Creates a secure hash of a string (client-side only, not cryptographically secure)
   * @param input String to hash
   * @returns Hashed string
   */
  createHash: async (input: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },
  
  /**
   * Detects potential security risks in user input
   * @param input User input to check
   * @returns Risk assessment result
   */
  detectRisks: (input: string): {
    hasXssRisk: boolean;
    hasSqlInjectionRisk: boolean;
    hasUrlRisk: boolean;
  } => {
    return {
      hasXssRisk: PATTERNS.HTML_TAGS.test(input) || PATTERNS.SCRIPT_TAGS.test(input),
      hasSqlInjectionRisk: PATTERNS.SQL_INJECTION.test(input),
      hasUrlRisk: input.toLowerCase().includes('javascript:')
    };
  }
};

/**
 * Validates form data against a schema
 * @param data Form data to validate
 * @param schema Validation schema with field types and requirements
 * @returns Validation result with errors if any
 */
export const validateFormData = <T extends Record<string, any>>(
  data: T, 
  schema: Record<keyof T, {
    type: 'string' | 'number' | 'boolean' | 'email' | 'phone' | 'password' | 'url';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  }>
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } => {
  const errors: Partial<Record<keyof T, string>> = {};
  
  Object.entries(schema).forEach(([field, rules]) => {
    const value = data[field];
    const fieldName = field as keyof T;
    
    // Check required fields
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors[fieldName] = 'Это поле обязательно для заполнения';
      return;
    }
    
    // Skip validation for empty optional fields
    if ((value === undefined || value === null || value === '') && !rules.required) {
      return;
    }
    
    // Type validation
    switch (rules.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors[fieldName] = 'Должно быть текстом';
        } else {
          // Length validation
          if (rules.minLength !== undefined && value.length < rules.minLength) {
            errors[fieldName] = `Минимальная длина: ${rules.minLength} символов`;
          }
          if (rules.maxLength !== undefined && value.length > rules.maxLength) {
            errors[fieldName] = `Максимальная длина: ${rules.maxLength} символов`;
          }
        }
        break;
        
      case 'number':
        if (typeof value !== 'number' && isNaN(Number(value))) {
          errors[fieldName] = 'Должно быть числом';
        }
        break;
        
      case 'boolean':
        if (typeof value !== 'boolean') {
          errors[fieldName] = 'Должно быть логическим значением';
        }
        break;
        
      case 'email':
        if (!validate.email(String(value))) {
          errors[fieldName] = 'Введите корректный email';
        }
        break;
        
      case 'phone':
        if (!validate.phone(String(value))) {
          errors[fieldName] = 'Введите корректный номер телефона';
        }
        break;
        
      case 'password':
        const passwordValidation = validate.password(String(value));
        if (!passwordValidation.isValid) {
          errors[fieldName] = 'Пароль должен содержать минимум 8 символов, заглавные и строчные буквы, цифры и специальные символы';
        }
        break;
        
      case 'url':
        if (!validate.url(String(value))) {
          errors[fieldName] = 'Введите корректный URL';
        }
        break;
    }
    
    // Pattern validation
    if (rules.pattern && !rules.pattern.test(String(value))) {
      errors[fieldName] = 'Значение не соответствует требуемому формату';
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

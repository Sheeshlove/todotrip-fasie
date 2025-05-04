
// Regular expressions for validation
export const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^\+?[0-9]{10,15}$/,
  PASSWORD_STRENGTH: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
};

// Input validation functions
export const validate = {
  /**
   * Validates an email address
   * @param email Email address to validate
   * @returns True if email is valid
   */
  email: (email: string): boolean => {
    return VALIDATION_PATTERNS.EMAIL.test(email);
  },
  
  /**
   * Validates a phone number
   * @param phone Phone number to validate
   * @returns True if phone number is valid
   */
  phone: (phone: string): boolean => {
    return VALIDATION_PATTERNS.PHONE.test(phone);
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
      isValid: VALIDATION_PATTERNS.PASSWORD_STRENGTH.test(password),
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
    return VALIDATION_PATTERNS.URL.test(url);
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

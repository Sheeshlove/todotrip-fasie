
// Regular expressions for security checks
export const SECURITY_PATTERNS = {
  HTML_TAGS: /<[^>]*>/g,
  SCRIPT_TAGS: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  SQL_INJECTION: /(\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|DROP|ALTER|CREATE|TABLE|OR|AND|UNION)\b)/i
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
      .replace(SECURITY_PATTERNS.HTML_TAGS, '')
      .replace(SECURITY_PATTERNS.SCRIPT_TAGS, '')
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
    if (SECURITY_PATTERNS.SQL_INJECTION.test(input)) {
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
      hasXssRisk: SECURITY_PATTERNS.HTML_TAGS.test(input) || SECURITY_PATTERNS.SCRIPT_TAGS.test(input),
      hasSqlInjectionRisk: SECURITY_PATTERNS.SQL_INJECTION.test(input),
      hasUrlRisk: input.toLowerCase().includes('javascript:')
    };
  }
};

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sanitizes a string to prevent XSS attacks
 * Removes HTML tags and encodes special characters
 */
export function sanitizeString(value: string): string {
  if (!value) return '';
  
  // Remove HTML tags
  const noTags = value.replace(/<[^>]*>/g, '');
  
  // Encode special characters
  const div = document.createElement('div');
  div.textContent = noTags;
  return div.innerHTML;
}

/**
 * Validate and sanitize user input
 * @param input Any user input
 * @returns Sanitized input
 */
export function sanitizeInput(input: unknown): string | object | null {
  if (input === null || input === undefined) {
    return null;
  }
  
  if (typeof input === 'string') {
    return sanitizeString(input);
  }
  
  if (typeof input === 'object') {
    // Recursively sanitize objects
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(input as Record<string, any>)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeInput(value);
      } else {
        // Primitive values (numbers, booleans) don't need sanitization
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
  
  // Return primitives as is
  return input as any;
}

/**
 * Generate a secure random ID
 * @param length The length of the ID
 * @returns A random ID
 */
export function generateSecureId(length: number = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Debug utility - only logs when VITE_DEBUG_API is explicitly set to 'true'
export const debugLog = (...args: any[]) => {
  // Only log if VITE_DEBUG_API is explicitly set to 'true' (string)
  // This prevents logging when it's 'false', undefined, or any other value
  if (import.meta.env.VITE_DEBUG_API === 'true') {
    console.log(...args);
  }
};

// Debug utility for errors - always log errors but with prefix only in debug mode
export const debugError = (...args: any[]) => {
  if (import.meta.env.VITE_DEBUG_API === 'true') {
    console.error('[DEBUG]', ...args);
  } else {
    console.error(...args);
  }
};

// Debug utility for warnings
export const debugWarn = (...args: any[]) => {
  if (import.meta.env.VITE_DEBUG_API === 'true') {
    console.warn('[DEBUG]', ...args);
  }
};

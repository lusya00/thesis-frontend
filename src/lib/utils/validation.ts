// Validation utility functions for form inputs

export const validationPatterns = {
  name: /^[a-zA-Z\s'-]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[0-9\s\-\(\)]+$/,
  phoneDigitsOnly: /^[\+]?[0-9]+$/,
  alphabetOnly: /^[a-zA-Z\s]+$/,
  alphanumeric: /^[a-zA-Z0-9\s]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
};

export const validationMessages = {
  name: "Name should only contain letters, spaces, hyphens, and apostrophes",
  email: "Please enter a valid email address",
  phone: "Please enter a valid phone number",
  phoneRequired: "Phone number is required",
  emailRequired: "Email address is required",
  nameRequired: "Name is required",
  passwordRequired: "Password is required",
  passwordWeak: "Password must be at least 8 characters with uppercase, lowercase, and number",
  subjectRequired: "Subject is required",
  messageRequired: "Message is required"
};

// Input sanitization functions
export const sanitizeInput = {
  name: (value: string) => value.replace(/[^a-zA-Z\s'-]/g, ''),
  phone: (value: string) => value.replace(/[^0-9\+\s\-\(\)]/g, ''),
  phoneDigitsOnly: (value: string) => value.replace(/[^0-9\+]/g, ''),
  alphabetOnly: (value: string) => value.replace(/[^a-zA-Z\s]/g, ''),
  alphanumeric: (value: string) => value.replace(/[^a-zA-Z0-9\s]/g, ''),
  email: (value: string) => value.toLowerCase().trim(),
  subject: (value: string) => value.replace(/[<>\"']/g, ''), // Remove potential XSS characters
  message: (value: string) => value.replace(/[<>]/g, '') // Basic XSS prevention
};

// Validation functions
export const validateField = {
  name: (value: string): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: validationMessages.nameRequired };
    }
    if (!validationPatterns.name.test(value)) {
      return { isValid: false, message: validationMessages.name };
    }
    return { isValid: true, message: '' };
  },

  email: (value: string): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: validationMessages.emailRequired };
    }
    if (!validationPatterns.email.test(value)) {
      return { isValid: false, message: validationMessages.email };
    }
    return { isValid: true, message: '' };
  },

  phone: (value: string, required: boolean = false): { isValid: boolean; message: string } => {
    if (!value.trim() && required) {
      return { isValid: false, message: validationMessages.phoneRequired };
    }
    if (value.trim() && !validationPatterns.phone.test(value)) {
      return { isValid: false, message: validationMessages.phone };
    }
    return { isValid: true, message: '' };
  },

  password: (value: string): { isValid: boolean; message: string } => {
    if (!value) {
      return { isValid: false, message: validationMessages.passwordRequired };
    }
    if (!validationPatterns.password.test(value)) {
      return { isValid: false, message: validationMessages.passwordWeak };
    }
    return { isValid: true, message: '' };
  },

  subject: (value: string): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: validationMessages.subjectRequired };
    }
    return { isValid: true, message: '' };
  },

  message: (value: string): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: validationMessages.messageRequired };
    }
    return { isValid: true, message: '' };
  }
};

// Format functions for display
export const formatInput = {
  phone: (value: string): string => {
    // Format Indonesian phone numbers
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('62')) {
      // Indonesian country code
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)}-${cleaned.slice(5, 9)}-${cleaned.slice(9)}`;
    } else if (cleaned.startsWith('0')) {
      // Local Indonesian number
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
    }
    return value;
  },

  name: (value: string): string => {
    // Capitalize first letter of each word
    return value.replace(/\b\w/g, l => l.toUpperCase());
  }
};

// Real-time input handlers
export const createInputHandler = (
  type: keyof typeof sanitizeInput,
  setValue: (value: string) => void,
  setError?: (error: string) => void,
  required?: boolean
) => {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rawValue = e.target.value;
    const sanitizedValue = sanitizeInput[type](rawValue);
    setValue(sanitizedValue);

    // Real-time validation
    if (setError) {
      const validation = validateField[type as keyof typeof validateField]?.(sanitizedValue, required);
      if (validation) {
        setError(validation.isValid ? '' : validation.message);
      }
    }
  };
};

// Form validation helper
export const validateForm = (
  fields: Record<string, { value: string; type: keyof typeof validateField; required?: boolean }>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  let isValid = true;

  Object.entries(fields).forEach(([fieldName, { value, type, required }]) => {
    const validation = validateField[type](value, required);
    if (!validation.isValid) {
      errors[fieldName] = validation.message;
      isValid = false;
    }
  });

  return { isValid, errors };
}; 
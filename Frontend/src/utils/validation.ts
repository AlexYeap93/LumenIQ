export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  return { isValid: true };
};

export const validateName = (name: string, fieldName: string = 'Name'): ValidationResult => {
  if (!name || name.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
  }
  return { isValid: true };
};

export const validatePhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Phone number is required' };
  }
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 10) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  return { isValid: true };
};

export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
};

export const validateUrl = (url: string, isRequired: boolean = false): ValidationResult => {
  if (!url || url.trim() === '') {
    if (isRequired) {
      return { isValid: false, error: 'URL is required' };
    }
    return { isValid: true }; // Optional field
  }
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL (e.g., https://example.com)' };
  }
};

export const validateCardNumber = (cardNumber: string): ValidationResult => {
  if (!cardNumber || cardNumber.trim() === '') {
    return { isValid: false, error: 'Card number is required' };
  }
  // Remove spaces and dashes
  const digitsOnly = cardNumber.replace(/[\s-]/g, '');
  if (!/^\d{13,19}$/.test(digitsOnly)) {
    return { isValid: false, error: 'Please enter a valid card number' };
  }
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  for (let i = digitsOnly.length - 1; i >= 0; i--) {
    let digit = parseInt(digitsOnly[i]);
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    isEven = !isEven;
  }
  if (sum % 10 !== 0) {
    return { isValid: false, error: 'Invalid card number' };
  }
  return { isValid: true };
};

export const validateCardExpiry = (expiry: string): ValidationResult => {
  if (!expiry || expiry.trim() === '') {
    return { isValid: false, error: 'Expiry date is required' };
  }
  const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!expiryRegex.test(expiry)) {
    return { isValid: false, error: 'Please enter expiry in MM/YY format' };
  }
  const [month, year] = expiry.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
  const currentMonth = currentDate.getMonth() + 1;
  const expiryYear = parseInt(year);
  const expiryMonth = parseInt(month);
  
  if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
    return { isValid: false, error: 'Card has expired' };
  }
  return { isValid: true };
};

export const validateCVC = (cvc: string): ValidationResult => {
  if (!cvc || cvc.trim() === '') {
    return { isValid: false, error: 'CVC is required' };
  }
  if (!/^\d{3,4}$/.test(cvc)) {
    return { isValid: false, error: 'Please enter a valid CVC (3-4 digits)' };
  }
  return { isValid: true };
};

export const validateZipCode = (zipCode: string): ValidationResult => {
  if (!zipCode || zipCode.trim() === '') {
    return { isValid: false, error: 'ZIP/Postal code is required' };
  }
  // Accept US ZIP (5 or 5+4 digits) or general alphanumeric postal codes
  if (!/^[A-Za-z0-9\s-]{3,10}$/.test(zipCode)) {
    return { isValid: false, error: 'Please enter a valid ZIP/Postal code' };
  }
  return { isValid: true };
};

import { FormField, FormValues, FormErrors } from '../types/form';

export const validateField = (
  field: FormField,
  value: string | string[] | boolean,
  values: FormValues
): string => {
  // Skip validation if the field is not required and value is empty
  if (!field.required && (value === '' || value === undefined || value === null)) {
    return '';
  }

  // Required field validation
  if (field.required && (value === '' || value === undefined || value === null)) {
    return field.validation?.message || 'This field is required';
  }

  // Type-specific validations
  if (typeof value === 'string') {
    // Min length validation
    if (field.minLength && value.length < field.minLength) {
      return `Minimum ${field.minLength} characters required`;
    }

    // Max length validation
    if (field.maxLength && value.length > field.maxLength) {
      return `Maximum ${field.maxLength} characters allowed`;
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    // Tel validation
    if (field.type === 'tel' && value) {
      const telRegex = /^\d{10}$/;
      if (!telRegex.test(value)) {
        return 'Please enter a valid 10-digit phone number';
      }
    }
  }

  return '';
};

export const validateSection = (
  fields: FormField[],
  values: FormValues
): FormErrors => {
  const errors: FormErrors = {};

  fields.forEach((field) => {
    const value = values[field.fieldId];
    const error = validateField(field, value, values);
    
    if (error) {
      errors[field.fieldId] = error;
    }
  });

  return errors;
};

export const isSectionValid = (errors: FormErrors): boolean => {
  return Object.keys(errors).length === 0;
};
import React from 'react';
import { FormField as FormFieldType } from '../types/form';

interface FormFieldProps {
  field: FormFieldType;
  value: string | string[] | boolean;
  error?: string;
  onChange: (fieldId: string, value: string | string[] | boolean) => void;
}

const FormField: React.FC<FormFieldProps> = ({ field, value, error, onChange }) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value: inputValue, type, checked } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      onChange(name, checked);
    } else if (type === 'radio') {
      onChange(name, inputValue);
    } else {
      onChange(name, inputValue);
    }
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'tel':
      case 'email':
      case 'date':
        return (
          <input
            type={field.type}
            id={field.fieldId}
            name={field.fieldId}
            data-testid={field.dataTestId}
            value={value as string}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            maxLength={field.maxLength}
            minLength={field.minLength}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
        
      case 'textarea':
        return (
          <textarea
            id={field.fieldId}
            name={field.fieldId}
            data-testid={field.dataTestId}
            value={value as string}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            maxLength={field.maxLength}
            minLength={field.minLength}
            rows={4}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
        
      case 'dropdown':
        return (
          <select
            id={field.fieldId}
            name={field.fieldId}
            data-testid={field.dataTestId}
            value={value as string}
            onChange={handleChange}
            required={field.required}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                data-testid={option.dataTestId}
              >
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.fieldId}-${option.value}`}
                  name={field.fieldId}
                  data-testid={option.dataTestId}
                  value={option.value}
                  checked={value === option.value}
                  onChange={handleChange}
                  required={field.required}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label 
                  htmlFor={`${field.fieldId}-${option.value}`}
                  className="text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.fieldId}
              name={field.fieldId}
              data-testid={field.dataTestId}
              checked={value as boolean}
              onChange={handleChange}
              required={field.required}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label 
              htmlFor={field.fieldId}
              className="text-gray-700"
            >
              {field.label}
            </label>
          </div>
        );
        
      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  };

  return (
    <div className="mb-4">
      {field.type !== 'checkbox' && (
        <label 
          htmlFor={field.fieldId} 
          className="block mb-1 font-medium text-gray-700"
        >
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
      )}
      {renderField()}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;
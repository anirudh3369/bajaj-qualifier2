import React from 'react';
import FormField from './FormField';
import { FormSection as FormSectionType, FormValues, FormErrors } from '../types/form';

interface FormSectionProps {
  section: FormSectionType;
  values: FormValues;
  errors: FormErrors;
  onChange: (fieldId: string, value: string | string[] | boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isFirstSection: boolean;
  isLastSection: boolean;
  isSectionValid: boolean;
}

const FormSection: React.FC<FormSectionProps> = ({
  section,
  values,
  errors,
  onChange,
  onNext,
  onPrevious,
  onSubmit,
  isFirstSection,
  isLastSection,
  isSectionValid,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 ease-in-out">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{section.title}</h2>
      <p className="text-gray-600 mb-6">{section.description}</p>
      
      <div className="space-y-4">
        {section.fields.map((field) => (
          <FormField
            key={field.fieldId}
            field={field}
            value={values[field.fieldId] ?? (field.type === 'checkbox' ? false : '')}
            error={errors[field.fieldId]}
            onChange={onChange}
          />
        ))}
      </div>
      
      <div className="flex justify-between mt-8">
        {!isFirstSection && (
          <button
            type="button"
            onClick={onPrevious}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
        )}
        {isFirstSection && <div></div>}
        
        {!isLastSection ? (
          <button
            type="button"
            onClick={onNext}
            disabled={!isSectionValid}
            className={`px-4 py-2 rounded-md transition-colors ${
              isSectionValid
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-300 text-white cursor-not-allowed'
            }`}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!isSectionValid}
            className={`px-4 py-2 rounded-md transition-colors ${
              isSectionValid
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-teal-300 text-white cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default FormSection;
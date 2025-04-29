import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormSection as FormSectionType, FormValues, FormErrors } from '../types/form';
import { getForm } from '../services/api';
import { validateSection, isSectionValid } from '../utils/validation';
import FormSection from '../components/FormSection';
import ProgressIndicator from '../components/ProgressIndicator';
import { ClipboardList, Loader } from 'lucide-react';

const FormPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formTitle, setFormTitle] = useState<string>('');
  const [sections, setSections] = useState<FormSectionType[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    const userData = sessionStorage.getItem('userData');
    
    if (!userData) {
      // Redirect to login if no user data is found
      navigate('/');
      return;
    }
    
    const { rollNumber } = JSON.parse(userData);
    
    const fetchForm = async () => {
      try {
        const formData = await getForm(rollNumber);
        setSections(formData.form.sections);
        setFormTitle(formData.form.formTitle);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching form:', error);
        setError('Failed to load the form. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchForm();
  }, [navigate]);
  
  const handleFieldChange = (fieldId: string, value: string | string[] | boolean) => {
    // Update form values
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    
    // Clear error for this field if exists
    if (formErrors[fieldId]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };
  
  const handleNext = () => {
    const currentSection = sections[currentSectionIndex];
    const errors = validateSection(currentSection.fields, formValues);
    
    setFormErrors(errors);
    
    if (isSectionValid(errors)) {
      setCurrentSectionIndex((prev) => prev + 1);
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handlePrevious = () => {
    setCurrentSectionIndex((prev) => Math.max(0, prev - 1));
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSubmit = () => {
    const currentSection = sections[currentSectionIndex];
    const errors = validateSection(currentSection.fields, formValues);
    
    setFormErrors(errors);
    
    if (isSectionValid(errors)) {
      // All sections completed, log form data
      console.log('Form submitted with values:', formValues);
      
      // Show success message or redirect
      alert('Form submitted successfully!');
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <Loader className="h-12 w-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading form...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }
  
  const currentSection = sections[currentSectionIndex];
  const currentErrors = validateSection(currentSection.fields, formValues);
  const isCurrentSectionValid = isSectionValid(currentErrors);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex items-center justify-center mb-4">
            <ClipboardList className="h-10 w-10 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">{formTitle}</h1>
          </div>
          
          <ProgressIndicator 
            totalSections={sections.length}
            currentSection={currentSectionIndex}
          />
        </div>
        
        <FormSection
          section={currentSection}
          values={formValues}
          errors={formErrors}
          onChange={handleFieldChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
          isFirstSection={currentSectionIndex === 0}
          isLastSection={currentSectionIndex === sections.length - 1}
          isSectionValid={isCurrentSectionValid}
        />
      </div>
    </div>
  );
};

export default FormPage;
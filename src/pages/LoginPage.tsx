import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/form';
import { createUser } from '../services/api';
import { UserCog } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User>({
    rollNumber: '',
    name: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear API error when user makes changes
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!userData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
    }
    
    if (!userData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setApiError('');
    
    try {
      const result = await createUser(userData);
      
      // Store user data and redirect to form page regardless of whether
      // the user is new or existing
      sessionStorage.setItem('userData', JSON.stringify(userData));
      navigate('/form');
    } catch (error) {
      // Only show API errors that are not related to existing users
      if (!error.message?.includes('User already exists')) {
        setApiError('Failed to connect to the server. Please try again.');
        console.error('Login error:', error);
      } else {
        // If user exists, still proceed to form page
        sessionStorage.setItem('userData', JSON.stringify(userData));
        navigate('/form');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-6 px-8">
          <div className="flex items-center justify-center mb-3">
            <UserCog size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center">Student Login</h2>
          <p className="text-blue-100 text-center mt-2">Enter your details to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="py-8 px-8">
          {apiError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {apiError}
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="rollNumber" className="block mb-2 font-medium text-gray-700">
              Roll Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="rollNumber"
              name="rollNumber"
              value={userData.rollNumber}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.rollNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your roll number"
            />
            {errors.rollNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.rollNumber}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 text-white font-medium rounded-md transition-colors ${
              isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-sm text-gray-600">
        This is a demo application. No real data will be stored.
      </p>
    </div>
  );
};

export default LoginPage;
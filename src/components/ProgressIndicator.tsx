import React from 'react';

interface ProgressIndicatorProps {
  totalSections: number;
  currentSection: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  totalSections, 
  currentSection 
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSections }).map((_, index) => (
          <div 
            key={index}
            className={`flex items-center justify-center rounded-full w-8 h-8 ${
              index < currentSection
                ? 'bg-blue-600 text-white'
                : index === currentSection
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
      
      <div className="relative h-2 bg-gray-200 rounded-full">
        <div 
          className="absolute h-2 bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
          style={{ 
            width: `${((currentSection + 1) / totalSections) * 100}%` 
          }}
        ></div>
      </div>
      
      <div className="mt-2 text-sm text-gray-600 text-center">
        Section {currentSection + 1} of {totalSections}
      </div>
    </div>
  );
};

export default ProgressIndicator;
import React from 'react';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface PlatformFeaturesProps {
  title: string;
  features: Feature[];
}

const PlatformFeatures: React.FC<PlatformFeaturesProps> = ({ title, features }) => {
  return (
    <div className="text-center mb-16">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto border border-gray-100">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <i className={`${feature.icon} text-4xl text-red-600 mb-4`}></i>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformFeatures;

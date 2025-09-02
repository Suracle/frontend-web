import React from 'react';

interface WorkflowStep {
  number: number;
  title: string;
  description: string;
}

interface WorkflowExplanationProps {
  title: string;
  steps: WorkflowStep[];
}

const WorkflowExplanation: React.FC<WorkflowExplanationProps> = ({ title, steps }) => {
  return (
    <div className="text-center mb-16">
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 max-w-5xl mx-auto border border-red-100">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold">{step.number}</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">{step.title}</h4>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowExplanation;

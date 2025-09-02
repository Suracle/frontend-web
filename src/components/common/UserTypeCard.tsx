import React from 'react';

interface UserType {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
}

interface UserTypeCardProps {
  userType: UserType;
  onSelect: (userTypeId: string) => void;
}

const UserTypeCard: React.FC<UserTypeCardProps> = ({ userType, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
      {/* Card Header */}
      <div 
        className="p-8 text-center"
        style={{ 
          backgroundColor: userType.color,
          color: userType.color === 'var(--accent-cream)' ? '#2c2c2c' : 'white'
        }}
      >
        <i className={`${userType.icon} text-4xl md:text-5xl mb-4`}></i>
        <h3 className="text-xl md:text-2xl font-bold mb-2">{userType.title}</h3>
        <p className="text-base md:text-lg opacity-90">{userType.description}</p>
      </div>

      {/* Card Body */}
      <div className="p-6 md:p-8">
        <ul className="space-y-3 mb-6">
          {userType.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-gray-800">
              <i className="fas fa-check-circle text-green-500 text-lg"></i>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => onSelect(userType.id)}
          className="w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 text-white hover:opacity-90 transform hover:scale-105 cursor-pointer shadow-lg"
          style={{ backgroundColor: userType.color }}
        >
          {userType.title}로 시작하기
        </button>
      </div>
    </div>
  );
};

export default UserTypeCard;

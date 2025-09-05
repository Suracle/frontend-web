import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastNotificationProps {
  show: boolean;
  message: string;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ show, message }) => {
  if (!show) return null;

  return (
    <div className="fixed top-20 right-5 bg-green-600 text-white px-5 py-4 rounded-lg shadow-lg z-[9999] flex items-center gap-3 animate-slide-in-right">
      <CheckCircle size={20} />
      <span>{message}</span>
    </div>
  );
};

export default ToastNotification;

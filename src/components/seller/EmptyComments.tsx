import React from 'react';
import { MessageCircle } from 'lucide-react';

const EmptyComments: React.FC = () => {
  return (
    <div className="text-center py-10 text-text-secondary">
      <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
      <p>아직 관세사의 검토 의견이 없습니다.</p>
    </div>
  );
};

export default EmptyComments;

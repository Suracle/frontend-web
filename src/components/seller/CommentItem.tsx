import React from 'react';
import { User } from 'lucide-react';

interface CommentItemProps {
  author: string;
  role: string;
  date: string;
  content: string;
}

const CommentItem: React.FC<CommentItemProps> = ({ author, role, date, content }) => {
  return (
    <div className="flex gap-4 py-4">
      <div className="w-10 h-10 bg-accent-cream rounded-full flex items-center justify-center">
        <User size={16} className="text-primary" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-semibold text-text-primary">{author}</span>
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold uppercase">{role}</span>
          <span className="text-text-secondary text-sm">{date}</span>
        </div>
        <div className="text-text-primary leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;

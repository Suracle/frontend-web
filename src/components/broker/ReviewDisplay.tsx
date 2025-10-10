import React from 'react';
import { Check, X, Clock, Calendar, User } from 'lucide-react';

interface ReviewDisplayProps {
  reviewComment: string;
  reviewStatus: 'APPROVED' | 'REJECTED';
  reviewedAt: string;
  reviewerName?: string;
}

const ReviewDisplay: React.FC<ReviewDisplayProps> = ({
  reviewComment,
  reviewStatus,
  reviewedAt,
  reviewerName = '관세사'
}) => {
  const isApproved = reviewStatus === 'APPROVED';
  


return (
  <div className="bg-white rounded-2xl shadow-lg mb-8">
    {/* Header */}
    <div className={`bg-gradient-to-r rounded-t-2xl p-5 flex items-center justify-between ${
      isApproved 
        ? 'from-green-500 to-green-600' 
        : 'from-red-500 to-red-600'
    }`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
          {isApproved ? (
            <Check size={18} className="text-green-500 text-bold" />
          ) : (
            <X size={18} className="text-red-500 text-bold" />
          )}
        </div>
        <div className="text-lg font-semibold text-white">
          {isApproved ? '상품 승인 완료' : '상품 반려 완료'}
        </div>
      </div>
      
      {/* Status Badge - moved to header */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
        isApproved
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
      }`}>
        {isApproved ? (
          <>
            <Check size={16} />
            승인됨
          </>
        ) : (
          <>
            <X size={16} />
            반려됨
          </>
        )}
      </div>
    </div>

    {/* Content */}
    <div className="p-6">
      {/* Review Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-2 text-gray-600">
          <User size={16} />
          <span className="text-sm">검토자: {reviewerName}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={16} />
          <span className="text-sm">검토일: {new Date(reviewedAt).toLocaleDateString('ko-KR')}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock size={16} />
          <span className="text-sm">검토시간: {new Date(reviewedAt).toLocaleTimeString('ko-KR')}</span>
        </div>
      </div>

      {/* Review Comment */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          검토 의견
        </label>
        <div className="w-full min-h-[120px] p-4  rounded-xl text-base">
          {reviewComment || '검토 의견이 없습니다.'}
        </div>
      </div>

    </div>
  </div>
);
};


export default ReviewDisplay;


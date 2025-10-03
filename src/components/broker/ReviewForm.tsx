import React from 'react';
import { Check, X, ClipboardCheck } from 'lucide-react';

interface ReviewFormProps {
  reviewComment: string;
  onCommentChange: (comment: string) => void;
  onSubmitReview: (decision: 'approved' | 'rejected') => void;
  isSubmitting: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  reviewComment,
  onCommentChange,
  onSubmitReview,
  isSubmitting
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg mb-8">
      <div className="bg-gradient-secondary from-accent-cream to-secondary rounded-xl p-5 flex items-center gap-3">
        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
          <ClipboardCheck size={18} className="text-primary" />
        </div>
        <div className="text-lg font-semibold text-gray-900">검토 의견 작성</div>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <label htmlFor="reviewComment" className="block text-sm font-semibold text-gray-900 mb-2">
            검토 의견
          </label>
          <textarea
            id="reviewComment"
            value={reviewComment}
            onChange={(e) => onCommentChange(e.target.value)}
            className="w-full min-h-[120px] p-4 border-2 border-gray-300 rounded-xl text-base resize-y transition-colors focus:border-red-500 focus:outline-none"
            placeholder="상품에 대한 검토 의견을 작성해주세요. 승인 시에는 특별한 주의사항이나 권장사항을, 반려 시에는 구체적인 사유와 개선방안을 명시해주세요."
            required
          />
          <div className="text-right text-sm text-gray-600 mt-2">
            {reviewComment.length} 자
          </div>
        </div>
        
        <div className="flex gap-3 justify-end">
          
          <button
            onClick={() => onSubmitReview('rejected')}
            disabled={!reviewComment.trim() || isSubmitting}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <X size={16} />
            반려
          </button>
          <button
            onClick={() => onSubmitReview('approved')}
            disabled={!reviewComment.trim() || isSubmitting}
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check size={16} />
            승인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;

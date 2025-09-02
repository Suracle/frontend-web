import React from 'react';
import { MessageCircle } from 'lucide-react';
import CommentItem from './CommentItem';
import EmptyComments from './EmptyComments';

interface CommentsSectionProps {
  product: {
    status: 'not_reviewed' | 'pending' | 'approved' | 'rejected';
  };
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ product }) => {
  const renderComments = () => {
    switch (product.status) {
      case 'approved':
        return (
          <CommentItem
            author="박관세사"
            role="관세사"
            date="2024.03.26 10:15"
            content="상품이 모든 수입 요건을 충족하여 승인되었습니다. 무관세 적용 가능하며 특별한 추가 서류 없이 통관 가능합니다."
          />
        );
      case 'rejected':
        return (
          <CommentItem
            author="김관세사"
            role="관세사"
            date="2024.03.25 14:30"
            content="25년 7월 이후 관세율이 변경되어 15%를 부과합니다."
          />
        );
      case 'pending':
        return (
          <CommentItem
            author="박관세사"
            role="관세사"
            date="2024.03.25 09:30"
            content="현재 상품을 검토 중입니다. AI 분석 결과를 바탕으로 관세율, 수입 요건, 관련 판례를 종합적으로 검토하여 최종 의견을 작성하겠습니다."
          />
        );
      default:
        return <EmptyComments />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-secondary p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
          <MessageCircle size={20} className="text-primary" />
        </div>
        <div className="text-lg font-semibold text-text-primary">관세사 검토 의견</div>
      </div>
      <div className="p-6">
        {renderComments()}
      </div>
    </div>
  );
};

export default CommentsSection;

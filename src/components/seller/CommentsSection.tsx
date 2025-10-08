import React from 'react';
import { MessageCircle } from 'lucide-react';
import CommentItem from './CommentItem';
import EmptyComments from './EmptyComments';
import type { BrokerReviewResponse } from '@/api/brokerApi';

interface CommentsSectionProps {
  brokerReview?: BrokerReviewResponse | null;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ brokerReview }) => {
  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\. /g, '.').replace(/\.$/, '');
  };

  const renderComments = () => {
    // 리뷰가 없으면 빈 상태 표시
    if (!brokerReview) {
      return <EmptyComments />;
    }

    // PENDING 상태일 때는 대기 중 메시지만 표시
    if (brokerReview.reviewStatus === 'PENDING') {
      return (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-yellow-900">검토 대기 중</h4>
          </div>
          <p className="text-yellow-800 leading-relaxed">
            관세사의 검토를 대기하는 중입니다. 곧 전문적인 의견을 받으실 수 있습니다.
          </p>
        </div>
      );
    }

    // 승인/반려된 경우 실제 리뷰 데이터로 표시
    const displayDate = brokerReview.reviewedAt 
      ? formatDate(brokerReview.reviewedAt)
      : formatDate(brokerReview.createdAt);

    let defaultContent = '';
    if (brokerReview.reviewStatus === 'APPROVED') {
      defaultContent = '상품이 승인되었습니다.';
    } else if (brokerReview.reviewStatus === 'REJECTED') {
      defaultContent = '상품이 반려되었습니다.';
    }

    return (
      <CommentItem
        author={brokerReview.brokerName}
        role="관세사"
        date={displayDate}
        content={brokerReview.reviewComment || defaultContent}
      />
    );
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

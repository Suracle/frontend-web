/**
 * 브로커 리뷰 표시 컴포넌트
 */
import React from 'react';

interface ReviewDisplayProps {
  reviews?: Array<{
    id: string;
    content: string;
    rating: number;
    createdAt: string;
    brokerName: string;
  }>;
}

const ReviewDisplay: React.FC<ReviewDisplayProps> = ({ reviews = [] }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">상품 리뷰</h3>
      
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          아직 리뷰가 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{review.brokerName}</span>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-700">{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewDisplay;

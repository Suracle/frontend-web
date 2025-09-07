import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProductDescriptionCardProps {
  description: string;
}

const ProductDescriptionCard: React.FC<ProductDescriptionCardProps> = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 설명이 400자 이상이면 자세히보기 버튼 표시
  const shouldShowReadMore = description.length > 400;
  const displayText = isExpanded || !shouldShowReadMore 
    ? description 
    : `${description.substring(0, 400)}...`;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-primary">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
          상품 설명
        </div>
        {shouldShowReadMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-primary hover:text-secondary transition-colors text-sm font-medium"
          >
            {isExpanded ? (
              <>
                <span>간략히 보기</span>
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                <span>자세히 보기</span>
                <ChevronDown size={16} />
              </>
            )}
          </button>
        )}
      </div>
      
      <div className="text-text-primary leading-relaxed whitespace-pre-wrap">
        {displayText}
      </div>
      
      {shouldShowReadMore && !isExpanded && (
        <div className="mt-3 text-xs text-text-secondary">
          전체 {description.length}자 중 400자 표시
        </div>
      )}
    </div>
  );
};

export default ProductDescriptionCard;

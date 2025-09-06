import React from 'react';
import { Gavel, ExternalLink } from 'lucide-react';
import type { PrecedentsResponse } from '@/api/productApi';

interface PrecedentsAnalysisCardProps {
  product: {
    analysisComplete: boolean;
    precedentsAnalysis?: PrecedentsResponse;
    loading?: boolean;
  };
}

const PrecedentsAnalysisCard: React.FC<PrecedentsAnalysisCardProps> = ({ product }) => {
  const { analysisComplete, precedentsAnalysis, loading } = product;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-secondary from-accent-cream to-secondary px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <Gavel className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">관련 판례 분석</h3>
            <p className="text-sm text-gray-600">유사 상품의 승인/거부 사례 분석</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-10 text-text-secondary">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
            <p>AI가 관련 판례를 분석하고 있습니다...</p>
          </div>
        ) : analysisComplete && precedentsAnalysis ? (
          <div className="text-text-primary leading-relaxed mb-4">
            <div className="mb-4">
              <strong>승인률:</strong> {(precedentsAnalysis.approvalRate * 100).toFixed(1)}%
              <span className="ml-2 text-sm text-text-secondary">
                (신뢰도: {(precedentsAnalysis.confidenceScore * 100).toFixed(1)}%)
              </span>
            </div>
            
            {precedentsAnalysis.similarProducts && precedentsAnalysis.similarProducts.length > 0 && (
              <div className="mb-4">
                <strong>유사 상품:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {precedentsAnalysis.similarProducts.map((product, index) => (
                    <li key={index} className="text-sm">{product}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {precedentsAnalysis.commonIssues && precedentsAnalysis.commonIssues.length > 0 && (
              <div className="mb-4">
                <strong>주요 이슈:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {precedentsAnalysis.commonIssues.map((issue, index) => (
                    <li key={index} className="text-sm text-red-600">{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {precedentsAnalysis.successFactors && precedentsAnalysis.successFactors.length > 0 && (
              <div className="mb-4">
                <strong>성공 요인:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {precedentsAnalysis.successFactors.map((factor, index) => (
                    <li key={index} className="text-sm text-green-600">{factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-text-secondary">
            <p>판례 분석 데이터를 불러올 수 없습니다.</p>
          </div>
        )}
        
        {analysisComplete && precedentsAnalysis && (
          <a
            href="https://www.cbp.gov/trade/rulings"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm flex items-center gap-2 hover:underline"
          >
            <ExternalLink size={14} />
            CBP 판례 데이터베이스 확인
          </a>
        )}
      </div>
    </div>
  );
};

export default PrecedentsAnalysisCard;

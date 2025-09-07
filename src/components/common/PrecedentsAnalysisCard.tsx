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
              <strong>신뢰도:</strong> {(precedentsAnalysis.confidenceScore * 100).toFixed(1)}%
            </div>
            
            {precedentsAnalysis.successCases && precedentsAnalysis.successCases.length > 0 && (
              <div className="mb-4">
                <strong className="text-green-600">성공 사례:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {precedentsAnalysis.successCases.map((successCase, index) => (
                    <li key={index} className="text-sm text-green-700">{successCase}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {precedentsAnalysis.failureCases && precedentsAnalysis.failureCases.length > 0 && (
              <div className="mb-4">
                <strong className="text-red-600">실패 사례:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {precedentsAnalysis.failureCases.map((failureCase, index) => (
                    <li key={index} className="text-sm text-red-700">{failureCase}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {precedentsAnalysis.actionableInsights && precedentsAnalysis.actionableInsights.length > 0 && (
              <div className="mb-4">
                <strong className="text-blue-600">실행 가능한 인사이트:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {precedentsAnalysis.actionableInsights.map((insight, index) => (
                    <li key={index} className="text-sm text-blue-700">{insight}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {precedentsAnalysis.riskFactors && precedentsAnalysis.riskFactors.length > 0 && (
              <div className="mb-4">
                <strong className="text-orange-600">위험 요소:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {precedentsAnalysis.riskFactors.map((risk, index) => (
                    <li key={index} className="text-sm text-orange-700">{risk}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {precedentsAnalysis.recommendedAction && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <strong className="text-blue-800">권장 조치:</strong>
                <p className="text-sm text-blue-700 mt-1">{precedentsAnalysis.recommendedAction}</p>
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

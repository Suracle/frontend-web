import React from 'react';
import { Gavel, ExternalLink, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { PrecedentsResponse } from '@/api/productApi';

interface PrecedentsAnalysisCardProps {
  product: {
    analysisComplete: boolean;
    precedentsAnalysis?: PrecedentsResponse;
    loading?: boolean;
  };
}

// CBP 데이터 타입 정의
interface CBPData {
  case_id: string;
  title: string;
  link: string;
  source: string;
  status: string;
  content?: string;
  description?: string;
  key_factors?: string[];
  case_type?: string;
  outcome?: string;
  reason?: string;
}

const PrecedentsAnalysisCard: React.FC<PrecedentsAnalysisCardProps> = ({ product }) => {
  const { analysisComplete, precedentsAnalysis, loading } = product;

  // CBP 데이터를 파싱하는 함수
  const parseCBPData = (text: string): CBPData[] => {
    try {
      // JSON 형태의 CBP 데이터가 포함되어 있는지 확인
      const jsonMatch = text.match(/\{.*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return Array.isArray(parsed) ? parsed : [parsed];
      }
      
      // 텍스트에서 CBP 정보 추출
      const cbpData: CBPData[] = [];
      const lines = text.split('\n');
      
      for (const line of lines) {
        if (line.includes('CBP-') || line.includes('CROSS-')) {
          const caseIdMatch = line.match(/(CBP-\d+|CROSS-[A-Z0-9-]+)/);
          if (caseIdMatch) {
            cbpData.push({
              case_id: caseIdMatch[0],
              title: line.replace(caseIdMatch[0], '').trim(),
              link: `https://www.cbp.gov/trade/rulings`,
              source: 'cbp_data',
              status: 'APPROVED',
              description: line
            });
          }
        }
      }
      
      return cbpData;
    } catch (error) {
      console.error('CBP 데이터 파싱 오류:', error);
      return [];
    }
  };

  // CBP 데이터 추출
  const cbpData: CBPData[] = [];
  if (precedentsAnalysis) {
    // successCases에서 CBP 데이터 추출
    precedentsAnalysis.successCases?.forEach(caseText => {
      const parsed = parseCBPData(caseText);
      cbpData.push(...parsed);
    });
    
    // failureCases에서 CBP 데이터 추출
    precedentsAnalysis.failureCases?.forEach(caseText => {
      const parsed = parseCBPData(caseText);
      cbpData.push(...parsed);
    });
  }

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
            <p className="text-sm text-gray-600">실제 CBP 데이터 기반 승인/거부 사례 분석</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-10 text-text-secondary">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
            <p>AI가 실제 CBP 데이터를 검색하고 있습니다...</p>
          </div>
        ) : analysisComplete && precedentsAnalysis ? (
          <div className="text-text-primary leading-relaxed mb-4">
            <div className="mb-4">
              <strong>신뢰도:</strong> {(precedentsAnalysis.confidenceScore * 100).toFixed(1)}%
            </div>
            
            {/* 실제 CBP 데이터 표시 */}
            {cbpData.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  실제 CBP 판례 데이터
                </h4>
                <div className="space-y-3">
                  {cbpData.map((cbp, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {cbp.case_id}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              cbp.status === 'APPROVED' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {cbp.status}
                            </span>
                          </div>
                          <h5 className="font-medium text-gray-900 mb-1">{cbp.title}</h5>
                          {cbp.description && (
                            <p className="text-sm text-gray-600 mb-2">{cbp.description}</p>
                          )}
                          {cbp.key_factors && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {cbp.key_factors.map((factor, idx) => (
                                <span key={idx} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                  {factor}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <a
                          href={cbp.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-3 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="CBP 문서 보기"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {precedentsAnalysis.successCases && precedentsAnalysis.successCases.length > 0 && (
              <div className="mb-4">
                <strong className="text-green-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  성공 사례:
                </strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {precedentsAnalysis.successCases.map((successCase, index) => (
                    <li key={index} className="text-sm text-green-700">{successCase}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {precedentsAnalysis.failureCases && precedentsAnalysis.failureCases.length > 0 && (
              <div className="mb-4">
                <strong className="text-red-600 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  실패 사례:
                </strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {precedentsAnalysis.failureCases.map((failureCase, index) => (
                    <li key={index} className="text-sm text-red-700">{failureCase}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {precedentsAnalysis.actionableInsights && precedentsAnalysis.actionableInsights.length > 0 && (
              <div className="mb-4">
                <strong className="text-blue-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  실행 가능한 인사이트:
                </strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {precedentsAnalysis.actionableInsights.map((insight, index) => (
                    <li key={index} className="text-sm text-blue-700">{insight}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {precedentsAnalysis.riskFactors && precedentsAnalysis.riskFactors.length > 0 && (
              <div className="mb-4">
                <strong className="text-orange-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  위험 요소:
                </strong>
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
          <div className="flex gap-3">
            <a
              href="https://www.cbp.gov/trade/rulings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm flex items-center gap-2 hover:underline"
            >
              <ExternalLink size={14} />
              CBP 판례 데이터베이스 확인
            </a>
            <a
              href="https://rulings.cbp.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm flex items-center gap-2 hover:underline"
            >
              <FileText size={14} />
              CROSS Rulings 검색
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrecedentsAnalysisCard;

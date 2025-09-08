import axiosInstance from './axiosinstance';
import type {
  ChatSessionRequest,
  ChatSessionResponse,
  ChatMessageRequest,
  ChatMessageResponse,
  ChatMessagesPageResponse,
  ChatSessionType,
  ChatSessionStatus,
  MessageSenderType,
  MessageType
} from '../types';

// API 함수들
export const chatApi = {
  /**
   * 새 채팅 세션 생성
   * @param userId 사용자 ID
   * @param sessionType 세션 타입
   * @param language 언어
   * @param sessionData 세션 데이터 (선택사항)
   * @returns 생성된 세션 정보
   */
  createChatSession: async (
    userId: number,
    sessionType: ChatSessionType,
    language: string,
    sessionData?: string
  ): Promise<ChatSessionResponse> => {
    const requestData: ChatSessionRequest = {
      userId,
      sessionType,
      language,
      sessionData
    };
    
    const response = await axiosInstance.post('/chat/sessions', requestData);
    return response.data;
  },

  /**
   * 세션 조회
   * @param sessionId 세션 ID
   * @returns 세션 정보
   */
  getChatSession: async (sessionId: number): Promise<ChatSessionResponse> => {
    const response = await axiosInstance.get(`/chat/sessions/${sessionId}`);
    return response.data;
  },

  /**
   * 사용자의 활성 세션 조회
   * @param userId 사용자 ID
   * @param sessionType 세션 타입 (선택사항)
   * @returns 활성 세션 목록
   */
  getActiveSessions: async (
    userId: number,
    sessionType?: ChatSessionType
  ): Promise<ChatSessionResponse[]> => {
    const params = new URLSearchParams();
    params.append('userId', userId.toString());
    if (sessionType) {
      params.append('sessionType', sessionType);
    }
    
    const response = await axiosInstance.get(`/chat/sessions?${params.toString()}`);
    return response.data;
  },

  /**
   * 세션 상태 업데이트
   * @param sessionId 세션 ID
   * @param status 새로운 상태
   * @param sessionData 세션 데이터 (선택사항)
   * @returns 업데이트된 세션 정보
   */
  updateSession: async (
    sessionId: number,
    status: ChatSessionStatus,
    sessionData?: string
  ): Promise<ChatSessionResponse> => {
    const params = new URLSearchParams();
    params.append('status', status);
    if (sessionData) {
      params.append('sessionData', sessionData);
    }
    
    const response = await axiosInstance.put(`/chat/sessions/${sessionId}?${params.toString()}`);
    return response.data;
  },

  /**
   * 메시지 전송
   * @param sessionId 세션 ID
   * @param senderType 발신자 타입
   * @param messageContent 메시지 내용
   * @param messageType 메시지 타입
   * @param metadata 메타데이터 (선택사항)
   * @returns 전송된 메시지 정보
   */
  sendMessage: async (
    sessionId: number,
    senderType: MessageSenderType,
    messageContent: string,
    messageType: MessageType,
    metadata?: string
  ): Promise<ChatMessageResponse> => {
    const requestData: ChatMessageRequest = {
      sessionId,
      senderType,
      messageContent,
      messageType,
      metadata
    };
    
    const response = await axiosInstance.post(`/chat/sessions/${sessionId}/messages`, requestData);
    return response.data;
  },

  /**
   * 세션의 메시지 목록 조회 (페이징)
   * @param sessionId 세션 ID
   * @param page 페이지 번호 (기본값: 0)
   * @param size 페이지 크기 (기본값: 20)
   * @param sort 정렬 기준 (기본값: createdAt,asc)
   * @returns 메시지 목록 (페이징)
   */
  getMessages: async (
    sessionId: number,
    page: number = 0,
    size: number = 20,
    sort: string = 'createdAt,asc'
  ): Promise<ChatMessagesPageResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('sort', sort);
    
    const response = await axiosInstance.get(`/chat/sessions/${sessionId}/messages?${params.toString()}`);
    return response.data;
  },

  /**
   * 세션의 모든 메시지 조회 (페이징 없이)
   * @param sessionId 세션 ID
   * @returns 메시지 목록
   */
  getAllMessages: async (sessionId: number): Promise<ChatMessageResponse[]> => {
    const response = await axiosInstance.get(`/chat/sessions/${sessionId}/messages/all`);
    return response.data;
  },

  /**
   * AI 응답 생성
   * @param sessionId 세션 ID
   * @param userMessage 사용자 메시지
   * @returns AI 응답 메시지
   */
  generateAiResponse: async (
    sessionId: number,
    userMessage: string
  ): Promise<ChatMessageResponse> => {
    const params = new URLSearchParams();
    params.append('userMessage', userMessage);
    
    const response = await axiosInstance.post(`/chat/sessions/${sessionId}/ai-response?${params.toString()}`);
    return response.data;
  },

  /**
   * 만료된 데이터 정리 (관리자용)
   * @param expiredHours 만료 시간 (시간 단위, 기본값: 24)
   * @returns 정리된 항목 수
   */
  cleanupExpiredData: async (expiredHours: number = 24): Promise<number> => {
    const params = new URLSearchParams();
    params.append('expiredHours', expiredHours.toString());
    
    const response = await axiosInstance.post(`/chat/cleanup?${params.toString()}`);
    return response.data;
  }
};

export default chatApi;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chatApi } from '../api/chatApi';
import type {
  ChatSessionResponse,
  ChatMessageResponse,
  ChatSessionType,
  ChatSessionStatus,
  MessageSenderType,
  MessageType
} from '../types';

interface ChatState {
  // 상태
  currentSession: ChatSessionResponse | null;
  messages: ChatMessageResponse[];
  isLoading: boolean;
  error: string | null;

  // 액션
  createSession: (userId: number, sessionType: ChatSessionType, language: string, sessionData?: string) => Promise<void>;
  getSession: (sessionId: number) => Promise<void>;
  updateSession: (sessionId: number, status: ChatSessionStatus, sessionData?: string) => Promise<void>;
  sendMessage: (sessionId: number, senderType: MessageSenderType, messageContent: string, messageType: MessageType, metadata?: string) => Promise<void>;
  getMessages: (sessionId: number) => Promise<void>;
  generateAiResponse: (sessionId: number, userMessage: string) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  addMessage: (message: ChatMessageResponse) => void;
  clearSession: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      // 초기 상태
      currentSession: null,
      messages: [],
      isLoading: false,
      error: null,

      // 세션 생성
      createSession: async (userId, sessionType, language, sessionData) => {
        try {
          set({ isLoading: true, error: null });
          const session = await chatApi.createChatSession(userId, sessionType, language, sessionData);
          set({ currentSession: session, messages: [], isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '세션 생성에 실패했습니다.',
            isLoading: false 
          });
        }
      },

      // 세션 조회
      getSession: async (sessionId) => {
        try {
          set({ isLoading: true, error: null });
          const session = await chatApi.getChatSession(sessionId);
          set({ currentSession: session, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '세션 조회에 실패했습니다.',
            isLoading: false 
          });
        }
      },

      // 세션 업데이트
      updateSession: async (sessionId, status, sessionData) => {
        try {
          set({ isLoading: true, error: null });
          const session = await chatApi.updateSession(sessionId, status, sessionData);
          set({ currentSession: session, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '세션 업데이트에 실패했습니다.',
            isLoading: false 
          });
        }
      },

      // 메시지 전송
      sendMessage: async (sessionId, senderType, messageContent, messageType, metadata) => {
        try {
          console.log('Store: sendMessage called', { sessionId, senderType, messageContent });
          set({ isLoading: true, error: null });
          const message = await chatApi.sendMessage(sessionId, senderType, messageContent, messageType, metadata);
          console.log('Store: message received from API', message);
          
          // 메시지를 상태에 추가
          set(state => {
            const newMessages = [...state.messages, message];
            console.log('Store: adding message to state', { oldCount: state.messages.length, newCount: newMessages.length });
            return {
              messages: newMessages,
              isLoading: false
            };
          });
        } catch (error) {
          console.error('Store: sendMessage error', error);
          set({ 
            error: error instanceof Error ? error.message : '메시지 전송에 실패했습니다.',
            isLoading: false 
          });
        }
      },

      // 메시지 목록 조회
      getMessages: async (sessionId) => {
        try {
          set({ isLoading: true, error: null });
          const messages = await chatApi.getAllMessages(sessionId);
          console.log('Store: getMessages received', { count: messages.length, messages });
          set({ messages, isLoading: false });
        } catch (error) {
          console.error('Store: getMessages error', error);
          set({ 
            error: error instanceof Error ? error.message : '메시지 조회에 실패했습니다.',
            isLoading: false 
          });
        }
      },

      // AI 응답 생성
      generateAiResponse: async (sessionId, userMessage) => {
        try {
          set({ isLoading: true, error: null });
          const aiMessage = await chatApi.generateAiResponse(sessionId, userMessage);
          
          // AI 응답을 상태에 추가
          set(state => ({
            messages: [...state.messages, aiMessage],
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'AI 응답 생성에 실패했습니다.',
            isLoading: false 
          });
        }
      },

      // 에러 클리어
      clearError: () => set({ error: null }),

      // 로딩 상태 설정
      setLoading: (loading) => set({ isLoading: loading }),

      // 메시지 클리어
      clearMessages: () => set({ messages: [] }),

      // 메시지 추가 (내부용)
      addMessage: (message) => set(state => ({
        messages: [...state.messages, message]
      })),

      // 세션 완전 초기화 (로그아웃 시 사용)
      clearSession: () => set({
        currentSession: null,
        messages: [],
        isLoading: false,
        error: null
      })
    }),
    {
      name: 'chat-storage',
      // 세션과 메시지는 저장하지 않음 (임시 데이터)
      partialize: (state) => ({
        currentSession: state.currentSession,
        // messages는 저장하지 않음 (새로고침 시 초기화)
      })
    }
  )
);

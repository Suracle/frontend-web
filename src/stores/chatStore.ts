/**
 * 채팅 관련 상태 관리 스토어
 */
import { create } from "zustand";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  sendMessage: (content: string) => void;
  toggleChat: () => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isOpen: false,
  isLoading: false,

  sendMessage: async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true
    }));

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '안냥하세요! 요구사항 분석에 대해 도움을 드릴게요.',
        timestamp: new Date()
      };

      set((state) => ({
        messages: [...state.messages, aiMessage],
        isLoading: false
      }));
    }, 1000);
  },

  toggleChat: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  clearMessages: () => {
    set({ messages: [] });
  }
}));

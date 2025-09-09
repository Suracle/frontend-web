import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Bot, Send, X, AlertCircle } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useAuthStore } from '../../stores/authStore';
import type { ChatSessionType, MessageSenderType, MessageType } from '../../types';

interface ChatbotProps {
  title?: string;
  placeholder?: string;
  welcomeMessage?: string;
  className?: string;
  sessionType?: ChatSessionType;
}

const Chatbot: React.FC<ChatbotProps> = ({
  title = "AI 무역 어시스턴트",
  placeholder = "메시지를 입력하세요...",
  welcomeMessage = "AI 어시스턴트가 상품 등록을 도와드립니다.\n궁금한 점이 있으시면 언제든 문의하세요!",
  className = "",
  sessionType = "SELLER_PRODUCT_INQUIRY"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Store에서 상태와 액션 가져오기
  const { user, isAuthenticated } = useAuthStore();
  const { 
    currentSession, 
    messages, 
    isLoading, 
    error,
    createSession,
    sendMessage,
    generateAiResponse,
    getMessages,
    clearError
  } = useChatStore();
  
  const messagesRef = useRef(messages);

  // 메시지 목록 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    messagesRef.current = messages;
    console.log('Messages updated:', { count: messages.length, messages });
    scrollToBottom();
  }, [messages]);

  // 로그아웃 시 챗봇 닫기
  useEffect(() => {
    if (!isAuthenticated) {
      setIsOpen(false);
    }
  }, [isAuthenticated]);

  // 챗봇 열기/닫기
  const toggleChatbot = async () => {
    setIsOpen(!isOpen);
    
    if (!isOpen) {
      // 챗봇을 열 때 세션이 없으면 새로 생성
      if (!currentSession && user) {
        try {
          await createSession(
            user.id, 
            sessionType, 
            user.preferredLanguage || 'ko'
          );
        } catch (error) {
          console.error('Failed to create session:', error);
        }
      }
      
      // 기존 메시지가 있으면 로드
      if (currentSession && messages.length === 0) {
        try {
          await getMessages(currentSession.id);
        } catch (error) {
          console.error('Failed to load messages:', error);
        }
      }
    }
  };

  // 메시지 전송
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) {
      console.log('Message send blocked:', { 
        hasInput: !!inputValue.trim(), 
        hasSession: !!currentSession, 
        isLoading 
      });
      return;
    }

    // 세션이 없으면 먼저 생성
    if (!currentSession && user) {
      console.log('Creating session first...');
      try {
        await createSession(
          user.id, 
          sessionType, 
          user.preferredLanguage || 'ko'
        );
        // 세션 생성 후 잠시 대기하여 상태 업데이트 완료 보장
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error('Failed to create session:', error);
        return;
      }
    }

    // 세션 생성 후 다시 확인
    if (!currentSession) {
      console.error('Session creation failed');
      return;
    }

    const userMessage = inputValue.trim();
    setInputValue('');

    console.log('Sending message:', { userMessage, sessionId: currentSession.id });

    try {
      // 사용자 메시지 전송
      console.log('Sending user message...', { userMessage, sessionId: currentSession.id });
      await sendMessage(
        currentSession.id,
        'USER' as MessageSenderType,
        userMessage,
        'TEXT' as MessageType
      );
      console.log('User message sent, current messages after send:', messagesRef.current);

      // AI 응답 생성
      console.log('Generating AI response...');
      await generateAiResponse(currentSession.id, userMessage);
      console.log('AI response generated, current messages after AI:', messagesRef.current);

      // 메시지 목록 다시 조회하여 최신 상태 동기화
      console.log('Refreshing messages...');
      await getMessages(currentSession.id);
      console.log('Messages refreshed, final messages:', messagesRef.current);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // 엔터키로 메시지 전송
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 메시지 포맷팅
  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  // 버튼 그룹 렌더링
  const renderButtonGroup = (message: any) => {
    try {
      const metadata = JSON.parse(message.metadata || '{}');
      const options = metadata.options || [];
      
      if (options.length === 0) return null;

      return (
        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleButtonClick(option, message.sessionId)}
              className="px-3 py-2 bg-primary text-white text-xs rounded-lg hover:bg-secondary transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      );
    } catch (error) {
      console.error('Failed to parse button group metadata:', error);
      return null;
    }
  };

  // 버튼 클릭 처리
  const handleButtonClick = async (buttonText: string, sessionId: number) => {
    try {
      // 세션이 없으면 먼저 생성
      if (!currentSession && sessionId === 0 && user) {
        await createSession(
          user.id, 
          sessionType, 
          user.preferredLanguage || 'ko'
        );
        // 세션 생성 후 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // 현재 세션 ID 가져오기
      const targetSessionId = currentSession?.id;
      if (!targetSessionId) {
        console.error('No active session');
        return;
      }
      
      // 버튼 텍스트를 사용자 메시지로 전송
      await sendMessage(
        targetSessionId,
        'USER' as MessageSenderType,
        buttonText,
        'BUTTON' as MessageType
      );
      
      // AI 응답 생성
      await generateAiResponse(targetSessionId, buttonText);
      
      // 메시지 목록 새로고침
      await getMessages(targetSessionId);
    } catch (error) {
      console.error('Failed to handle button click:', error);
    }
  };

  return (
    <div className={`fixed bottom-5 right-5 z-[1000] ${className}`}>
      {/* 챗봇 토글 버튼 */}
      <button
        onClick={toggleChatbot}
        className="w-16 h-16 bg-gradient-primary to-secondary border-none rounded-full text-white cursor-pointer shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center hover:scale-110"
        aria-label="챗봇 열기"
      >
        <MessageCircle size={24} className="text-white" />
      </button>

      {/* 챗봇 윈도우 */}
      <div className={`absolute bottom-20 right-0 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex-col overflow-hidden ${
        isOpen ? 'flex' : 'hidden'
      }`}>
        {/* 헤더 */}
        <div className="bg-gradient-primary to-secondary text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot size={24} className="text-white" />
            <div className="font-semibold text-base">{title}</div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="bg-transparent border-none text-white cursor-pointer p-1 rounded transition-colors hover:bg-white hover:bg-opacity-20"
            aria-label="챗봇 닫기"
          >
            <X size={16} />
          </button>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
              <button
                onClick={clearError}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          )}
          
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle size={48} className="opacity-30 mb-4" />
              <div className="text-text-secondary">
                {welcomeMessage.split('\n').map((line, index) => (
                  <div key={index}>
                    {line}
                    {index < welcomeMessage.split('\n').length - 1 && <br />}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col max-w-[80%] ${
                  message.senderType === 'USER' ? 'self-end' : 'self-start'
                }`}
              >
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  message.senderType === 'USER' 
                    ? 'bg-gray-100 text-text-primary' 
                    : 'bg-gray-100 text-text-primary'
                }`}>
                  {formatMessage(message.messageContent)}
                  {/* 버튼 그룹 렌더링 */}
                  {message.messageType === 'BUTTON_GROUP' && renderButtonGroup(message)}
                </div>
                <div className={`text-xs text-text-secondary mt-1 ${
                  message.senderType === 'USER' ? 'text-right' : 'text-left'
                }`}>
                  {new Date(message.createdAt).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <div className="p-4 border-t border-gray-200 flex gap-3 items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-3xl outline-none text-sm transition-colors focus:border-primary"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || !currentSession}
            className="w-10 h-10 bg-primary border-none rounded-full text-white cursor-pointer flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="메시지 전송"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

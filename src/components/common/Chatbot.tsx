import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Bot, Send, X } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  title?: string;
  placeholder?: string;
  welcomeMessage?: string;
  className?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({
  title = "AI 무역 어시스턴트",
  placeholder = "메시지를 입력하세요...",
  welcomeMessage = "AI 어시스턴트가 상품 등록을 도와드립니다.\n궁금한 점이 있으시면 언제든 문의하세요!",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 메시지 목록 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 챗봇 열기/닫기
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      // 첫 번째 열기 시 환영 메시지 추가
      console.log('Adding welcome message');
      addBotMessage(welcomeMessage);
    }
  };

  // 봇 메시지 추가
  const addBotMessage = (content: string) => {
    console.log('addBotMessage called with:', content);
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content,
      timestamp: new Date()
    };
    console.log('New bot message:', newMessage);
    setMessages(prev => {
      const updated = [...prev, newMessage];
      console.log('Updated messages array:', updated);
      return updated;
    });
  };

  // 사용자 메시지 추가
  const addUserMessage = (content: string) => {
    console.log('addUserMessage called with:', content);
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    console.log('New user message:', newMessage);
    setMessages(prev => {
      const updated = [...prev, newMessage];
      console.log('Updated messages array:', updated);
      return updated;
    });
  };

  // 메시지 전송
  const sendMessage = () => {
    console.log('sendMessage called, inputValue:', inputValue);
    if (!inputValue.trim()) {
      console.log('Input is empty, returning');
      return;
    }

    console.log('Adding user message:', inputValue);
    addUserMessage(inputValue);
    
    // 간단한 봇 응답 (실제로는 API 호출)
    setTimeout(() => {
      const responses = [
        "네, 도움이 필요하시군요! 어떤 부분에 대해 궁금하신가요?",
        "상품 등록에 대해 질문이 있으시면 언제든 말씀해주세요.",
        "HS코드나 관세 관련 정보가 필요하시면 도와드릴 수 있습니다.",
        "더 자세한 정보가 필요하시면 구체적으로 말씀해주세요."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      console.log('Adding bot response:', randomResponse);
      addBotMessage(randomResponse);
    }, 1000);

    setInputValue('');
  };

  // 엔터키로 메시지 전송
  const handleKeyDown = (e: React.KeyboardEvent) => {
    console.log('Key pressed:', e.key);
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log('Enter key pressed, calling sendMessage');
      sendMessage();
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
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle size={48} className="opacity-30 mb-4" />
              <p className="text-text-secondary">
                {formatMessage(welcomeMessage)}
              </p>
            </div>
          ) : (
            messages.map((message) => {
              console.log('Rendering message:', message);
              return (
                <div
                  key={message.id}
                  className={`flex flex-col max-w-[80%] ${
                    message.type === 'user' ? 'self-end' : 'self-start'
                  }`}
                >
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-primary to-secondary text-white' 
                      : 'bg-gray-100 text-text-primary'
                  }`}>
                    {formatMessage(message.content)}
                  </div>
                  <div className={`text-xs text-text-secondary mt-1 ${
                    message.type === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              );
            })
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
            onClick={() => {
              console.log('Send button clicked');
              sendMessage();
            }}
            disabled={!inputValue.trim()}
            className="w-10 h-10 bg-primary border-none rounded-full text-white cursor-pointer flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="메시지 전송"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

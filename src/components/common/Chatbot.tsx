import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Bot, Send, X, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import type { ChatSessionType } from '../../types';

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
  const [responses, setResponses] = useState<Array<{ sender: string; message: string }>>([]);
  const [streaming, setStreaming] = useState(false);

  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isAuthenticated } = useAuthStore();

  // 메시지 목록 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [responses]);

  // WebSocket 연결
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;

    // WebSocket 연결
    ws.current = new WebSocket("ws://localhost:8081/ws/chat");

    ws.current.onopen = () => {
      console.log("WebSocket 연결됨");
    };

    // 서버에서 메시지 수신 처리
    ws.current.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (err) {
        console.error("JSON 파싱 실패:", event.data);
        return;
      }

      console.log("서버로부터 받은 메시지:", data);

      setStreaming(true); // 응답 중일 때 상태 업데이트

      // 메시지를 상태에 추가 (계속해서 이어붙이기)
      if (data.message !== "SOCKET_CLOSE") {
        setResponses((prev) => {
          const newResponses = [...prev];
          const lastMessage = newResponses.pop();
          const updatedMessage = {
            ...lastMessage,
            message: lastMessage!.message + ' ' + data.message,
          };
          newResponses.push(updatedMessage);
          return newResponses;
        });
      }

      // 서버에서 종료 메시지 판단
      if (data.message === "SOCKET_CLOSE") {
        console.log("응답 끝: SOCKET_CLOSE 메시지 받음!");
        setStreaming(false);
      }
    };

    // WebSocket 연결 종료 처리
    ws.current.onclose = () => {
      console.log("WebSocket 연결 종료");
    };

    return () => {
      ws.current?.close();
    };
  }, [isOpen, isAuthenticated]);

  // 로그아웃 시 챗봇 닫기
  useEffect(() => {
    if (!isAuthenticated) {
      setIsOpen(false);
      setResponses([]);
    }
  }, [isAuthenticated]);

  // 챗봇 열기/닫기
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  // 메시지 전송 처리
  const handleSendMessage = () => {
    if (!inputValue.trim() || !ws.current || ws.current.readyState !== 1 || streaming) {
      return; // 전송 불가능한 경우
    }

    // 사용자의 메시지 추가
    setResponses((prev) => [...prev, { sender: "user", message: inputValue }]);

    // 챗봇 응답 자리 확보
    setResponses((prev) => [...prev, { sender: "chatbot", message: "" }]);

    setStreaming(true); // 응답 대기 상태로 설정
    ws.current.send(inputValue); // WebSocket으로 메시지 전송
    setInputValue(""); // 입력창 초기화
  };

  // 엔터키로 메시지 전송
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !(e.nativeEvent as any).isComposing) {
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
      <div className={`absolute bottom-20 right-0 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex-col overflow-hidden ${isOpen ? 'flex' : 'hidden'
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
          {responses.length === 0 ? (
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
            responses.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'self-end' : 'self-start'
                  }`}
              >
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text-primary'
                  }`}>
                  <strong>{msg.sender === "user" ? "당신 😊" : "AI 👽"}: </strong>
                  {formatMessage(msg.message)}
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
            placeholder={streaming ? "응답이 끝날 때까지 기다려주세요..." : placeholder}
            disabled={streaming}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-3xl outline-none text-sm transition-colors focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={streaming}
            className="w-10 h-10 bg-primary border-none rounded-full text-white cursor-pointer flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="메시지 전송"
          >
            {streaming ? (
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
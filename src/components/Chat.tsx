import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import { generateResponse } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const { logout } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Olá! Sou o assistente da Shopee. Como posso te ajudar hoje?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Envie apenas o histórico a partir da primeira mensagem do usuário
      const firstUserIdx = updatedMessages.findIndex(msg => msg.isUser);
      const history = updatedMessages
        .slice(firstUserIdx)
        .map(msg => ({
          content: msg.content,
          isUser: msg.isUser
        }));

      const aiResponse = await generateResponse(content, history);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.text,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-shopee-orange to-shopee-orange-light text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-shopee-orange"
              fill="currentColor"
            >
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4L19 9Z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-lg">Chat Shopee</h2>
            <p className="text-sm text-orange-100">Assistente Virtual</p>
          </div>
        </div>
        <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Sair</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-shopee-gray-light to-white">
        {messages.map((message) => (
          <Message
            key={message.id}
            content={message.content}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
        
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-shopee-orange flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                >
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4L19 9Z" />
                </svg>
              </div>
              <div className="bg-shopee-gray-light rounded-2xl px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-shopee-gray-medium rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-shopee-gray-medium rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-shopee-gray-medium rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
};

export default Chat;

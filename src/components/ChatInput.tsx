
import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-4 bg-white border-t border-shopee-gray-light">
      <div className="flex-1 relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem..."
          disabled={disabled}
          className="w-full px-4 py-2 pr-12 rounded-full border border-shopee-gray-light focus:outline-none focus:ring-2 focus:ring-shopee-orange focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="bg-shopee-orange hover:bg-shopee-orange-dark disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};

export default ChatInput;

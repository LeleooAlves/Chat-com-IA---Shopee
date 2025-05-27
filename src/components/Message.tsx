
import React from 'react';

interface MessageProps {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Message: React.FC<MessageProps> = ({ content, isUser, timestamp }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div className={`flex max-w-xs lg:max-w-md ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
        {!isUser && (
          <div className="flex-shrink-0 mr-2">
            <div className="w-8 h-8 rounded-full bg-shopee-orange flex items-center justify-center animate-bounce-in">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-white"
                fill="currentColor"
              >
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4L19 9Z" />
              </svg>
            </div>
          </div>
        )}
        
        <div
          className={`px-4 py-2 rounded-2xl ${
            isUser
              ? 'bg-shopee-orange text-white rounded-br-sm'
              : 'bg-shopee-gray-light text-shopee-gray-dark rounded-bl-sm'
          } shadow-sm max-w-full break-words`}
        >
          <p className="text-sm">{content}</p>
          <p className={`text-xs mt-1 ${isUser ? 'text-orange-100' : 'text-shopee-gray-medium'}`}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        
        {isUser && (
          <div className="flex-shrink-0 ml-2">
            <div className="w-8 h-8 rounded-full bg-shopee-gray-medium flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-white"
                fill="currentColor"
              >
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;

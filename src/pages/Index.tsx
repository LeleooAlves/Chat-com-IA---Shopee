
import React from 'react';
import Chat from '../components/Chat';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-shopee-orange-light via-shopee-orange to-shopee-orange-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md h-[600px]">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Shopee Chat</h1>
          <p className="text-orange-100">Seu assistente virtual está aqui para ajudar!</p>
        </div>
        <Chat />
      </div>
    </div>
  );
};

export default Index;

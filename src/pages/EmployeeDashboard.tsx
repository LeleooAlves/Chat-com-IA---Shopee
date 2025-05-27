import React from 'react';
import { useAuth } from '../context/AuthContext';
import Chat from '../components/Chat';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md h-[600px]">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Shopee Chat</h1>
          <p className="text-gray-600">Seu assistente virtual está aqui para ajudar!</p>
        </div>
        <Chat />
      </div>
    </div>
  );
};

export default EmployeeDashboard; 
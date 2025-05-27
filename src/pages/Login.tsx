import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isAdmin = email === 'chat@shopeeia.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(email, isAdmin ? password : undefined);
    if (ok) {
      if (isAdmin) navigate('/admin');
      else navigate('/employee');
    } else {
      setError('Credenciais inválidas.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        {isAdmin && (
          <input
            type="password"
            placeholder="Senha (admin)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
            required
          />
        )}
        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition">Entrar</button>
      </form>
    </div>
  );
};

export default Login; 
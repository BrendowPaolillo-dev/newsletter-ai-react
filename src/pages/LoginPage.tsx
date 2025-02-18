import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');

  const navigate = useNavigate();

  // Função para validar o login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/logins.json');
      if (!response.ok) {
        throw new Error('Erro ao carregar dados de login.');
      }

      const users = await response.json();
      const user = users.find(
        (u: { email: string; password: string }) => u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem('userEmail', user.email);
        setLoginError(false);
        setLoginErrorMessage('');
        navigate('/admin'); // Redireciona para a página do administrador
      } else {
        setLoginError(true);
        setLoginErrorMessage('E-mail ou senha inválidos.');
      }
    } catch (error) {
      console.error('Erro ao validar login:', error);
      setLoginError(true);
      setLoginErrorMessage('Erro ao acessar o servidor. Tente novamente.');
    }
  };

  const forgotPassword = () => {
    alert('Funcionalidade de recuperação de senha não implementada.');
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-gray-100 p-6 rounded-lg shadow-md" style={{ maxWidth: '400px' }}>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Login 📰🤖</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Input de E-mail */}
          <div>
            <label htmlFor="email" className="block text-gray-700">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring ${
                loginError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>

          {/* Input de Senha */}
          <div>
            <label htmlFor="password" className="block text-gray-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring ${
                loginError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>

          {/* Mensagem de Erro */}
          {loginError && (
            <p className="text-red-500 text-sm">{loginErrorMessage}</p>
          )}

          {/* Botão de Login */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Entrar
          </button>

          {/* Esqueceu a Senha */}
          <div className="text-center mt-4">
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={forgotPassword}
            >
              Esqueceu sua senha?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

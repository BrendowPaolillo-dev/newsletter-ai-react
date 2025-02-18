import React, { useState } from 'react';
import config from '../utils/config';

const HomePage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);

  // Validação de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Lidar com a inscrição
  const handleSubscription = async () => {
    if (email === '') {
      setEmailError(true);
      setEmailErrorMessage('O campo de e-mail não pode estar vazio.');
      return;
    } else if (!isValidEmail(email)) {
      setEmailError(true);
      setEmailErrorMessage('Por favor, insira um e-mail válido.');
      return;
    }

    try {
      setEmailError(false);
      setEmailErrorMessage('');

      // Requisição para o backend
      const response = await fetch(`${config.apiUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Erro ao processar a inscrição.');
      }

      setDialogVisible(true);
      setEmail('');
    } catch (error) {
      console.error('Erro ao inscrever-se:', error);
      setEmailError(true);
      setEmailErrorMessage(
        'Ocorreu um erro ao processar sua inscrição. Tente novamente mais tarde.'
      );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Link "últimas notícias" */}
      <p className="ml-[25px] mt-[10px]">
        <a
          href="/news"
          className="cursor-pointer mb-4 hover:underline hover:text-blue-500 text-lg"
        >
          Últimas notícias
        </a>
      </p>

      {/* Conteúdo principal */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center sm:text-left">
        <div className="text-center sm:text-left">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Newsletter Engenharia de IA 📰🤖
          </h1>
          <p className="text-gray-600 text-center text-lg">
            Receba as melhores atualizações sobre nossa célula diretamente no
            seu email!
          </p>
        </div>

        {/* Formulário de Inscrição */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start mt-8 gap-2 w-full sm:w-auto">
          <div className="flex flex-col w-full sm:w-64">
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-300 ${emailError ? 'border-red-500' : ''
                }`}
            />
            <p className="text-red-500 text-sm h-5 mt-1">
              {emailError ? emailErrorMessage : ''}
            </p>
          </div>
          <button
            onClick={handleSubscription}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Inscreva-se
          </button>
        </div>
      </main>

      {/* Diálogo de Confirmação */}
      {dialogVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 text-center">
            <h4 className="text-lg font-bold text-green-600">
              Inscrição confirmada!
            </h4>
            <p>
              Veja também nossas{' '}
              <a href="/news" className="text-blue-500 underline">
                últimas notícias
              </a>
              .
            </p>
            <button
              onClick={() => setDialogVisible(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

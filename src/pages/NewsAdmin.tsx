import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from '../utils/config';

interface News {
  id: number;
  title: string;
}

const NewsAdmin: React.FC = () => {
  const [newsData, setNewsData] = useState<News[]>([]);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Função para buscar as notícias
    const fetchNews = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/news`); // Ajuste a rota conforme necessário
        const data = await response.json();
        setNewsData(data);
      } catch (error) {
        console.error('Erro ao buscar notícias:', error);
      }
    };

    fetchNews();
  }, []);

  // Truncar texto
  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

  // Alternar menu de contexto
  const toggleMenu = (id: number) => {
    setShowMenu(showMenu === id ? null : id);
  };

  // Fechar o menu ao clicar fora
  const closeMenu = () => {
    setShowMenu(null);
  };

  // Editar notícia
  const editNews = (id: number) => {
    navigate(`/admin/posts/${id}/edit`);
  };

  // Criar nova postagem
  const createNewPost = () => {
    navigate('/admin/posts/new');
  };

  // Excluir postagem
  const deletePost = async (id: number) => {
    if (window.confirm('Tem certeza que deseja apagar esta publicação?')) {
      try {
        await fetch(`${config.apiUrl}/news/${id}`, { method: 'DELETE' }); // Ajuste a rota conforme necessário
        setNewsData((prevData) => prevData.filter((news) => news.id !== id));
      } catch (error) {
        console.error('Erro ao apagar publicação:', error);
      }
    }
  };

  return (
    <div
      className="p-8 min-h-screen flex flex-col"
      onClick={closeMenu}
    >
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Publicações</h1>
      <hr className="border-b-2 border-gray-400 rounded" />
      <ol className="list-decimal pl-5 mt-4 text-justify">
        {newsData.map((news, index) => (
          <li
            key={news.id}
            className="mb-2 flex flex-col w-full group"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">{index + 1}.</span>
                <span className="cursor-pointer hover:underline hover:text-blue-500 text-lg">
                  <button
                    onClick={() => navigate(`/news/${news.id}`)}
                    className="text-left"
                  >
                    {truncateText(news.title, 255)}
                  </button>
                </span>
              </div>
              {/* Botão de opções para administradores */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu(news.id);
                  }}
                  className="text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FontAwesomeIcon icon="ellipsis-vertical" />
                </button>
                {showMenu === news.id && (
                  <div className="absolute bg-white shadow-md rounded p-2 mt-2 right-0 z-10 border">
                    <button
                      onClick={() => editNews(news.id)}
                      className="flex gap-2 text-blue-500 hover:underline w-full text-left"
                    >
                      <FontAwesomeIcon icon="edit" /> <span>Editar</span>
                    </button>
                    <button
                      onClick={() => deletePost(news.id)}
                      className="flex gap-2 text-red-500 hover:underline w-full text-left mt-2"
                    >
                      <FontAwesomeIcon icon="trash-alt" /> <span>Apagar</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Linha separadora */}
            {index < newsData.length - 1 && (
              <hr className="mt-2 border-t border-gray-300" />
            )}
          </li>
        ))}
      </ol>
      <div className="relative">
        <button
          onClick={createNewPost}
          className="fixed bottom-10 right-10 shadow-lg flex items-center justify-center bg-blue-500 text-white rounded-full w-9 h-9 hover:bg-blue-600 transition"
          title="Nova publicação"
        >
          <FontAwesomeIcon icon="plus" />
        </button>
      </div>
    </div>
  );
};

export default NewsAdmin;

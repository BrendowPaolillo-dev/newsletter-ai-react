import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../utils/config';

interface News {
  id: string;
  title: string;
}

const NewsPage: React.FC = () => {
  const [newsData, setNewsData] = useState<News[]>([]);

  // Função para truncar texto
  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

  // Buscar as notícias ao montar o componente
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/news`);
        const data = await response.json();
        setNewsData(data);
      } catch (error) {
        console.error('Erro ao buscar notícias:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="py-10 px-40 bg-gray-100 min-h-screen flex flex-col">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Publicações</h1>
      <hr className="border-b-2 border-gray-400 rounded" />
      <ol className="list-decimal pl-5 mt-4 text-justify">
        {newsData.map((news, index) => (
          <li
            key={news.id}
            className="cursor-pointer mb-4 hover:underline hover:text-blue-500 text-lg"
          >
            <Link to={`/news/${news.id}`}>
              {truncateText(news.title, 255)}
            </Link>
            {index < newsData.length - 1 && (
              <hr className="mt-1 border-t-2 border-gray-300" />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default NewsPage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import markdownIt from '../utils/markdownItConfig';
import config from '../utils/config';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faChevronDown } from "@fortawesome/free-solid-svg-icons";

interface News {
  id: string;
  title: string;
  body: string;
}

interface Feedback {
  id: string;
  email: string;
  feedback: string;
  stars: number;
}

const NewsItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [compiledMarkdown, setCompiledMarkdown] = useState<string>('');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [showFeedbacks, setShowFeedbacks] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verificar se o usuário é admin
    const userData = localStorage.getItem('userEmail');
    console.log(userData);
    if (userData) {
      try {
        setIsAdmin(true);
      } catch (error) {
        console.error('Erro ao analisar dados do usuário:', error);
      }
    }

    // Buscar dados da notícia e feedbacks
    const fetchData = async () => {
      try {
        const newsResponse = await fetch(`${config.apiUrl}/news/${id}`);
        if (!newsResponse.ok) throw new Error('Erro ao buscar notícia');
        const newsData = await newsResponse.json();

        const feedbacksResponse = await fetch(`${config.apiUrl}/news/${id}/feedbacks`);
        if (!feedbacksResponse.ok) throw new Error('Erro ao buscar feedbacks');
        const feedbacksData = await feedbacksResponse.json();

        setNews(newsData);
        setCompiledMarkdown(markdownIt.render(newsData.body || ''));
        setFeedbacks(feedbacksData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    if (id) fetchData();
  }, [id]);

  const renderStars = (stars: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <FontAwesomeIcon
            key={index}
            icon={faStar}
            className={`text-sm ${index < stars ? "text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="py-10 px-10 sm:px-40 bg-gray-100 min-h-screen flex flex-col">
      {/* Seção da Notícia */}
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-justify">
          {news?.title}
        </h1>
        <hr className="border-b-2 border-gray-400 rounded mb-6" />
        <div
          className="max-w-full text-justify prose prose-sm sm:prose-lg pt-5"
          dangerouslySetInnerHTML={{ __html: compiledMarkdown }}
        />
      </div>

      {/* Seção de Feedbacks (Dropdown) */}
      <div className="mt-12">
        <button
          onClick={() => setShowFeedbacks(!showFeedbacks)}
          className="w-full flex justify-between items-center bg-white p-4 rounded-t-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-2xl font-semibold text-gray-800">
            Feedbacks ({feedbacks.length})
          </h2>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`text-gray-600 transition-transform ${showFeedbacks ? 'rotate-180' : ''}`}
          />
        </button>

        {showFeedbacks && (
          <div className="bg-white p-4 rounded-b-lg border border-t-0 border-gray-200 shadow-sm">
            <div className="grid gap-4">
              {feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-700">{feedback.email}</h3>
                    </div>
                    {renderStars(feedback.stars)}
                  </div>
                  <p className="text-gray-600 mt-2">{feedback.feedback}</p>
                </div>
              ))}

              {feedbacks.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  Nenhum feedback enviado ainda
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Botão de Feedback Fixo (só aparece se não for admin) */}
      {!isAdmin && (
        <div className="fixed bottom-4 right-4">
          <a
            href={`${id}/feedback/`}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition cursor-pointer text-lg flex items-center gap-2"
          >
            Enviar feedback
            <FontAwesomeIcon icon={faStar} className="text-yellow-300" />
          </a>
        </div>
      )}
    </div>
  );
};

export default NewsItemPage;
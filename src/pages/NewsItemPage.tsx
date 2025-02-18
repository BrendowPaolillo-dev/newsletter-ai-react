import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import markdownIt from '../utils/markdownItConfig';
import config from '../utils/config';

interface News {
  id: string;
  title: string;
  body: string;
}

const NewsItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [compiledMarkdown, setCompiledMarkdown] = useState<string>('');

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/news/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar notícia');
        }
        const data = await response.json();
        setNews(data);
        setCompiledMarkdown(markdownIt.render(data.body || ''));
      } catch (error) {
        console.error('Erro ao buscar notícia:', error);
      }
    };

    if (id) {
      fetchNewsItem();
    }
  }, [id]);

  return (
    <div className="py-10 px-10 sm:px-40 bg-gray-100 min-h-screen flex flex-col">
      <h1 className="text-4xl font-bold text-gray-800 mb-2 text-justify w-fit">
        {news?.title}
      </h1>
      <hr className="border-b-2 border-gray-400 rounded" />
      <div
        className="max-w-full text-justify w-fit prose prose-sm sm:prose-lg pt-5"
        dangerouslySetInnerHTML={{ __html: compiledMarkdown }}
      />
    </div>
  );
};

export default NewsItemPage;

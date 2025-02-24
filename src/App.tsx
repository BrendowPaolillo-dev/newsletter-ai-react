import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel';
import AdminLayout from './layouts/AdminLayout';
import NewsAdmin from './pages/NewsAdmin';
import PostEditorPage from './pages/PostEditorPage';
import NewsPage from './pages/NewsPage';
import NewsItemPage from './pages/NewsItemPage';
import FeedbackPage from "./pages/FeedbackPage";

const App: React.FC = () => {
  useEffect(() => {
    // Lista de emojis para alternar
    const emojis = ['📰', '🤖'];
    let currentEmojiIndex = 0;

    // Função para alterar o favicon
    const switchFavicon = () => {
      const favicon = document.getElementById('dynamic-favicon') as HTMLLinkElement;
      if (favicon) {
        favicon.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emojis[currentEmojiIndex]}</text></svg>`;
        currentEmojiIndex = (currentEmojiIndex + 1) % emojis.length;
      }
    };

    // Alternar o favicon a cada 1 segundo
    const intervalId = setInterval(switchFavicon, 1000);

    // Limpar intervalo ao desmontar o componente
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="news/:id/feedback" element={<FeedbackPage />} />
        <Route path="/news/:id" element={<NewsItemPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<AdminPanel />} />
          <Route path="/admin/posts" element={<NewsAdmin />} />
          <Route path="/admin/posts/new" element={<PostEditorPage />} />
          <Route path="/admin/posts/:id/edit" element={<PostEditorPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

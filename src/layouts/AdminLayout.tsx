import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const AdminLayout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const adminList = [
    {
      title: 'Painel Administrativo',
      caption: 'Gerencie o sistema',
      icon: 'tachometer-alt' as IconProp,
      link: '/admin',
    },
    {
      title: 'Postagens',
      caption: 'Gerencie as postagens do site',
      icon: 'newspaper' as IconProp,
      link: '/admin/posts',
    },
    {
      title: 'Estatísticas',
      caption: 'Veja as métricas do site',
      icon: 'chart-bar' as IconProp,
      link: '/admin/stats',
      separator: true,
    },
    {
      title: 'Sair',
      icon: 'sign-out-alt' as IconProp,
      separator: true,
      btnAction: 'logout',
    },
  ];

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleAction = (action: string) => {
    if (action === 'logout') {
      localStorage.removeItem('userEmail');
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gray-100 shadow p-4 flex items-center">
        <button
          className="text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={toggleDrawer}
          title="Abrir Menu" // Adiciona um atributo de título para acessibilidade
          aria-label="Abrir Menu" // Adiciona uma descrição para leitores de tela
        >
          <FontAwesomeIcon icon="bars" size="lg" />
        </button>
        <h1 className="ml-auto text-lg font-bold">Painel Administrativo 📰🤖</h1>
      </header>

      {/* Drawer (Sidebar) */}
      <Sidebar
        isOpen={drawerOpen}
        items={adminList}
        onClose={toggleDrawer}
        onAction={handleAction}
      />

      {/* Conteúdo */}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

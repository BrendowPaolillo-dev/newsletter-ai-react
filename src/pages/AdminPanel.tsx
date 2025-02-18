import React, { useEffect, useState } from 'react';

interface Stats {
  clicks: number;
  averageTime: number;
  onlineUsers: number;
}

interface RecentLogin {
  email: string;
  time: string;
}

const AdminPanel: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>('');
  const [stats, setStats] = useState<Stats>({
    clicks: 0,
    averageTime: 0,
    onlineUsers: 0,
  });
  const [recentLogins, setRecentLogins] = useState<RecentLogin[]>([]);

  // Função para carregar dados simulados
  const loadAdminData = async () => {
    try {
      // Simular dados de estatísticas
      setStats({
        clicks: 1023,
        averageTime: 5.4,
        onlineUsers: 12,
      });

      // Simular dados de últimos logins
      setRecentLogins([
        { email: 'user1@example.com', time: '10:15 AM' },
        { email: 'admin@example.com', time: '9:45 AM' },
        { email: 'john.doe@example.com', time: '8:30 AM' },
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados administrativos:', error);
    }
  };

  // Simular usuário autenticado
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);
    loadAdminData();
  }, []);

  return (
    <div className="min-h-screen p-6 text-gray-800">
      <h4 className="text-2xl font-bold mb-4">Painel Administrativo</h4>
      <p className="mb-6">
        Bem-vindo ao painel, <strong>{userEmail}</strong>.
      </p>

      <hr className="my-6" />

      <div className="space-y-6">
        {/* Estatísticas do Site */}
        <div className="bg-gray-100 p-4 rounded-md shadow-md">
          <h5 className="text-lg font-semibold mb-2">Estatísticas do Site</h5>
          <ul>
            <li>
              <strong>Cliques Totais:</strong> {stats.clicks}
            </li>
            <li>
              <strong>Tempo Médio de Acesso:</strong> {stats.averageTime} minutos
            </li>
            <li>
              <strong>Usuários Online:</strong> {stats.onlineUsers}
            </li>
          </ul>
        </div>

        {/* Últimos Logins */}
        <div className="bg-gray-100 p-4 rounded-md shadow-md">
          <h5 className="text-lg font-semibold mb-2">Últimos Logins</h5>
          <ul>
            {recentLogins.map((login, index) => (
              <li key={index}>
                {login.email} - {login.time}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

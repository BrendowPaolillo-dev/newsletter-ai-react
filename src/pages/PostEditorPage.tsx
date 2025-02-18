import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../utils/config';

interface FormState {
  title: string;
  body: string;
  subject: string;
  emailBody: string;
}

const PostEditorPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: '',
    body: '',
    subject: '',
    emailBody: '',
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Função para carregar os dados da publicação ao editar
  const loadPostData = useCallback(async () => {
    if (id) {
      setIsEditing(true);
      try {
        const response = await fetch(`${config.apiUrl}/news/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao carregar publicação');
        }
        const data = await response.json();
        setForm({
          title: data.title || '',
          body: data.body || '',
          subject: data.subject || '',
          emailBody: data.emailBody || '',
        });
      } catch (error) {
        console.error('Erro ao carregar publicação:', error);
      }
    }
  }, [id]);

  useEffect(() => {
    loadPostData();
  }, [loadPostData]);

  // Lidar com o envio do formulário
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const endpoint = isEditing ? `/news/${id}` : '/news';
      const method = isEditing ? 'PATCH' : 'POST';
      const response = await fetch(config.apiUrl + endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar publicação');
      }

      setDialogVisible(true);
      setTimeout(() => {
        navigate(-1); // Volta para a página anterior
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar publicação:', error);
    }
  };

  // Cancelar e voltar para a página anterior
  const handleCancel = () => {
    navigate(-1);
  };

  // Atualizar estado do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="w-full max-w-4xl bg-white p-6 rounded-md shadow">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          {isEditing ? 'Editar conteúdo' : 'Publicar novo conteúdo'}
        </h1>
        <hr className="border-b-2 border-gray-400 mb-4 rounded" />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-600 font-medium mb-2">
              Título
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Digite o título"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="body" className="block text-gray-600 font-medium mb-2">
              Corpo da publicação
            </label>
            <textarea
              id="body"
              name="body"
              rows={6}
              value={form.body}
              onChange={handleChange}
              placeholder="Escreva o conteúdo"
              className="w-full p-2 border rounded-md"
            />
          </div>
          {!isEditing && (
            <>
              <div className="mb-6">
                <label htmlFor="subject" className="block text-gray-600 font-medium mb-2">
                  Assunto
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Digite o assunto do e-mail"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="emailBody" className="block text-gray-600 font-medium mb-2">
                  Corpo do e-mail
                </label>
                <textarea
                  id="emailBody"
                  name="emailBody"
                  rows={6}
                  value={form.emailBody}
                  onChange={handleChange}
                  placeholder="Escreva o conteúdo do e-mail"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </>
          )}
          <hr className="border-b-2 border-gray-400 mb-4 rounded" />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {isEditing ? 'Salvar' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
      {dialogVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 text-center">
            <h4 className="text-lg font-bold text-green-600">
              {isEditing ? 'Publicação atualizada!' : 'Publicação criada!'}
            </h4>
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

export default PostEditorPage;

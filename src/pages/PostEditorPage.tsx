import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../utils/config';

interface FormState {
  title: string;
  body: string;
  subject: string;
  emailBody: string;
}

interface FormErrors {
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
  const [errors, setErrors] = useState<FormErrors>({
    title: '',
    body: '',
    subject: '',
    emailBody: '',
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const validateForm = () => {
    const newErrors: FormErrors = {
      title: '',
      body: '',
      subject: '',
      emailBody: '',
    };
    let isValid = true;

    // Validações comuns para edição e criação
    if (!form.title.trim()) {
      newErrors.title = 'Título é obrigatório';
      isValid = false;
    } else if (form.title.trim().length < 5) {
      newErrors.title = 'Título deve ter pelo menos 5 caracteres';
      isValid = false;
    }

    if (!form.body.trim()) {
      newErrors.body = 'Corpo da publicação é obrigatório';
      isValid = false;
    } else if (form.body.trim().length < 20) {
      newErrors.body = 'O conteúdo deve ter pelo menos 20 caracteres';
      isValid = false;
    }

    // Validações específicas para nova publicação
    if (!isEditing) {
      if (!form.subject.trim()) {
        newErrors.subject = 'Assunto do e-mail é obrigatório';
        isValid = false;
      } else if (form.subject.trim().length < 5) {
        newErrors.subject = 'Assunto deve ter pelo menos 5 caracteres';
        isValid = false;
      }

      if (!form.emailBody.trim()) {
        newErrors.emailBody = 'Corpo do e-mail é obrigatório';
        isValid = false;
      } else if (form.emailBody.trim().length < 20) {
        newErrors.emailBody = 'O e-mail deve ter pelo menos 20 caracteres';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const loadPostData = useCallback(async () => {
    if (id) {
      setIsEditing(true);
      try {
        const response = await fetch(`${config.apiUrl}/news/${id}`);
        if (!response.ok) throw new Error('Erro ao carregar publicação');
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

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

      if (!response.ok) throw new Error('Erro ao salvar publicação');

      setDialogVisible(true);
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      console.error('Erro ao salvar publicação:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="w-full max-w-4xl bg-white p-6 rounded-md shadow">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          {isEditing ? 'Editar conteúdo' : 'Publicar novo conteúdo'}
        </h1>
        <hr className="border-b-2 border-gray-400 mb-4 rounded" />

        <form onSubmit={handleSubmit} noValidate>
          {/* Campo Título */}
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
              className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Campo Corpo da Publicação */}
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
              className={`w-full p-2 border rounded-md ${errors.body ? 'border-red-500' : ''}`}
            />
            {errors.body && <p className="text-red-500 text-sm mt-1">{errors.body}</p>}
          </div>

          {!isEditing && (
            <>
              {/* Campo Assunto do E-mail */}
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
                  className={`w-full p-2 border rounded-md ${errors.subject ? 'border-red-500' : ''}`}
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>

              {/* Campo Corpo do E-mail */}
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
                  className={`w-full p-2 border rounded-md ${errors.emailBody ? 'border-red-500' : ''}`}
                />
                {errors.emailBody && <p className="text-red-500 text-sm mt-1">{errors.emailBody}</p>}
              </div>
            </>
          )}

          <hr className="border-b-2 border-gray-400 mb-4 rounded" />

          {/* Botões */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
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

      {/* Modal de confirmação */}
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
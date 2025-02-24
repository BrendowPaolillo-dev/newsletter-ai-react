import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import config from '../utils/config';

interface FormState {
  email: string;
  feedback: string;
  stars: number;
}

interface FormErrors {
  email: string;
  feedback: string;
  stars: string;
}

const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [dialogVisible, setDialogVisible] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [emailFromQuery, setEmailFromQuery] = useState("");
  const [form, setForm] = useState<FormState>({
    email: "",
    feedback: "",
    stars: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    feedback: "",
    stars: "",
  });

  // Capturar email da query string ao carregar o componente
  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    if (emailFromQuery) {
      setForm(prev => ({
        ...prev,
        email: decodeURIComponent(emailFromQuery)
      }));
      setEmailFromQuery(decodeURIComponent(emailFromQuery))
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors: FormErrors = {
      email: "",
      feedback: "",
      stars: "",
    };

    let isValid = true;

    // Validar email
    if (!form.email.trim()) {
      newErrors.email = "Email é obrigatório";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email inválido";
      isValid = false;
    }

    // Validar feedback
    if (!form.feedback.trim()) {
      newErrors.feedback = "Feedback é obrigatório";
      isValid = false;
    }

    // Validar estrelas
    if (form.stars === 0) {
      newErrors.stars = "Avaliação é obrigatória";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const endpoint = `/news/${id}/feedback`;
      const response = await fetch(config.apiUrl + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar feedback');
      }

      setDialogVisible(true);
    } catch (error) {
      console.error('Erro ao salvar feedback:', error);
    }
  };

  const handleStars = (value: number) => {
    setForm(prev => ({
      ...prev,
      stars: value
    }));
    // Limpar erro ao selecionar estrelas
    setErrors(prev => ({ ...prev, stars: "" }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
    // Limpar erro ao modificar campo
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-2xl bg-white p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Enviar feedback</h1>
        <hr className="border-b-2 border-gray-400 mb-4 rounded" />

        <form onSubmit={handleSubmit} noValidate>
          {/* Campo de e-mail */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Digite seu email"
              className={`w-full p-2 border rounded-md ${errors.email ? "border-red-500" : ""}`}
              readOnly={!!searchParams.get('email')} // Campo somente leitura se veio da query string
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Campo de feedback */}
          <div className="mb-4">
            <label htmlFor="feedback" className="block text-gray-600 font-medium mb-2">
              Feedback
            </label>
            <textarea
              id="feedback"
              name="feedback"
              value={form.feedback}
              onChange={handleChange}
              placeholder="Escreva seu feedback aqui..."
              className={`w-full p-2 border rounded-md ${errors.feedback ? "border-red-500" : ""}`}
              rows={6}
            ></textarea>
            {errors.feedback && (
              <p className="text-red-500 text-sm mt-1">{errors.feedback}</p>
            )}
          </div>

          {/* Componente de Avaliação por Estrelas */}
          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2">
              Avaliação
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStars(star)}
                  className={`text-2xl ${star <= form.stars ? "text-yellow-500" : "text-gray-300"
                    } transition`}
                >
                  <FontAwesomeIcon icon={faStar} />
                </button>
              ))}
            </div>
            {errors.stars && (
              <p className="text-red-500 text-sm mt-1">{errors.stars}</p>
            )}
          </div>

          <hr className="border-b-2 border-gray-400 mb-4 rounded" />

          {/* Botões de Ação */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                if (!emailFromQuery) {
                  navigate(-1)
                } else {
                  navigate("/news")
                }
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>

      {/* Modal de sucesso */}
      {dialogVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 text-center">
            <h4 className="text-lg font-bold text-green-600">
              Feedback enviado!
            </h4>
            <p>
              Veja também nossas{' '}
              <a href="/news" className="text-blue-500 underline">
                últimas notícias
              </a>
              .
            </p>
            <button
              onClick={() => {
                if (!emailFromQuery) {
                  setDialogVisible(false);
                  navigate(-1)
                } else {
                  setDialogVisible(false);
                  navigate("/news")
                }
              }}
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

export default FeedbackPage;
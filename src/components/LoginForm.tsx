import React, { useState } from 'react';
import { useNavigate } from 'react-router';

interface UserLoginData {
  email: string,
  password: string;
}

interface ResponseState {
  message: string;
  type: 'success' | 'error' | null;
}

const API_URL = 'http://localhost:3002/api/users/login';

const LoginForm: React.FC = () => {
  let navigate = useNavigate()

  const [formData, setFormData] = useState<UserLoginData>({
    email: '',
    password: ''
  });
  const [response, setResponse] = useState<ResponseState>({ message: '', type: null });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponse({ message: '', type: null });

    if (!formData.email || !formData.password) {
        return setResponse({ message: 'Por favor, preencha todos os campos.', type: 'error' });
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setResponse({ 
          message: 'Login realizado com sucesso', 
          type: 'success' 
        });
        setFormData({ email: '', password: '' });
        navigate('/home')
      } else {
        setResponse({ 
          message: data.message || 'Falha no login. Verifique os dados.', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Erro na comunicação com a API:', error);
      setResponse({ 
        message: 'Erro de rede. Verifique se o backend está rodando na porta 3002.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <h1>Login Vida Plus</h1>
            <div>
                <label htmlFor="email">E-mail</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="password">Senha</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
          </div>

          {response.message && (
            <div>{response.message}</div>
          )}

          <button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
        </form>
    </div>
  );
};

export default LoginForm;
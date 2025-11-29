import React, { useState } from 'react';
import { useNavigate } from 'react-router';

//tipagem dos dados do formulário (mantendo o padrão do db)
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

  //criação e inicialização das variáveis do formulario
  const [formData, setFormData] = useState<UserLoginData>({
    email: '',
    password: ''
  });

  const [response, setResponse] = useState<ResponseState>({ message: '', type: null });

  const [loading, setLoading] = useState(false);

  //quando houver alteração em algum campo do formulário, o valor inserido é armazenado na variável formData
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //quando o formulário é enviado
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponse({ message: '', type: null });

    //se tiver dados faltando
    if (!formData.email || !formData.password) {
        return setResponse({ message: 'Por favor, preencha todos os campos.', type: 'error' });
    }

    setLoading(true);

    //executa o login via http post
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

      //se a resposta da api for ok, limpa o formulário e navega para a tela /home
      if (response.ok) {
        setResponse({ 
          message: 'Login realizado com sucesso!', 
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


  // ============ HTML ============
  return (
    <div>
        {/* formulário de login */}
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
        {/* fim do formulário de login */}
    </div>
  );
};

export default LoginForm;
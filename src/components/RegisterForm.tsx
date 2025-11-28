import React, { useState } from 'react';

interface UserRegistrationData {
  username: string;
  email: string,
  name: string;
  dob: string;
  genre: 'M' | 'F' | 'Outro' | '';
  password: string;
}

interface ResponseState {
  message: string;
  type: 'success' | 'error' | null;
}

const API_URL = 'http://localhost:3002/api/users/register';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<UserRegistrationData>({
    username: '',
    email: '',
    name: '',
    dob: '',
    genre: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [response, setResponse] = useState<ResponseState>({ message: '', type: null });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponse({ message: '', type: null });

    if (!formData.username || !formData.email || !formData.name || !formData.dob || !formData.genre || !formData.password) {
        return setResponse({ message: 'Por favor, preencha todos os campos.', type: 'error' });
    }

    if (formData.password !== confirmPassword) {
      return setResponse({ message: 'As senhas não coincidem.', type: 'error' });
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setResponse({ 
          message: 'Cadastro realizado com sucesso', 
          type: 'success' 
        });
        setFormData({ username: '', email: '', name: '', dob: '', genre: '', password: '' });
        setConfirmPassword('');
      } else {
        setResponse({ 
          message: data.message || 'Falha no cadastro. Verifique os dados.', 
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
      <h1>Cadastro Vida Plus</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Nome de usuário</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

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
          <label htmlFor="name">Nome completo</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            />
        </div>

        <div>
          <label htmlFor="dob">Data de nascimento</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
        </div>

        <div>
          <label htmlFor="genre">Gênero</label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
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

        <div>
          <label htmlFor="confirmPassword">Confirmar senha</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
        </div>

        {response.message && (
          <div>
            {response.message}
          </div>
        )}

        <button type="submit" disabled={loading}>{loading ? 'Cadastrando...' : 'Cadastrar'}</button>

      </form>
    </div>
  );
};

export default RegisterForm;
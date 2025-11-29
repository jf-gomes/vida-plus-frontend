import React, { useState } from 'react';

interface UserCreationData {
    username: string,
    email: string,
    password: string,
    name: string,
    genre: string,
    dob: string,
    role: string,
}

interface ResponseState {
  message: string;
  type: 'success' | 'error' | null;
}

const API_URL = 'http://localhost:3002/api/users/register';

const CreateUserForm: React.FC = () => {
  const [formData, setFormData] = useState<UserCreationData>({
    username: '',
    email: '',
    password: '',
    name: '',
    genre: 'M',
    dob: '',
    role: 'Patient',
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

    if (!formData.username || !formData.email || !formData.password || !formData.name || !formData.genre || !formData.dob || !formData.role) {
        return setResponse({ message: 'Por favor, preencha todos os campos.', type: 'error' });
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setResponse({ 
          message: 'Cadastro de usuário realizado com sucesso', 
          type: 'success' 
        });
        setFormData({ 
            username: '',
            email: '',
            password: '',
            name: '',
            genre: 'M',
            dob: '',
            role: '',
         });
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
    <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="username">Nome de usuário:</label>
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
          <label htmlFor="email">E-mail:</label>
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
          <label htmlFor="password">Senha:</label>
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
          <label htmlFor="name">Nome completo:</label>
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
          <label htmlFor="genre">Gênero:</label>
          <select name='genre' value={formData.genre} required onChange={handleChange}>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>

        <div>
          <label htmlFor="dob">Data de nascimento:</label>
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
          <label htmlFor="role">Tipo:</label>
          <select name='role' value={formData.role} required onChange={handleChange}>
            <option value="Patient">Paciente</option>
            <option value="HealthProfessional">Profissional de saúde</option>
            <option value="Admin">Administrador</option>
          </select>
        </div>

        {response.message && (
          <div>
            {response.message}
          </div>
        )}

        <button type="submit" disabled={loading}>{loading ? 'Inserindo...' : 'Inserir'}</button>

      </form>
  );
};

export default CreateUserForm;
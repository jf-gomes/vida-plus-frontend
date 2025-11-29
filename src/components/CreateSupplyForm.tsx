import React, { useState } from 'react';

//tipagem dos dados do formulário (mantendo o padrão do db)
interface SupplyCreationData {
  code: number,
  name: string;
  description: string;
  quantity: number
}

interface ResponseState {
  message: string;
  type: 'success' | 'error' | null;
}

const API_URL = 'http://localhost:3002/api/supplies/create';

const CreateSupplyForm: React.FC = () => {

  //cria e inicia a variávl que armazenará os dados do formulário
  const [formData, setFormData] = useState<SupplyCreationData>({
    code: 0,
    name: '',
    description: '',
    quantity: 0
  });
  const [response, setResponse] = useState<ResponseState>({ message: '', type: null });
  const [loading, setLoading] = useState(false);

  //quando houver mudança em algum campo do formulário, o valor inserido é armazenado na variável formData
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //executa a inserção dos dados via http post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponse({ message: '', type: null });

    if (!formData.code || !formData.name || !formData.description) {
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
          message: 'Cadastro de suprimento realizado com sucesso', 
          type: 'success' 
        });
        setFormData({ code: 0, name: '', description: '', quantity: 0 });
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
          <label htmlFor="code">Código:</label>
          <input
            type="number"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="name">Nome:</label>
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
          <label htmlFor="description">Descrição:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            />
        </div>

        <div>
          <label htmlFor="quantity">Quantidade:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            />
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

export default CreateSupplyForm;
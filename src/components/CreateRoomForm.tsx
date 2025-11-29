import React, { useState } from 'react';

//tipagem dos dados do formulário (mantendo o padrão do db)
interface RoomCreationData {
  number: number,
  type: string;
  capacity: number;
}

interface ResponseState {
  message: string;
  type: 'success' | 'error' | null;
}

const API_URL = 'http://localhost:3002/api/rooms/create';

const CreateRoomForm: React.FC = () => {

  //cria e inicia a variávl que armazenará os dados do formulário
  const [formData, setFormData] = useState<RoomCreationData>({
    number: 0,
    type: 'AppointmentRoom',
    capacity: 0,
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

    if (!formData.number || !formData.type || !formData.capacity) {
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
          message: 'Cadastro de quarto realizado com sucesso!', 
          type: 'success' 
        });
        setFormData({ number: 0, type: 'AppointmentRoom', capacity: 0 });
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
          <label htmlFor="number">Número do quarto:</label>
          <input
            type="number"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="type">Tipo de quarto:</label>
          <select name="type" id="type" onChange={handleChange}>
            <option value="AppointmentRoom">Sala de consulta</option>
            <option value="Hospitalization">Internação</option>
          </select>
        </div>

        <div>
          <label htmlFor="capacity">Capacidade:</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
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

export default CreateRoomForm;
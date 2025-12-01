import React, { useState } from 'react';

//tipagem dos dados do formulário (mantendo o padrão do db)
interface AppointmentCreationData {
    assignedTo: number,
    assignedBy: number,
    date: string,
    details: string,
    online: number,
    room: number,
}

interface ResponseState {
  message: string;
  type: 'success' | 'error' | null;
}

interface CreateAppointmentFormProps {
    onSuccess: () => void;
}

const API_URL = 'http://localhost:3002/api/appointments/';

const CreateAppointmentForm: React.FC<CreateAppointmentFormProps> = ({ onSuccess }) => {

  //cria e inicia a variávl que armazenará os dados do formulário
  const [formData, setFormData] = useState<AppointmentCreationData>({
        assignedTo: 0,
        assignedBy: 0,
        date: '',
        details: '',
        online: 0,
        room: 0
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
    console.log(formData)
    setResponse({ message: '', type: null });

    if (!formData.assignedTo || !formData.assignedBy || !formData.date || !formData.details || !formData.online || !formData.room) {
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
        onSuccess()
        setResponse({ 
          message: 'Cadastro de consulta realizado com sucesso!', 
          type: 'success' 
        });
        setFormData({
            assignedTo: 0,
            assignedBy: 0,
            date: '',
            details: '',
            online: 0,
            room: 0
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
            <label htmlFor="assignedTo">Paciente:</label>
            <input
                type="number"
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                required
            />
        </div>

        <div>
            <label htmlFor="assignedBy">Médico:</label>
            <input
                type="number"
                id="assignedBy"
                name="assignedBy"
                value={formData.assignedBy}
                onChange={handleChange}
                required
            />
        </div>

        <div>
            <label htmlFor="date">Data da consulta:</label>
            <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
            />
        </div>

        <div>
            <label htmlFor="details">Detalhes:</label>
            <input
                type="text"
                id="details"
                name="details"
                value={formData.details}
                onChange={handleChange}
                required
            />
        </div>

        <div>
            <label htmlFor="online">Virtual:</label>
            <select id="online" name="online" value={formData.online} onChange={handleChange} required>
                <option value={1}>Sim</option>
                <option value={0}>Não</option>
            </select>
        </div>

        <div>
            <label htmlFor="room">Sala:</label>
            <input
                type="number"
                id="room"
                name="room"
                value={formData.room}
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

export default CreateAppointmentForm;
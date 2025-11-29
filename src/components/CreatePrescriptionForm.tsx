import React, { useState } from 'react';

//tipagem dos dados do formulário (mantendo o padrão do db)
interface PrescriptionCreationData {
  assignedTo: number,
  assignedBy: number;
  details: string;
}

interface ResponseState {
  message: string;
  type: 'success' | 'error' | null;
}

const API_URL = 'http://localhost:3002/api/prescriptions/';

const CreatePrescriptionForm: React.FC = () => {

  //cria e inicia a variávl que armazenará os dados do formulário
  const [formData, setFormData] = useState<PrescriptionCreationData>({
    assignedTo: 0,
    assignedBy: 0,
    details: '',
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

    if (!formData.assignedTo || !formData.assignedBy || !formData.details) {
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
          message: 'Cadastro de receita realizado com sucesso!', 
          type: 'success' 
        });
        setFormData({ assignedTo: 0, assignedBy: 0, details: '' });
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
          <label htmlFor="patient">Paciente:</label>
          <input
            type="number"
            id="patient"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="healthProfessional">Médico:</label>
          <input
            type="number"
            id="healthProfessional"
            name="assignedBy"
            value={formData.assignedBy}
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

        {response.message && (
          <div>
            {response.message}
          </div>
        )}

        <button type="submit" disabled={loading}>{loading ? 'Inserindo...' : 'Inserir'}</button>

      </form>
  );
};

export default CreatePrescriptionForm;
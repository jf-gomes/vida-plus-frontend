import { useState, useEffect } from "react";

interface Prescription {
    id: number,
    assignedTo: number,
    assignedBy: number,
    details: string,
}

interface PrescriptionFormData {
    id: number,
    assignedTo: number,
    assignedBy: number,
    details: string,
}

interface ResponseState {
    message: string;
    type: 'success' | 'error' | null;
}

export default function Prescriptions(){

    const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
    
        useEffect(() => {
            fetch('http://localhost:3002/api/prescriptions', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha na requisição: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Dados recebidos:', data);
                setPrescriptions(data);
            })
            .catch(error => console.error('Erro ao buscar dados:', error));
    }, []);


    const [formData, setFormData] = useState<PrescriptionFormData>({
        id: 0,
        assignedTo: 0,
        assignedBy: 0,
        details: '',
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
    
        if (!formData.id || !formData.assignedTo || !formData.assignedBy || !formData.details) {
            return setResponse({ message: 'Por favor, preencha todos os campos.', type: 'error' });
        }
    
        setLoading(true);
    
        try {
            const response = await fetch("http://localhost:3002/api/prescriptions/" + formData.id, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });
    
          const data = await response.json();
    
        if (response.ok) {
            setResponse({ 
                message: 'Item alterado com sucesso', 
                type: 'success'
            });
            setFormData({ id: 0, assignedTo: 0, assignedBy: 0, details: '' });
            setIdToChange('')
          } else {
            setResponse({ 
                message: data.message || 'Ocorreu um erro. Verifique os dados.', 
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

    const [idToChange, setIdToChange] = useState('')

    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setIdToChange(e.target.value)
    };

    const handleSearch = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const idToSearch = idToChange.trim(); // Limpar espaços
    
        if (!idToSearch) {
            return setResponse({ message: 'Por favor, informe um ID válido.', type: 'error' });
        }
    
        setLoading(true);
        setResponse({ message: '', type: null });
    
        try {
            const response = await fetch("http://localhost:3002/api/prescriptions/" + idToSearch, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include',
          });
    
        const data: PrescriptionFormData = await response.json();
    
        if (response.ok) {
            
            setFormData({
                id: data.id,
                assignedTo: data.assignedTo,
                assignedBy: data.assignedBy,
                details: data.details,
            });

            setResponse({ 
                message: `Item ID ${data.id} buscado com sucesso. Preencha o resto do formulário para editar.`, 
                type: 'success'
            });
            
        } else {
            setResponse({ 
                message: `Ocorreu um erro ao buscar o ID ${idToSearch}.`, 
                type: 'error' 
            });
        }
        } catch (error) {
            console.error('Erro na comunicação com a API:', error);
            setResponse({ 
                message: 'Erro de rede. Verifique se o backend está rodando.', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePrescriptionDelete = async () => {

        const idToDelete = idToChange.trim(); // Limpar espaços
    
        if (!idToDelete) {
            return setResponse({ message: 'Por favor, informe um ID válido.', type: 'error' });
        }
    
        setLoading(true);
        setResponse({ message: '', type: null });
    
        try {
            const response = await fetch("http://localhost:3002/api/prescriptions/" + idToDelete, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include',
          });

          console.log(response)
    
        if (response.status == 204) {

            setResponse({ 
                message: 'Item deletado com sucesso.', 
                type: 'success'
            });
            
        } else {
            setResponse({ 
                message: 'Ocorreu um erro ao deletar o item.', 
                type: 'error' 
            });
        }
        } catch (error) {
            console.error('Erro na comunicação com a API:', error);
            setResponse({ 
                message: 'Erro de rede. Verifique se o backend está rodando.', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <h2>Receitas</h2>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Paciente</th>
                    <th>Médico responsável</th>
                    <th>Detalhes</th>
                </tr>
                {prescriptions.map((prescriptions, i) => (
                    <tr key={i} onClick={() => {
                        setIdToChange(prescriptions.id.toString())
                        handleSearch
                    }}>
                        <td>{prescriptions.id}</td>
                        <td>{prescriptions.assignedTo}</td>
                        <td>{prescriptions.assignedBy}</td>
                        <td>{prescriptions.details}</td>
                    </tr>
                ))}
            </table>

            <h3>Deletar receita</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <label htmlFor="idToSearch">Informe o ID para editar:</label>
                    <input 
                        type="number"
                        id="idToSearch"
                        name="idToSearch"
                        value={idToChange}
                        onChange={handleIdChange}
                        disabled={loading}
                        required
                    />
                    <button type="button" onClick={handleSearch} disabled={loading}>Buscar</button>
                </div>
                
                <div>
                    <label htmlFor="id">ID da receita para editar:</label>
                    <input
                        type="number"
                        id="id"
                        name="id"
                        value={formData.id}
                        readOnly
                        style={{ backgroundColor: '#eee' }}
                    />
                </div>
                
                <div>
                    <label htmlFor="patient">Paciente:</label>
                    <input
                        type="number"
                        id="patientNumber"
                        name="patientNumber"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="healthProfessional">Médico:</label>
                    <input
                        type="number"
                        id="professionalNumber"
                        name="professionalNumber"
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
                <div style={{ color: response.type === 'error' ? 'red' : 'green' }}>
                    {response.message}
                </div>
                )}

                <button type="submit" disabled={loading || formData.id === 0}>
                  {loading ? 'Atualizando...' : 'Atualizar Item'}
                </button>
                <button onClick={() => {
                    handlePrescriptionDelete()
                }}>Deletar Item</button>
            </form>
        </section>
    )
}
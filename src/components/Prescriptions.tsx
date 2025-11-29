import { useState, useEffect } from "react";
import CreatePrescriptionForm from "./CreatePrescriptionForm";

//tipagem dos dados do formulário (mantendo o padrão do db)
interface Prescription {
    id: number,
    assignedTo: number,
    assignedBy: number,
    details: string,
}

interface PrescriptionFormData extends Prescription {}

interface ResponseState {
    message: string;
    type: 'success' | 'error' | null;
}

export default function Prescriptions(){

    //criação e inicialização da variável que armazenará os dados da api
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([])

    const loadPrescriptions = () => {
        //busca os dados existentes
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
            setPrescriptions(data);
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
    }
    
    useEffect(() => {
        //busca os dados sempre que o componente for carregado (o array vazio garante isso)
        loadPrescriptions()
    }, []);

    //criação e inicialização das variáveis do formulario
    const [formData, setFormData] = useState<PrescriptionFormData>({
        id: 0,
        assignedTo: 0,
        assignedBy: 0,
        details: '',
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
        if (!formData.id || !formData.assignedTo || !formData.assignedBy || !formData.details) {
            return setResponse({ message: 'Por favor, preencha todos os campos.', type: 'error' });
        }
    
        setLoading(true);
    
        //executa a edição via http put
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
    
            //se a resposta da api for ok, limpa o formulário
            if (response.ok) {
                setResponse({ 
                    message: 'Item alterado com sucesso!', 
                    type: 'success'
                });
                setFormData({ id: 0, assignedTo: 0, assignedBy: 0, details: '' });
                setIdToChange('')
                loadPrescriptions()
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

    //variável que armazena o id do item a ser editado
    const [idToChange, setIdToChange] = useState('')

    //exclusão de registro
    const handlePrescriptionDelete = async () => {

        const idToDelete = idToChange.trim();
    
        if (!idToDelete) {
            return setResponse({ message: 'Por favor, informe um ID válido.', type: 'error' });
        }
    
        setLoading(true);
        setResponse({ message: '', type: null });
    
        //executa a exclusão via http delete
        try {
            const response = await fetch("http://localhost:3002/api/prescriptions/" + idToDelete, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
    
            if (response.status == 204) {

                setResponse({ 
                    message: 'Item deletado com sucesso!', 
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

    //quando o usuário clica na linha da tabela, os campos do formulário são preenchidos com os dados daquele registro
    const handleRowClick = (prescription: Prescription) => {
        setFormData({
            id: prescription.id,
            assignedTo: prescription.assignedTo,
            assignedBy: prescription.assignedBy,
            details: prescription.details,
        });
        setIdToChange(prescription.id.toString());
        setResponse({ message: `Editando receita: ${prescription.id}`, type: null });
        
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }


    // ============ HTML ============
    return (
        <section>
            <h2>Receitas</h2>
            <table>
                <tr className="tableHeader">
                    <th>ID</th>
                    <th>Paciente</th>
                    <th>Médico responsável</th>
                    <th>Detalhes</th>
                </tr>
                {prescriptions.map((prescriptions, i) => (
                    <tr key={i} onClick={() => {
                        handleRowClick(prescriptions)
                    }}>
                        <td>{prescriptions.id}</td>
                        <td>{prescriptions.assignedTo}</td>
                        <td>{prescriptions.assignedBy}</td>
                        <td>{prescriptions.details}</td>
                    </tr>
                ))}
            </table>

            <h3>Editar receita</h3>
            {/* formulário de receitas */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="id">ID da receita para editar:</label>
                    <input
                        type="number"
                        id="id"
                        name="id"
                        value={formData.id}
                        readOnly
                        disabled
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
                <div className="responseDiv">
                    {response.message}
                </div>
                )}

                <button type="submit" disabled={loading || formData.id === 0}>
                  {loading ? 'Atualizando...' : 'Atualizar receita'}
                </button>
                <p onClick={() => {
                    handlePrescriptionDelete()
                }} className="deleteBtn">Deletar receita</p>
            </form>
            {/* fim do formulário de receitas */}
            <h3>Inserir receita</h3>

            {/* chama o formulário de criação de receitas */}
            <CreatePrescriptionForm />
        </section>
    )
}
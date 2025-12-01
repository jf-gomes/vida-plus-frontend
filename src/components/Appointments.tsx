import { useState, useEffect } from "react";
import CreateAppointmentForm from "./CreateAppointmentForm";


//tipagem dos dados do formulário (mantendo o padrão do db)
interface Appointment {
    id: number,
    assignedTo: number,
    assignedBy: number,
    date: string,
    details: string,
    online: number,
    room: number,
}

interface PrescriptionFormData extends Appointment {}

interface ResponseState {
    message: string;
    type: 'success' | 'error' | null;
}

export default function Appointments(){

    //criação e inicialização da variável que armazenará os dados da api
    const [appointments, setAppointments] = useState<Appointment[]>([])

    const loadAppointments = () => {
        //busca os dados existentes
        fetch('http://localhost:3002/api/appointments', {
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
            setAppointments(data);
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
    }
    
    useEffect(() => {
        //busca os dados sempre que o componente for carregado (o array vazio garante isso)
        loadAppointments()
    }, []);

    //criação e inicialização das variáveis do formulario
    const [formData, setFormData] = useState<PrescriptionFormData>({
        id: 0,
        assignedTo: 0,
        assignedBy: 0,
        date: '',
        details: '',
        online: 0,
        room: 0
    });

    const [response, setResponse] = useState<ResponseState>({ message: '', type: null });

    const [loading, setLoading] = useState(false);

    //quando houver alteração em algum campo do formulário, o valor inserido é armazenado na variável formData
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const { name, value } = e.target;

        setFormData({
          ...formData,
          [name]: name === 'online' ? value === 'true' : value,
        });
    };

    //quando o formulário é enviado
    const handleSubmit = async (e: React.FormEvent) => {
        console.log(formData)
        e.preventDefault();
        setResponse({ message: '', type: null });
    
        //se tiver dados faltando
        if (!formData.id || !formData.assignedTo || !formData.assignedBy || !formData.date || !formData.details || !formData.online || !formData.room) {
            return setResponse({ message: 'Por favor, preencha todos os campos.', type: 'error' });
        }
    
        setLoading(true);
    
        //executa a edição via http put
        try {
            const response = await fetch("http://localhost:3002/api/appointments/" + formData.id, {
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
                setFormData({
                    id: 0,
                    assignedTo: 0,
                    assignedBy: 0,
                    date: '',
                    details: '',
                    online: 0,
                    room: 0
                });
                setIdToChange('')
                loadAppointments()
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
    const handleAppointmentDelete = async () => {

        const idToDelete = idToChange.trim();
    
        if (!idToDelete) {
            return setResponse({ message: 'Por favor, informe um ID válido.', type: 'error' });
        }
    
        setLoading(true);
        setResponse({ message: '', type: null });
    
        //executa a exclusão via http delete
        try {
            const response = await fetch("http://localhost:3002/api/appointments/" + idToDelete, {
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
    const handleRowClick = (appointment: Appointment) => {
        setFormData({
            id: appointment.id,
            assignedTo: appointment.assignedTo,
            assignedBy: appointment.assignedBy,
            date: appointment.date,
            details: appointment.details,
            online: appointment.online,
            room: appointment.room,
        });
        setIdToChange(appointment.id.toString());
        setResponse({ message: `Editando consulta: ${appointment.id}`, type: null });
        
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }


    // ============ HTML ============
    return (
        <section>
            <h2>Consultas</h2>
            <table>
                <tr className="tableHeader">
                    <th>ID</th>
                    <th>Paciente</th>
                    <th>Médico responsável</th>
                    <th>Data</th>
                    <th>Detalhes</th>
                    <th>Virtual</th>
                    <th>Sala</th>
                </tr>
                {appointments.map((appointment, i) => (
                    <tr key={i} onClick={() => {
                        handleRowClick(appointment)
                    }}>
                        <td>{appointment.id}</td>
                        <td>{appointment.assignedTo}</td>
                        <td>{appointment.assignedBy}</td>
                        <td>{appointment.date}</td>
                        <td>{appointment.details}</td>
                        <td>{
                            appointment.online == 1 ? "Sim" : "Não"
                        }</td>
                        <td>{appointment.room}</td>
                    </tr>
                ))}
            </table>

            <h3>Editar consulta</h3>
            {/* formulário de consultas */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="id">ID da consulta para editar:</label>
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
                    <select id="online" name="online" value={formData.online.toString()} onChange={handleChange} required>
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
                <div className="responseDiv">
                    {response.message}
                </div>
                )}

                <button type="submit" disabled={loading || formData.id === 0}>
                  {loading ? 'Atualizando...' : 'Atualizar consulta'}
                </button>
                <p onClick={() => {
                    handleAppointmentDelete()
                }} className="deleteBtn">Deletar consulta</p>
            </form>
            {/* fim do formulário de consultas */}
            <h3>Inserir receita</h3>

            {/* chama o formulário de criação de consultas */}
            <CreateAppointmentForm onSuccess={loadAppointments} />
        </section>
    )
}
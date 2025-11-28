import { useState, useEffect } from "react";

import CreateRoomForm from "./CreateRoomForm";

interface Room {
    id: number,
    number: number,
    type: string,
    capacity: number,
}

interface RoomFormData {
    id: number,
    number: number,
    type: string,
    capacity: number,
}

interface ResponseState {
    message: string;
    type: 'success' | 'error' | null;
}

export default function Rooms(){

    const [rooms, setRooms] = useState<Room[]>([])

    const loadRooms = () => {
        fetch('http://localhost:3002/api/rooms', {
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
            setRooms(data);
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
    }
    
    useEffect(() => {
        loadRooms()
    }, []);

    const [formData, setFormData] = useState<RoomFormData>({
        id: 0,
        number: 0,
        type:'',
        capacity: 0,
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
    
        if (!formData.id || !formData.number || !formData.type || !formData.capacity) {
            return setResponse({ message: 'Por favor, preencha todos os campos.', type: 'error' });
        }
    
        setLoading(true);
    
        try {
            const response = await fetch("http://localhost:3002/api/rooms/" + formData.id, {
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
            setFormData({ id: 0, number: 0, type: '', capacity: 0 });
            setIdToChange('')
            loadRooms()
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

        const idToSearch = idToChange.trim();
    
        if (!idToSearch) {
            return setResponse({ message: 'Por favor, informe um ID válido.', type: 'error' });
        }
    
        setLoading(true);
        setResponse({ message: '', type: null });
    
        try {
            const response = await fetch("http://localhost:3002/api/rooms/" + idToSearch, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include',
          });
    
        const data: RoomFormData = await response.json();
    
        if (response.ok) {
            
            setFormData({
                id: data.id,
                number: data.number,
                type: data.type,
                capacity: data.capacity,
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

        const idToDelete = idToChange.trim();
    
        if (!idToDelete) {
            return setResponse({ message: 'Por favor, informe um ID válido.', type: 'error' });
        }
    
        setLoading(true);
        setResponse({ message: '', type: null });
    
        try {
            const response = await fetch("http://localhost:3002/api/rooms/" + idToDelete, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include',
          });
    
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

    const handleRowClick = (room: Room) => {
        setFormData({
            id: room.id,
            number: room.number,
            type: room.type,
            capacity: room.capacity,
        });
        setIdToChange(room.id.toString());
        setResponse({ message: `Editando quarto: ${room.number}`, type: null });
        
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    return (
        <section>
            <h2>Quartos</h2>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Número</th>
                    <th>Tipo</th>
                    <th>Capacidade</th>
                </tr>
                {rooms.map((room, i) => (
                    <tr key={i} onClick={() => {
                        handleRowClick(room)
                    }}>
                        <td>{room.id}</td>
                        <td>{room.number}</td>
                        <td>{room.type}</td>
                        <td>{room.capacity}</td>
                    </tr>
                ))}
            </table>

            <h3>Editar quarto</h3>
            <form onSubmit={handleSubmit}>
                <div>
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
                    <label htmlFor="id">ID do quarto para editar:</label>
                    <input
                        type="number"
                        id="id"
                        name="id"
                        value={formData.id}
                        readOnly
                    />
                </div>
                
                <div>
                    <label htmlFor="number">Número:</label>
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
                    <label htmlFor="type">Tipo:</label>
                    <input
                        type="text"
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    />
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

                <button type="submit" disabled={loading || formData.id === 0}>
                  {loading ? 'Atualizando...' : 'Atualizar quarto'}
                </button>
                <button onClick={() => {
                    handlePrescriptionDelete()
                }}>Deletar quarto</button>
            </form>

            <h3>Inserir quarto</h3>
            <CreateRoomForm />
        </section>
    )
}
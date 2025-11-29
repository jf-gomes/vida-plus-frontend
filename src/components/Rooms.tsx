import { useState, useEffect } from "react";

import CreateRoomForm from "./CreateRoomForm";

//tipagem dos dados do formulário (mantendo o padrão do db)
interface Room {
    id: number,
    number: number,
    type: string,
    capacity: number,
}

interface RoomFormData extends Room {}

interface ResponseState {
    message: string;
    type: 'success' | 'error' | null;
}

export default function Rooms(){

    //criação e inicialização da variável que armazenará os dados da api
    const [rooms, setRooms] = useState<Room[]>([])

    const loadRooms = () => {
        //busca os dados existentes
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
        //busca os dados sempre que o componente for carregado (o array vazio garante isso)
        loadRooms()
    }, []);

    //criação e inicialização das variáveis do formulario
    const [formData, setFormData] = useState<RoomFormData>({
        id: 0,
        number: 0,
        type:'',
        capacity: 0,
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
        if (!formData.id || !formData.number || !formData.type || !formData.capacity) {
            return setResponse({ message: 'Por favor, preencha todos os campos.', type: 'error' });
        }
    
        setLoading(true);
    
        //executa a edição via http put
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
    
            //se a resposta da api for ok, limpa o formulário
            if (response.ok) {
                setResponse({ 
                    message: 'Item alterado com sucesso!', 
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
            const response = await fetch("http://localhost:3002/api/rooms/" + idToDelete, {
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


    // ============ HTML ============
    return (
        <section>
            <h2>Quartos</h2>
            <table>
                <tr className="tableHeader">
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

            {/* formulário de quartos */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="id">ID do quarto para editar:</label>
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
                <div className="responseDiv">
                    {response.message}
                </div>
                )}

                <button type="submit" disabled={loading || formData.id === 0}>
                  {loading ? 'Atualizando...' : 'Atualizar quarto'}
                </button>
                <p onClick={() => {
                    handlePrescriptionDelete()
                }} className="deleteBtn">Deletar quarto</p>
            </form>
            {/* fim do formulário de quartos */}

            <h3>Inserir quarto</h3>
            {/* chama o formulário de criação de quartos */}
            <CreateRoomForm />
        </section>
    )
}
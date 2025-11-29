import { useState, useEffect } from "react";
import CreateUserForm from "./CreateUserForm";

interface User {
    id: number,
    username: string,
    email: string,
    name: string,
    genre: string,
    dob: string,
    role: string,
    roomId: number | string;
}

interface UserFormData extends User {}

interface ResponseState {
    message: string;
    type: 'success' | 'error' | null;
}

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);

    const loadUsers = () => {
        fetch('http://localhost:3002/api/users/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        })
        .then(response => {
            if (!response.ok) throw new Error('Falha na requisição');
            return response.json();
        })
        .then(data => setUsers(data))
        .catch(error => console.error('Erro ao buscar dados:', error));
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const [formData, setFormData] = useState<UserFormData>({
        id: 0,
        username: '',
        email: '',
        name: '',
        genre: '',
        dob: '',
        role: 'Patient',
        roomId: 0
    });

    const [response, setResponse] = useState<ResponseState>({ message: '', type: null });
    const [loading, setLoading] = useState(false);
    const [idToChange, setIdToChange] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
          ...prev,
          [name]: (name === 'roomId' || name === 'id') ? Number(value) : value,
        }));
    };

    const handleRowClick = (user: User) => {
        setFormData({
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            genre: user.genre || '',
            dob: user.dob,
            role: user.role,
            roomId: user.roomId ?? ''
        });
        setIdToChange(user.id.toString());
        setResponse({ message: `Editando usuário: ${user.name}`, type: null });
        
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponse({ message: '', type: null });
    
        if (!formData.id || !formData.username || !formData.email || !formData.name || !formData.dob || !formData.role) {
            return setResponse({ message: 'Por favor, preencha os campos obrigatórios.', type: 'error' });
        }
    
        setLoading(true);

        const payload = {
            ...formData,
            roomId: formData.roomId === '' || formData.roomId === 0 ? null : Number(formData.roomId),
            genre: formData.genre === '' ? null : formData.genre
        };
    
        try {
            const res = await fetch("http://localhost:3002/api/users/" + formData.id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include',
            });
    
            const data = await res.json();
    
            if (res.ok) {
                setResponse({ 
                    message: 'Usuário atualizado com sucesso!', 
                    type: 'success'
                });
                
                setFormData({ 
                    id: 0, username: '', email: '', name: '', genre: '', dob: '', role: 'Patient', roomId: 0
                });
                setIdToChange('');
                
                loadUsers(); 
            } else {
                setResponse({ 
                    message: data.message || 'Erro ao atualizar.', 
                    type: 'error' 
                });
            }
        } catch (error) {
            console.error(error);
            setResponse({ 
                message: 'Erro de conexão com o servidor.', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!idToChange) return;
        setLoading(true);
        try {
            const res = await fetch("http://localhost:3002/api/users/" + idToChange, {
                credentials: 'include'
            });
            const data = await res.json();
            if (res.ok) {
                setFormData(data);
                setResponse({ message: 'Usuário encontrado.', type: 'success' });
            } else {
                setResponse({ message: 'Usuário não encontrado.', type: 'error' });
            }
        } catch (error) {
            setResponse({ message: 'Erro na busca.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleUserDelete = async () => {

        const idToDelete = idToChange.trim();
    
        if (!idToDelete) {
            return setResponse({ message: 'Por favor, informe um ID válido.', type: 'error' });
        }
    
        setLoading(true);
        setResponse({ message: '', type: null });
    
        try {
            const response = await fetch("http://localhost:3002/api/users/" + idToDelete, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include',
          });

        console.log(response)
    
        if (response.ok) {

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
            <h2>Usuários</h2>
            <table>
                <thead>
                    <tr className="tableHeader">
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Nome</th>
                        <th>Gênero</th>
                        <th>Nascimento</th>
                        <th>Role</th>
                        <th>Quarto</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr 
                            key={user.id}
                            onClick={() => handleRowClick(user)}
                        >
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.name}</td>
                            <td>{user.genre}</td>
                            <td>{user.dob}</td>
                            <td>{user.role}</td>
                            <td>{user.roomId}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Editar usuário</h3>
            
            <div className="searchIdDiv">
                <div>
                    <label>Buscar ID:</label>
                    <input 
                        type="number" 
                        value={idToChange} 
                        onChange={(e) => setIdToChange(e.target.value)} 
                    />
                </div>
                <button type="button" onClick={handleSearch} disabled={loading}>Buscar</button>
            </div>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>ID do usuário para editar:</label>
                    <input type="number" name="id" value={formData.id} readOnly disabled />
                </div>
                
                <div>
                    <label>Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Nome:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Gênero:</label>
                    <select name="genre" value={formData.genre} onChange={handleChange} required>
                        <option value="">Selecione...</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                    </select>
                </div>
                <div>
                    <label>Nascimento:</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                </div>
                <div>
                    <label>Tipo:</label>
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="Patient">Paciente</option>
                        <option value="HealthProfessional">Profissional de saúde</option>
                        <option value="Admin">Administrador</option>
                    </select>
                </div>
                <div>
                    <label>Quarto (ID):</label>
                    <input type="number" name="roomId" value={formData.roomId || ''} onChange={handleChange} />
                </div>

                {response.message && (
                    <div className="responseDiv">
                        {response.message}
                    </div>
                )}

                <button type="submit" disabled={loading || formData.id === 0}>
                    {loading ? 'Atualizando...' : 'Atualizar usuário'}
                </button>

                <p onClick={() => {
                    handleUserDelete()
                }} className="deleteBtn">Deletar usuário</p>
            </form>

            <h3>Inserir usuário</h3>
            <CreateUserForm />
        </section>
    );
}
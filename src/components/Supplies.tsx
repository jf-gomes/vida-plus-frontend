import { useState, useEffect } from "react";

interface Supply {
    id: number,
    code: number,
    name: string,
    description: string,
    quantity: number
}

interface SupplyFormData {
    id: number,
    code: number,
    name: string,
    description: string,
    quantity: number
}

interface ResponseState {
    message: string;
    type: 'success' | 'error' | null;
}

export default function Supplies(){

    const [supplies, setSupplies] = useState<Supply[]>([])
    
        useEffect(() => {
            fetch('http://localhost:3002/api/supplies', {
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
                setSupplies(data);
            })
            .catch(error => console.error('Erro ao buscar dados:', error));
    }, []);


    const [formData, setFormData] = useState<SupplyFormData>({
        id: 0,
        code: 0,
        name: '',
        description: '',
        quantity: 0,
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
    
        if (!formData.id || !formData.code || !formData.name || !formData.description || !formData.quantity) {
            return setResponse({ message: 'Por favor, preencha todos os campos.', type: 'error' });
        }
    
        setLoading(true);
    
        try {
            const response = await fetch("http://localhost:3002/api/supplies/" + formData.id, {
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
            setFormData({ id: 0, code: 0, name: '', description: '', quantity: 0 });
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
            const response = await fetch("http://localhost:3002/api/supplies/" + idToSearch, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include',
          });
    
        const data: SupplyFormData = await response.json();
    
        if (response.ok) {
            
            setFormData({
                id: data.id,
                code: data.code,
                name: data.name,
                description: data.description,
                quantity: data.quantity,
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

    return (
        <section>
            <h2>Suprimentos</h2>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Quantidade</th>
                </tr>
                {supplies.map((supply, i) => (
                    <tr key={i} onClick={() => {
                        setIdToChange(supply.id.toString())
                        handleSearch
                    }}>
                        <td>{supply.id}</td>
                        <td>{supply.code}</td>
                        <td>{supply.name}</td>
                        <td>{supply.description}</td>
                        <td>{supply.quantity}</td>
                    </tr>
                ))}
            </table>

            <h3>Editar suprimento</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <label htmlFor="idToSearch">Informe o ID para buscar:</label>
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
                    <label htmlFor="id">ID do Item Editando:</label>
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
                <div style={{ color: response.type === 'error' ? 'red' : 'green' }}>
                    {response.message}
                </div>
                )}

                <button type="submit" disabled={loading || formData.id === 0}>
                  {loading ? 'Atualizando...' : 'Atualizar Item'}
                </button>
            </form>
        </section>
    )
}
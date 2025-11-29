import { useState, useEffect } from "react";
import CreateSupplyForm from "./CreateSupplyForm";

//tipagem dos dados do formulário (mantendo o padrão do db)
interface Supply {
    id: number,
    code: number,
    name: string,
    description: string,
    quantity: number
}

interface SupplyFormData extends Supply {}

interface ResponseState {
    message: string;
    type: 'success' | 'error' | null;
}

export default function Supplies(){

    //criação e inicialização da variável que armazenará os dados da api
    const [supplies, setSupplies] = useState<Supply[]>([])

        const loadSupplies = () => {
            //busca os dados existentes
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
                setSupplies(data);
            })
            .catch(error => console.error('Erro ao buscar dados:', error));
        }
    
        useEffect(() => {
            //busca os dados sempre que o componente for carregado (o array vazio garante isso)
            loadSupplies()
    }, []);

    //criação e inicialização das variáveis do formulario
    const [formData, setFormData] = useState<SupplyFormData>({
        id: 0,
        code: 0,
        name: '',
        description: '',
        quantity: 0,
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
        if (!formData.id || !formData.code || !formData.name || !formData.description || !formData.quantity) {
            return setResponse({ message: 'Por favor, preencha todos os campos.', type: 'error' });
        }
    
        setLoading(true);
    
        //executa a edição via http put
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
    
            //se a resposta da api for ok, limpa o formulário
            if (response.ok) {
                setResponse({ 
                    message: 'Item alterado com sucesso!', 
                    type: 'success'
                });
                setFormData({ id: 0, code: 0, name: '', description: '', quantity: 0 });
                setIdToChange('')
                loadSupplies()
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

    //quando o usuário clica na linha da tabela, os campos do formulário são preenchidos com os dados daquele registro
    const handleRowClick = (supply: Supply) => {
        setFormData({
            id: supply.id,
            code: supply.code,
            name: supply.name,
            description: supply.description,
            quantity: supply.quantity,
        });
        setIdToChange(supply.id.toString());
        setResponse({ message: `Editando suprimento: ${supply.name}`, type: null });
        
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    //exclusão de registro
    const handleSupplyDelete = async () => {

        const idToDelete = idToChange.trim();
    
        if (!idToDelete) {
            return setResponse({ message: 'Por favor, informe um ID válido.', type: 'error' });
        }
    
        setLoading(true);
        setResponse({ message: '', type: null });
    
        //executa a exclusão via http delete
        try {
            const response = await fetch("http://localhost:3002/api/supplies/" + idToDelete, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include',
          });
    
        if (response.ok) {

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


    // ============ HTML ============
    return (
        <section>
            <h2>Suprimentos</h2>
            <table>
                <tr className="tableHeader">
                    <th>ID</th>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Quantidade</th>
                </tr>
                {supplies.map((supply, i) => (
                    <tr key={i} onClick={() => handleRowClick(supply)}>
                        <td>{supply.id}</td>
                        <td>{supply.code}</td>
                        <td>{supply.name}</td>
                        <td>{supply.description}</td>
                        <td>{supply.quantity}</td>
                    </tr>
                ))}
            </table>

            <h3>Editar suprimento</h3>
            {/* formulário de suprimentos */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="id">ID do suprimento para editar:</label>
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
                <div className="responseDiv">
                    {response.message}
                </div>
                )}

                <button type="submit" disabled={loading || formData.id === 0}>
                  {loading ? 'Atualizando...' : 'Atualizar suprimento'}
                </button>

                <p onClick={() => {
                    handleSupplyDelete()
                }} className="deleteBtn">Deletar suprimento</p>
            </form>
            {/* fim do formulário de suprimentos */}
            <h3>Inserir suprimento</h3>

            {/* chama o formulário de criação de suprimentos */}
            <CreateSupplyForm />
        </section>
    )
}
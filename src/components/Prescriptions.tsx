import { useState, useEffect } from "react";

interface Prescription {
    id: number,
    assignedTo: any,
    assignedBy: any,
    details: string
}

/*
interface PrescriptionFormData {
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
*/

export default function Prescriptions({ token }: { token: string }){

    const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
    
        useEffect(() => {
            fetch('http://localhost:3002/api/prescriptions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha na requisição: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Dados receßbidos:', data);
                setPrescriptions(data);
            })
            .catch(error => console.error('Erro ao buscar dados:', error));
    }, []);

    /*
    const [formData, setFormData] = useState<PrescriptionFormData>({
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
          const response = await fetch("http://localhost:3002/api/prescriptions/" + formData.id, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            setResponse({ 
              message: 'Item alterado com sucesso', 
              type: 'success' 
            });
            setFormData({ id: 0, code: 0, name: '', description: '', quantity: 0 });
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
      */


    return (
        <section>
            <table>
                <tr>
                    <td>ID</td>
                    <td>Paciente</td>
                    <td>Médico responsável</td>
                    <td>Detalhes</td>
                </tr>
                {prescriptions.map((prescription, i) => (
                    <tr key={i}>
                        <td>{prescription.id}</td>
                        <td>{prescription.assignedTo}</td>
                        <td>{prescription.assignedBy}</td>
                        <td>{prescription.details}</td>
                    </tr>
                ))}
            </table>

            {/*
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="id">ID:</label>
                    <input
                        type="number"
                        id="id"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        required
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
                <div>
                    {response.message}
                </div>
        )}

                <button type="submit" disabled={loading}>{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
            </form>
            */}
        </section>
    )
}
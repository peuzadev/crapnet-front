import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListOnus.css';
const apiUrl = import.meta.env.VITE_API_URL;

const ListOnus = () => {
  const [message, setMessage] = useState('');
  const [onus, setOnus] = useState([]);
  const [actionType, setActionType] = useState(null); // Adicionado para controlar o tipo de ação (prov ou desprov)
  const [snInput, setSnInput] = useState(''); // Adicionado para armazenar o SN da ONU
  const [pppoe, setPppoe] = useState('');
  const [tecnico, setTecnico] = useState('');
  
  // Função para buscar as ONUs
  const fetchOnus = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/find`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Isso garante que o CORS seja respeitado
        
      });
      const data = await response.json();
      setOnus(data);
    } catch (error) {
      console.error('Erro ao listar ONUs', error);
    }
  };

  // Função chamada ao submeter a ação de provisionar/desprovisionar
  const handleSubmit = async () => {
    if (!snInput) {
      alert('Digite o SN da ONU');
      return;
    }

    const endpoint = actionType === 'prov' ? '/api/prov' : '/api/desprov';

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify({
          sn: snInput,
          pppoe: pppoe,
          tecnico: tecnico }),
      });

      if (!response.ok) throw new Error('Erro na requisição');
      const data = await response.json();
      setOnus(data);
      // Exibe a mensagem de sucesso
      setMessage('Alteração realizada.');

      // Limpa os campos e reseta o estado
      setActionType(null);
      setSnInput('');
      setPppoe('');
      setTecnico('');
      
    } catch (error) {
      // Exibe a mensagem de erro
      setMessage('Erro ao realizar o provisionamento. Tente novamente!');
      console.error(error); // Para depuração
    }
    
  };

  
  useEffect(() => {
    fetchOnus();
  }, []); 
  const [onusProvisionadas, setOnusProvisionadas] = useState([]);
  const [showProvisionadas, setShowProvisionadas] = useState(false);
 
  
  
  const handleShowProvisionadas = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/prov`);
      if (!response.ok) throw new Error('Erro ao buscar ONUs provisionadas');
      const data = await response.json();
      setOnusProvisionadas(data);
      setShowProvisionadas(true); // Mostra a lista
    } catch (error) {
      console.error('Erro:', error);
    }
  };
const fetchOnusProvisionadas = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/prov`);
    if (!response.ok) throw new Error('Erro ao carregar ONUs provisionadas');
    const data = await response.json();
    setOnusProvisionadas(data);
  } catch (error) {
    console.error(error);
  }
};
useEffect(() => {
  fetchOnusProvisionadas(); // Carrega as ONUs provisionadas quando o componente é montado
}, []);
useEffect(() => {
  const carregarOnus = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/find`);
      const data = await response.json();
      setOnusDesprovisionadas(data);
    } catch (error) {
      console.error('Erro ao carregar ONUs desprovisionadas:', error);
    }
    const response = await fetch(`${apiUrl}/api/find`);
const text = await response.text();
console.log(text); 
  };
  

  carregarOnus();
}, []);

  return (
    
    <div>
      {/* Exibição da mensagem de sucesso ou erro */}
      {message && (
        <div
          className={`message ${message.includes('Erro') ? 'error' : 'success'}`}
        >
          {message}
        </div>
      )}
      <h2>Lista de ONUs</h2>
    <button onClick={handleShowProvisionadas}>ONUs Provisionadas</button>

{showProvisionadas && (
  <div className="lista">
    <h3>Lista de ONUs Provisionadas</h3>
    <ul className="lista-container">
      {onusProvisionadas.map((onu, index) => (
        <li key={index}>
          SN: {onu.sn} <br />
          PPPoE: {onu.pppoe} <br />
          Técnico: {onu.tecnico}
        </li>
      ))}
    </ul>
    <button onClick={() => setShowProvisionadas(false)}>Fechar</button>
  </div>
)}

      {/* Botões para provisionar/desprovisionar */}
      <div>
        <button onClick={() => setActionType('prov')}>Provisionar</button>
        <button onClick={() => setActionType('desprov')}>Desprovisionar</button>
      </div>

      {/* Exibição de campo de entrada para SN e confirmação da ação */}
      {actionType && (
        <div style={{ marginTop: '1rem' }}>
          <input
            type="text"
            value={snInput}
            onChange={(e) => setSnInput(e.target.value)}
            placeholder="Digite o SN da ONU"
          />
          <input
            type="text"
            value={pppoe}
            onChange={(e) => setPppoe(e.target.value)}
            placeholder="Digite o pppoe"
          />
          <input
          type="text"
          value={tecnico}
          onChange={(e) => setTecnico(e.target.value)}
          placeholder="Qual o seu nome?"
        />

          <button onClick={handleSubmit}>Confirmar</button>
          <button onClick={() => { setActionType(null); setSnInput('');setPppoe('');setTecnico(''); }}>
            Cancelar
          </button>
        </div>
      
      
      )}

      {/* Renderização da lista de ONUs */}
      <ul>
        {onus.length > 0 ? (
          onus.map((onu, index) => (
            <li key={index}>
              <p><strong>SN:</strong> {onu.sn}</p>
              <p><strong>Modelo:</strong> {onu.model}</p>
              <p><strong>MAC:</strong> {onu.ontMAC}</p>
              <p><strong>Status:</strong> {onu.status}</p>
              <p><strong>Data de Autodetecção:</strong> {onu.ontAutofindTime}</p>
              <hr />
            </li>
          ))
        ) : (
          <p>Carregando ONUs...</p>
        )}
      </ul>
    </div>
  );
 
};

export default ListOnus;

import React, { useEffect, useState } from 'react';
import './ListOnus.css';

const apiUrl = import.meta.env.VITE_API_URL;

const ListOnus = () => {
  const [message, setMessage] = useState('');
  const [onus, setOnus] = useState([]);
  const [actionType, setActionType] = useState(null);
  const [snInput, setSnInput] = useState('');
  const [pppoe, setPppoe] = useState('');
  const [tecnico, setTecnico] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [onusProvisionadas, setOnusProvisionadas] = useState([]);
  const [showProvisionadas, setShowProvisionadas] = useState(false);

  const fetchOnus = async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const response = await fetch(`${apiUrl}/api/find`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      });
      if (!response.ok) throw new Error('Erro ao listar ONUs');
      const data = await response.json();
      setOnus(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao listar ONUs', error);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOnusProvisionadas = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/prov`);
      if (!response.ok) throw new Error('Erro ao carregar ONUs provisionadas');
      const data = await response.json();
      setOnusProvisionadas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOnus();
    fetchOnusProvisionadas();
  }, []);

  const handleShowProvisionadas = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/prov`);
      if (!response.ok) throw new Error('Erro ao buscar ONUs provisionadas');
      const data = await response.json();
      setOnusProvisionadas(Array.isArray(data) ? data : []);
      setShowProvisionadas(true);
    } catch (error) {
      console.error('Erro:', error);
      setMessage('Erro ao carregar ONUs provisionadas.');
    }
  };

  const handleSubmit = async () => {
    if (!snInput) {
      setMessage('Erro: digite o SN da ONU.');
      return;
    }

    const endpoint = actionType === 'prov' ? '/api/prov' : '/api/desprov';

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify({ sn: snInput, pppoe, tecnico }),
      });

      if (!response.ok) throw new Error('Erro na requisição');
      const data = await response.json();
      setOnus(Array.isArray(data) ? data : []);
      setMessage('Alteração realizada com sucesso.');
      setActionType(null);
      setSnInput('');
      setPppoe('');
      setTecnico('');
      fetchOnusProvisionadas();
    } catch (error) {
      setMessage('Erro ao realizar o provisionamento. Tente novamente!');
      console.error(error);
    }
  };

  const cancelAction = () => {
    setActionType(null);
    setSnInput('');
    setPppoe('');
    setTecnico('');
  };

  const getStatusClass = (status = '') => {
    const normalizedStatus = String(status).toLowerCase();
    return /online|ativo|up|provisionado/.test(normalizedStatus)
      ? 'status-pill status-pill--online'
      : 'status-pill status-pill--offline';
  };

  return (
    <section className="onu-dashboard" aria-labelledby="onu-list-title">
      {message && (
        <div
          className={`message ${message.includes('Erro') ? 'error' : 'success'}`}
          role="status"
          aria-live="polite"
        >
          <span className="message__indicator" />
          {message}
          <button className="message__close" onClick={() => setMessage('')} aria-label="Fechar mensagem">
            ×
          </button>
        </div>
      )}

      <div className="section-heading">
        <div>
          <p className="eyebrow">DISPOSITIVOS</p>
          <h2 id="onu-list-title">Lista de ONUs</h2>
          <p className="section-heading__copy">Equipamentos encontrados na rede.</p>
        </div>
        <button className="button button--secondary" onClick={handleShowProvisionadas}>
          <span className="button__icon" aria-hidden="true">↗</span>
          Ver provisionadas
        </button>
      </div>

      <div className="action-bar">
        <div className="action-bar__copy">
          <span className="action-bar__pulse" />
          <div>
            <strong>Ações rápidas</strong>
            <span>Gerencie o acesso dos dispositivos</span>
          </div>
        </div>
        <div className="action-bar__buttons">
          <button className="button button--primary" onClick={() => setActionType('prov')}>
            <span className="button__plus" aria-hidden="true">+</span>
            Provisionar ONU
          </button>
          <button className="button button--danger-outline" onClick={() => setActionType('desprov')}>
            Desprovisionar
          </button>
        </div>
      </div>

      {actionType && (
        <div className="action-form">
          <div className="action-form__heading">
            <div>
              <p className="eyebrow">{actionType === 'prov' ? 'NOVO ACESSO' : 'GERENCIAR ACESSO'}</p>
              <h3>{actionType === 'prov' ? 'Provisionar dispositivo' : 'Desprovisionar dispositivo'}</h3>
            </div>
            <button className="icon-button" onClick={cancelAction} aria-label="Fechar formulário">×</button>
          </div>
          <div className="form-grid">
            <label className="form-field form-field--wide">
              <span>Número de série (SN)</span>
              <input
                type="text"
                value={snInput}
                onChange={(event) => setSnInput(event.target.value)}
                placeholder="Ex.: ZTEG12345678"
                autoComplete="off"
              />
            </label>
            <label className="form-field">
              <span>PPPoE</span>
              <input
                type="text"
                value={pppoe}
                onChange={(event) => setPppoe(event.target.value)}
                placeholder="Login do cliente"
                autoComplete="off"
              />
            </label>
            <label className="form-field">
              <span>Técnico responsável</span>
              <input
                type="text"
                value={tecnico}
                onChange={(event) => setTecnico(event.target.value)}
                placeholder="Seu nome"
                autoComplete="name"
              />
            </label>
          </div>
          <div className="action-form__footer">
            <span>Confira os dados antes de confirmar.</span>
            <div>
              <button className="button button--ghost" onClick={cancelAction}>Cancelar</button>
              <button className="button button--primary" onClick={handleSubmit}>Confirmar ação</button>
            </div>
          </div>
        </div>
      )}

      <div className="onu-list-panel">
        <div className="onu-list-panel__top">
          <div>
            <h3>Dispositivos detectados</h3>
            <p>Informações recebidas da rede</p>
          </div>
          <span className="device-count">
            {isLoading ? '…' : `${onus.length} ${onus.length === 1 ? 'dispositivo' : 'dispositivos'}`}
          </span>
        </div>

        {isLoading ? (
          <div className="empty-state">
            <span className="loading-spinner" />
            <strong>Carregando dispositivos</strong>
            <span>Estamos buscando as ONUs na rede.</span>
          </div>
        ) : loadError ? (
          <div className="empty-state">
            <span className="empty-state__icon">!</span>
            <strong>Não foi possível carregar a lista</strong>
            <span>Verifique a conexão com o serviço e tente novamente.</span>
            <button className="button button--secondary" onClick={fetchOnus}>Tentar novamente</button>
          </div>
        ) : onus.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon">⌕</span>
            <strong>Nenhuma ONU encontrada</strong>
            <span>Quando os dispositivos forem detectados, eles aparecerão aqui.</span>
          </div>
        ) : (
          <div className="onu-table-wrap">
            <table className="onu-table">
              <thead>
                <tr>
                  <th>Dispositivo</th>
                  <th>Modelo</th>
                  <th>Endereço MAC</th>
                  <th>Status</th>
                  <th>Autodetecção</th>
                </tr>
              </thead>
              <tbody>
                {onus.map((onu, index) => (
                  <tr key={onu.sn || index}>
                    <td data-label="Dispositivo">
                      <span className="device-avatar">ONU</span>
                      <strong>{onu.sn || 'Sem número de série'}</strong>
                    </td>
                    <td data-label="Modelo">{onu.model || '—'}</td>
                    <td data-label="Endereço MAC" className="table-mono">{onu.ontMAC || '—'}</td>
                    <td data-label="Status">
                      <span className={getStatusClass(onu.status)}>{onu.status || 'Indisponível'}</span>
                    </td>
                    <td data-label="Autodetecção">{onu.ontAutofindTime || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showProvisionadas && (
        <div className="modal-backdrop" role="presentation" onClick={() => setShowProvisionadas(false)}>
          <section
            className="provisioned-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="provisioned-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="provisioned-modal__header">
              <div>
                <p className="eyebrow">ACESSOS ATIVOS</p>
                <h2 id="provisioned-title">ONUs provisionadas</h2>
                <p>Dispositivos vinculados a uma conta PPPoE.</p>
              </div>
              <button className="icon-button" onClick={() => setShowProvisionadas(false)} aria-label="Fechar lista">×</button>
            </div>
            {onusProvisionadas.length ? (
              <div className="provisioned-list">
                {onusProvisionadas.map((onu, index) => (
                  <article className="provisioned-item" key={onu.sn || index}>
                    <span className="device-avatar">ONU</span>
                    <div>
                      <strong>{onu.sn || 'Sem número de série'}</strong>
                      <span>PPPoE: {onu.pppoe || '—'}</span>
                    </div>
                    <span className="provisioned-item__tech">{onu.tecnico || 'Técnico não informado'}</span>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state empty-state--compact">
                <strong>Nenhuma ONU provisionada</strong>
                <span>Os dispositivos vinculados aparecerão nesta lista.</span>
              </div>
            )}
            <div className="provisioned-modal__footer">
              <span>{onusProvisionadas.length} {onusProvisionadas.length === 1 ? 'registro' : 'registros'}</span>
              <button className="button button--secondary" onClick={() => setShowProvisionadas(false)}>Concluir</button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
};

export default ListOnus;

import React from 'react';
import ListOnus from './pages/ListOnus';

function App() {
  return (
    <div className="app-shell">
      <div className="ambient ambient--one" aria-hidden="true" />
      <div className="ambient ambient--two" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#" aria-label="Crapnet, início">
          <span className="brand__logo">
            <img src={`${import.meta.env.BASE_URL}crapnetlogo.png`} alt="" />
          </span>
          <span className="brand__name">
            <strong>crapnet</strong>
            <small>PAINEL DE OPERAÇÃO</small>
          </span>
        </a>

        <div className="topbar__status">
          <span className="status-dot" />
          <span>Central de rede</span>
        </div>
      </header>

      <main className="page-content">
        <section className="page-intro">
          <div>
            <p className="eyebrow">GESTÃO DE ACESSO</p>
            <h1>Central de ONUs</h1>
            <p className="page-intro__copy">
              Acompanhe dispositivos e gerencie provisionamentos em um só lugar.
            </p>
          </div>
          <div className="intro-orbit" aria-hidden="true">
            <span className="intro-orbit__ring" />
            <span className="intro-orbit__core">C</span>
            <span className="intro-orbit__spark intro-orbit__spark--one" />
            <span className="intro-orbit__spark intro-orbit__spark--two" />
          </div>
        </section>

        <ListOnus />
      </main>

      <footer className="app-footer">
        <span>CRAPNET</span>
        <span>Gestão de rede</span>
      </footer>
    </div>
  );
}

export default App;

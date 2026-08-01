function Topbar({ darkMode, onToggleTheme }) {
  return (
    <header className="topbar">
      <div className="logo">
        <img src="/claro.png" alt="logo routly" />
      </div>

      <div className="user">
        <span>Nome da Empresa aqui</span>
        <div className="avatar">R</div>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          title={darkMode ? 'Modo claro' : 'Modo escuro'}
        >
          {darkMode ? '☀︎' : '☽'}
        </button>
      </div>
    </header>
  )
}

export default Topbar

import { NavLink } from 'react-router-dom'

function Sidebar({ onToggle }) {
  const linkClass = ({ isActive }) => (isActive ? 'active-link' : '')

  return (
    <aside className="sidebar">
      <button className="sidebar-toggle" onClick={onToggle}>◀</button>
      <ul>
        <li><NavLink to="/" end className={linkClass}>Nova rota</NavLink></li>
        <li><NavLink to="/historico" className={linkClass}>Histórico</NavLink></li>
        <li><NavLink to="/frota" className={linkClass}>Frota</NavLink></li>
        <li><NavLink to="/relatorios" className={linkClass}>Relatórios</NavLink></li>
      </ul>
    </aside>
  )
}

export default Sidebar

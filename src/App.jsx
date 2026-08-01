import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import Topbar   from './components/Topbar'
import Sidebar  from './components/Sidebar'
import Footer   from './components/Footer'

import NovaRota   from './pages/NovaRota'
import Historico  from './pages/Historico'
import Frota      from './pages/Frota'
import Relatorios from './pages/Relatorios'

function App() {
  const [darkMode, setDarkMode]         = useState(false)
  const [sidebarClosed, setSidebarClosed] = useState(false)

  // aplica as classes no body — o CSS depende delas
  useEffect(() => {
    const classes = []
    if (darkMode)      classes.push('dark')
    if (sidebarClosed) classes.push('sidebar-closed')
    document.body.className = classes.join(' ')
  }, [darkMode, sidebarClosed])

  return (
    <>
      <Topbar
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
      />

      <Sidebar onToggle={() => setSidebarClosed(!sidebarClosed)} />

      <main className="content">
        <Routes>
          <Route path="/"           element={<NovaRota />} />
          <Route path="/historico"  element={<Historico />} />
          <Route path="/frota"      element={<Frota />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}

export default App

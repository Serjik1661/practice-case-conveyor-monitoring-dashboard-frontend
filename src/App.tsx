import { Link, Outlet } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <header>
        <h1>Conveyor Monitoring Dashboard</h1>

        <nav style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <Link to="/">Обзор</Link>
          <Link to="/incidents">Инциденты</Link>
          <Link to="/report">Отчёт</Link>
        </nav>
      </header>

      <main style={{ marginTop: '24px' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default App

import { Link } from 'react-router-dom'
import { conveyorLines, incidents } from '../mocks/fixtures'

const incidentStatusLabels = {
  open: 'Открыт',
  in_progress: 'В работе',
  resolved: 'Решён',
}

function IncidentsPage() {
  const getLineName = (lineId: string) => {
    const line = conveyorLines.find((item) => item.id === lineId)
    return line ? line.name : 'Неизвестная линия'
  }

  return (
    <div>
      <h2>Инциденты</h2>
      <p>Ниже показан список тестовых инцидентов.</p>

      <div
        style={{
          display: 'grid',
          gap: '16px',
          marginTop: '20px',
        }}
      >
        {incidents.map((incident) => (
          <div
            key={incident.id}
            style={{
              border: '1px solid #444',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'left',
            }}
          >
            <h3>{getLineName(incident.lineId)}</h3>

            <p>ID инцидента: {incident.id}</p>
            <p>Статус: {incidentStatusLabels[incident.status]}</p>
            <p>Ответственный: {incident.assignee ?? 'Не назначен'}</p>
            <p>Комментарий: {incident.comment ?? 'Нет комментария'}</p>
            <p>
              Создан: {new Date(incident.createdAt).toLocaleString('ru-RU')}
            </p>

            <Link to={`/incidents/${incident.id}`}>Открыть карточку</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IncidentsPage

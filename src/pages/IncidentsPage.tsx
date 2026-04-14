import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ConveyorLine, Incident } from '../shared/types'

const incidentStatusLabels: Record<Incident['status'], string> = {
  open: 'Открыт',
  in_progress: 'В работе',
  resolved: 'Решён',
}

function IncidentsPage() {
  const [lines, setLines] = useState<ConveyorLine[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError('')

        const [linesResponse, incidentsResponse] = await Promise.all([
          fetch('/api/lines'),
          fetch('/api/incidents'),
        ])

        if (!linesResponse.ok || !incidentsResponse.ok) {
          throw new Error('Ошибка загрузки')
        }

        const [linesData, incidentsData] = await Promise.all([
          linesResponse.json(),
          incidentsResponse.json(),
        ])

        setLines(linesData)
        setIncidents(incidentsData)
      } catch {
        setError('Не удалось загрузить инциденты')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const getLineName = (lineId: string) => {
    const line = lines.find((item) => item.id === lineId)
    return line ? line.name : 'Неизвестная линия'
  }

  if (isLoading) {
    return (
      <div>
        <h2>Инциденты</h2>
        <p>Загрузка инцидентов...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2>Инциденты</h2>
        <p>{error}</p>
      </div>
    )
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

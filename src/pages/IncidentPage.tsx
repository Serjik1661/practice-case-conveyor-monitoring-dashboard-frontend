import { Link, useParams } from 'react-router-dom'
import { conveyorLines, incidents } from '../mocks/fixtures'

const getStatusLabel = (status: string) => {
  if (status === 'open') return 'Открыт'
  if (status === 'in_progress') return 'В работе'
  if (status === 'resolved') return 'Решён'

  return status
}

function IncidentPage() {
  const { id } = useParams()

  const incident = incidents.find((item) => item.id === id)

  if (!incident) {
    return (
      <div>
        <h2>Инцидент не найден</h2>
        <Link to="/incidents">Вернуться к списку инцидентов</Link>
      </div>
    )
  }

  const line = conveyorLines.find((item) => item.id === incident.lineId)

  return (
    <div>
      <Link to="/incidents">← Назад к инцидентам</Link>

      <h2 style={{ marginTop: '16px' }}>Карточка инцидента</h2>
      <p>Ниже показана подробная информация по выбранному инциденту.</p>

      <div
        style={{
          border: '1px solid #444',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'left',
          marginTop: '20px',
        }}
      >
        <p>
          <strong>ID:</strong> {incident.id}
        </p>
        <p>
          <strong>ID события:</strong> {incident.eventId}
        </p>
        <p>
          <strong>Линия:</strong> {line ? line.name : 'Неизвестная линия'}
        </p>
        <p>
          <strong>Статус:</strong> {getStatusLabel(incident.status)}
        </p>
        <p>
          <strong>Ответственный:</strong> {incident.assignee ?? 'Не назначен'}
        </p>
        <p>
          <strong>Комментарий:</strong> {incident.comment ?? 'Нет комментария'}
        </p>
        <p>
          <strong>Создан:</strong>{' '}
          {new Date(incident.createdAt).toLocaleString('ru-RU')}
        </p>
      </div>

      <div
        style={{
          border: '1px dashed #555',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '20px',
          textAlign: 'left',
        }}
      >
        <h3>Снимок детекции</h3>
        <p>Здесь позже будет изображение и bbox-рамка детекции.</p>
      </div>

      <div style={{ marginTop: '24px', textAlign: 'left' }}>
        <h3>История статусов</h3>

        <div
          style={{
            display: 'grid',
            gap: '12px',
            marginTop: '16px',
          }}
        >
          {incident.statusHistory.map((historyItem, index) => (
            <div
              key={`${historyItem.status}-${historyItem.changedAt}-${index}`}
              style={{
                borderLeft: '3px solid #2563eb',
                paddingLeft: '12px',
              }}
            >
              <p>
                <strong>Статус:</strong> {getStatusLabel(historyItem.status)}
              </p>
              <p>
                <strong>Время:</strong>{' '}
                {new Date(historyItem.changedAt).toLocaleString('ru-RU')}
              </p>
              <p>
                <strong>Комментарий:</strong>{' '}
                {historyItem.comment ?? 'Без комментария'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default IncidentPage

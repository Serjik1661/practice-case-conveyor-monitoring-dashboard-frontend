import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { ConveyorLine, Incident } from '../shared/types'

type IncidentStatus = 'open' | 'in_progress' | 'resolved'

const getStatusLabel = (status: string) => {
  if (status === 'open') return 'Открыт'
  if (status === 'in_progress') return 'В работе'
  if (status === 'resolved') return 'Решён'

  return status
}

function IncidentPage() {
  const { id } = useParams()

  const [incident, setIncident] = useState<Incident | null>(null)
  const [lines, setLines] = useState<ConveyorLine[]>([])

  const [currentStatus, setCurrentStatus] = useState<IncidentStatus>('open')
  const [currentAssignee, setCurrentAssignee] = useState('')
  const [currentComment, setCurrentComment] = useState('')
  const [history, setHistory] = useState<Incident['statusHistory']>([])

  const [formStatus, setFormStatus] = useState<IncidentStatus>('open')
  const [formAssignee, setFormAssignee] = useState('')
  const [formComment, setFormComment] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    const loadIncident = async () => {
      if (!id) {
        setLoadError('Не удалось определить инцидент')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setLoadError('')

        const [incidentResponse, linesResponse] = await Promise.all([
          fetch(`/api/incidents/${id}`),
          fetch('/api/lines'),
        ])

        if (incidentResponse.status === 404) {
          setIncident(null)
          return
        }

        if (!incidentResponse.ok || !linesResponse.ok) {
          throw new Error('Ошибка загрузки')
        }

        const [incidentData, linesData] = await Promise.all([
          incidentResponse.json(),
          linesResponse.json(),
        ])

        setIncident(incidentData)
        setLines(linesData)

        setCurrentStatus(incidentData.status)
        setCurrentAssignee(incidentData.assignee ?? '')
        setCurrentComment(incidentData.comment ?? '')
        setHistory(incidentData.statusHistory ?? [])

        setFormStatus(incidentData.status)
        setFormAssignee(incidentData.assignee ?? '')
      } catch {
        setLoadError('Не удалось загрузить инцидент')
      } finally {
        setIsLoading(false)
      }
    }

    loadIncident()
  }, [id])

  const line = lines.find((item) => item.id === incident?.lineId)

  if (isLoading) {
    return (
      <div>
        <h2>Инцидент</h2>
        <p>Загрузка карточки...</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div>
        <h2>Инцидент</h2>
        <p>{loadError}</p>
        <Link to="/incidents">Вернуться к списку инцидентов</Link>
      </div>
    )
  }

  if (!incident) {
    return (
      <div>
        <h2>Инцидент не найден</h2>
        <Link to="/incidents">Вернуться к списку инцидентов</Link>
      </div>
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (formStatus === 'resolved' && !formComment.trim()) {
      setFormError('Comment is required for resolved status.')
      return
    }

    if (!id) {
      setFormError('Unable to determine incident id.')
      return
    }

    try {
      setIsSaving(true)
      setFormError('')

      const response = await fetch(`/api/incidents/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: formStatus,
          assignee: formAssignee.trim() ? formAssignee.trim() : null,
          comment: formComment.trim() ? formComment.trim() : null,
        }),
      })

      if (!response.ok) {
        throw new Error('Save error')
      }

      const updatedIncident: Incident = await response.json()

      setIncident(updatedIncident)
      setCurrentStatus(updatedIncident.status)
      setCurrentAssignee(updatedIncident.assignee ?? '')
      setCurrentComment(updatedIncident.comment ?? '')
      setHistory(updatedIncident.statusHistory ?? [])

      setFormStatus(updatedIncident.status)
      setFormAssignee(updatedIncident.assignee ?? '')
      setFormComment('')
    } catch {
      setFormError('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

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
          <strong>Статус:</strong> {getStatusLabel(currentStatus)}
        </p>
        <p>
          <strong>Ответственный:</strong>{' '}
          {currentAssignee ? currentAssignee : 'Не назначен'}
        </p>
        <p>
          <strong>Комментарий:</strong>{' '}
          {currentComment ? currentComment : 'Нет комментария'}
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
        <p>Below is a basic block for snapshot and bbox.</p>
        <div
          style={{
            marginTop: '12px',
            background: 'linear-gradient(135deg, #1f2937, #0f172a)',
            borderRadius: '12px',
            height: '220px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '28%',
              left: '18%',
              width: '40%',
              height: '35%',
              border: '2px solid #22c55e',
              borderRadius: '8px',
              boxShadow: '0 0 12px rgba(34, 197, 94, 0.5)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              padding: '4px 8px',
              borderRadius: '6px',
              background: 'rgba(0,0,0,0.5)',
              fontSize: '12px',
            }}
          >
            bbox: sample
          </div>
        </div>
      </div>

      <div
        style={{
          border: '1px solid #444',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '20px',
          textAlign: 'left',
        }}
      >
        <h3>Изменить статус инцидента</h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginTop: '12px' }}>
            <label>
              Статус
              <br />
              <select
                value={formStatus}
                onChange={(event) =>
                  setFormStatus(
                    event.target.value as 'open' | 'in_progress' | 'resolved',
                  )
                }
                style={{
                  marginTop: '8px',
                  padding: '8px',
                  width: '100%',
                  borderRadius: '8px',
                }}
              >
                <option value="open">Открыт</option>
                <option value="in_progress">В работе</option>
                <option value="resolved">Решён</option>
              </select>
            </label>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label>
              Ответственный
              <br />
              <input
                type="text"
                value={formAssignee}
                onChange={(event) => setFormAssignee(event.target.value)}
                placeholder="Введите имя"
                style={{
                  marginTop: '8px',
                  padding: '8px',
                  width: '100%',
                  borderRadius: '8px',
                }}
              />
            </label>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label>
              Комментарий
              <br />
              <textarea
                value={formComment}
                onChange={(event) => setFormComment(event.target.value)}
                placeholder="Введите комментарий"
                rows={4}
                style={{
                  marginTop: '8px',
                  padding: '8px',
                  width: '100%',
                  borderRadius: '8px',
                }}
              />
            </label>
          </div>

          {formError && (
            <p
              style={{
                color: '#ef4444',
                marginTop: '12px',
              }}
            >
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSaving}
            style={{
              marginTop: '16px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #444',
              background: isSaving ? '#1e40af' : '#2563eb',
              color: '#fff',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.8 : 1,
            }}
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
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
          {history.map((historyItem, index) => (
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

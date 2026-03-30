import type { ConveyorLine } from '../shared/types/index'
import { conveyorLines } from '../mocks/fixtures'

const statusLabels: Record<ConveyorLine['status'], string> = {
  active: 'Работает',
  alarm: 'Тревога',
  idle: 'Ожидание',
  offline: 'Оффлайн',
}

function OverviewPage() {
  return (
    <div>
      <h2>Обзор</h2>
      <p>Ниже показаны тестовые конвейерные линии.</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginTop: '20px',
        }}
      >
        {conveyorLines.map((line) => (
          <div
            key={line.id}
            style={{
              border: '1px solid #444',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'left',
            }}
          >
            <h3>{line.name}</h3>
            <p>Статус: {statusLabels[line.status]}</p>
            <p>Скорость: {line.speed} м/с</p>
            <p>Нагрузка: {line.load}%</p>
            <p>Камер: {line.cameraCount}</p>
            <p>Тревог за час: {line.alertsLastHour}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OverviewPage

import { useState } from 'react'
import { shiftReports } from '../mocks/fixtures'

function ReportPage() {
  const [selectedDate, setSelectedDate] = useState('2026-03-31')
  const [selectedShift, setSelectedShift] = useState<'morning' | 'day' | 'night'>(
    'morning',
  )

  const report = shiftReports.find(
    (item) => item.date === selectedDate && item.shift === selectedShift,
  )

  return (
    <div>
      <h2>Отчёт</h2>
      <p>Ниже показан тестовый отчёт по выбранной дате и смене.</p>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          marginTop: '20px',
          textAlign: 'left',
        }}
      >
        <div>
          <label>
            Дата
            <br />
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              style={{
                marginTop: '8px',
                padding: '8px',
                borderRadius: '8px',
              }}
            />
          </label>
        </div>

        <div>
          <label>
            Смена
            <br />
            <select
              value={selectedShift}
              onChange={(event) =>
                setSelectedShift(
                  event.target.value as 'morning' | 'day' | 'night',
                )
              }
              style={{
                marginTop: '8px',
                padding: '8px',
                borderRadius: '8px',
              }}
            >
              <option value="morning">Утро</option>
              <option value="day">День</option>
              <option value="night">Ночь</option>
            </select>
          </label>
        </div>
      </div>

      {!report ? (
        <div
          style={{
            border: '1px solid #444',
            borderRadius: '12px',
            padding: '16px',
            marginTop: '20px',
            textAlign: 'left',
          }}
        >
          <p>Для выбранной даты и смены данных пока нет.</p>
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginTop: '20px',
            }}
          >
            <div
              style={{
                border: '1px solid #444',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'left',
              }}
            >
              <h3>Всего событий</h3>
              <p>{report.totalEvents}</p>
            </div>

            <div
              style={{
                border: '1px solid #444',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'left',
              }}
            >
              <h3>Критических событий</h3>
              <p>{report.criticalEvents}</p>
            </div>

            <div
              style={{
                border: '1px solid #444',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'left',
              }}
            >
              <h3>Среднее время реакции</h3>
              <p>{report.avgResponseMinutes} мин</p>
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
            <h3>События по часам</h3>

            <div
              style={{
                display: 'grid',
                gap: '10px',
                marginTop: '16px',
              }}
            >
              {report.byHour.map((item) => (
                <div key={item.hour}>
                  <p>
                    {item.hour}:00 — {item.count}
                  </p>
                </div>
              ))}
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
            <h3>События по линиям</h3>

            <div
              style={{
                display: 'grid',
                gap: '10px',
                marginTop: '16px',
              }}
            >
              {report.byLine.map((item) => (
                <div key={item.lineId}>
                  <p>
                    {item.lineName} — {item.count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ReportPage

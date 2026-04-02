import { useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts'
import { shiftReports } from '../mocks/fixtures'

function ReportPage() {
  const [selectedDate, setSelectedDate] = useState('2026-03-31')
  const [selectedShift, setSelectedShift] = useState<'morning' | 'day' | 'night'>(
    'morning',
  )

  const report = shiftReports.find(
    (item) => item.date === selectedDate && item.shift === selectedShift,
  )

  const handleExportCsv = () => {
  if (!report) return

  const escapeCsvValue = (value: string | number) => {
    return `"${String(value).replace(/"/g, '""')}"`
  }

  const rows: Array<Array<string | number>> = [
    ['Дата', report.date],
    ['Смена', report.shift],
    ['Всего событий', report.totalEvents],
    ['Критических событий', report.criticalEvents],
    ['Среднее время реакции', report.avgResponseMinutes],
    [],
    ['События по часам'],
    ['Час', 'Количество'],
    ...report.byHour.map((item) => [`${item.hour}:00`, item.count]),
    [],
    ['События по линиям'],
    ['Линия', 'Количество'],
    ...report.byLine.map((item) => [item.lineName, item.count]),
  ]

  const csvContent = rows
    .map((row) => row.map((cell) => escapeCsvValue(cell)).join(';'))
    .join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `report-${report.date}-${report.shift}.csv`
  link.click()

  URL.revokeObjectURL(url)
}

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
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
                onClick={handleExportCsv}
                disabled={!report}
                style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #444',
                background: report ? '#2563eb' : '#374151',
                color: '#fff',
                cursor: report ? 'pointer' : 'not-allowed',
                }}
                >
                Экспорт в CSV
            </button>
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
            <h3>График событий по часам</h3>

            <div style={{ width: '100%', height: '300px', marginTop: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={report.byHour}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="hour"
                    stroke="#d1d5db"
                    tickFormatter={(value) => `${value}:00`}
                  />
                  <YAxis stroke="#d1d5db" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value) => [`${value}`, 'События']}
                    labelFormatter={(label) => `Час: ${label}:00`}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#60a5fa"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
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
            <h3>График событий по линиям</h3>

            <div style={{ width: '100%', height: '300px', marginTop: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.byLine}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="lineName" stroke="#d1d5db" />
                  <YAxis stroke="#d1d5db" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value) => [`${value}`, 'События']}
                  />
                  <Bar dataKey="count" fill="#22c55e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ReportPage

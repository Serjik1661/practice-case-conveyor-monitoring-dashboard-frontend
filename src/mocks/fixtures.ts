import type { ConveyorLine, Incident, ShiftReport } from '../shared/types'

export const conveyorLines: ConveyorLine[] = [
  {
    id: 'line-1',
    name: 'Линия 1-Север',
    status: 'active',
    speed: 2.4,
    load: 68,
    cameraCount: 4,
    alertsLastHour: 1,
  },
  {
    id: 'line-2',
    name: 'Линия 2-Юг',
    status: 'alarm',
    speed: 1.8,
    load: 91,
    cameraCount: 3,
    alertsLastHour: 5,
  },
  {
    id: 'line-3',
    name: 'Линия 3-Запад',
    status: 'idle',
    speed: 0,
    load: 0,
    cameraCount: 2,
    alertsLastHour: 0,
  },
  {
    id: 'line-4',
    name: 'Линия 4-Восток',
    status: 'offline',
    speed: 0,
    load: 0,
    cameraCount: 5,
    alertsLastHour: 2,
  },
]

export const incidents: Incident[] = [
  {
    id: 'incident-1',
    eventId: 'event-1',
    lineId: 'line-2',
    status: 'open',
    assignee: 'Иван Петров',
    comment: null,
    createdAt: '2026-03-31T09:20:00Z',
    statusHistory: [
      {
        status: 'open',
        changedAt: '2026-03-31T09:20:00Z',
      },
    ],
  },
  {
    id: 'incident-2',
    eventId: 'event-2',
    lineId: 'line-4',
    status: 'in_progress',
    assignee: 'Анна Смирнова',
    comment: 'Проверяется камера',
    createdAt: '2026-03-31T08:45:00Z',
    statusHistory: [
      {
        status: 'open',
        changedAt: '2026-03-31T08:45:00Z',
      },
      {
        status: 'in_progress',
        changedAt: '2026-03-31T08:55:00Z',
        comment: 'Проверяется камера',
      },
    ],
  },
  {
    id: 'incident-3',
    eventId: 'event-3',
    lineId: 'line-1',
    status: 'resolved',
    assignee: 'Сергей Волков',
    comment: 'Ложное срабатывание',
    createdAt: '2026-03-31T07:10:00Z',
    statusHistory: [
      {
        status: 'open',
        changedAt: '2026-03-31T07:10:00Z',
      },
      {
        status: 'resolved',
        changedAt: '2026-03-31T07:25:00Z',
        comment: 'Ложное срабатывание',
      },
    ],
  },
]

export const shiftReports: ShiftReport[] = [
  {
    date: '2026-03-31',
    shift: 'morning',
    totalEvents: 18,
    criticalEvents: 4,
    avgResponseMinutes: 7,
    byHour: [
      { hour: 8, count: 2 },
      { hour: 9, count: 4 },
      { hour: 10, count: 3 },
      { hour: 11, count: 5 },
      { hour: 12, count: 4 },
    ],
    byLine: [
      { lineId: 'line-1', lineName: 'Линия 1-Север', count: 3 },
      { lineId: 'line-2', lineName: 'Линия 2-Юг', count: 8 },
      { lineId: 'line-3', lineName: 'Линия 3-Запад', count: 2 },
      { lineId: 'line-4', lineName: 'Линия 4-Восток', count: 5 },
    ],
  },
  {
    date: '2026-03-31',
    shift: 'day',
    totalEvents: 24,
    criticalEvents: 6,
    avgResponseMinutes: 9,
    byHour: [
      { hour: 13, count: 3 },
      { hour: 14, count: 5 },
      { hour: 15, count: 4 },
      { hour: 16, count: 6 },
      { hour: 17, count: 6 },
    ],
    byLine: [
      { lineId: 'line-1', lineName: 'Линия 1-Север', count: 4 },
      { lineId: 'line-2', lineName: 'Линия 2-Юг', count: 10 },
      { lineId: 'line-3', lineName: 'Линия 3-Запад', count: 3 },
      { lineId: 'line-4', lineName: 'Линия 4-Восток', count: 7 },
    ],
  },
  {
    date: '2026-03-30',
    shift: 'night',
    totalEvents: 12,
    criticalEvents: 2,
    avgResponseMinutes: 5,
    byHour: [
      { hour: 1, count: 1 },
      { hour: 2, count: 2 },
      { hour: 3, count: 3 },
      { hour: 4, count: 2 },
      { hour: 5, count: 4 },
    ],
    byLine: [
      { lineId: 'line-1', lineName: 'Линия 1-Север', count: 2 },
      { lineId: 'line-2', lineName: 'Линия 2-Юг', count: 4 },
      { lineId: 'line-3', lineName: 'Линия 3-Запад', count: 1 },
      { lineId: 'line-4', lineName: 'Линия 4-Восток', count: 5 },
    ],
  },
]

import type { ConveyorLine, Incident } from '../shared/types'

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

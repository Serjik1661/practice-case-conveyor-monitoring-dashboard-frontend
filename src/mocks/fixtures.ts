import type { ConveyorLine } from '../shared/types'

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

# Практическое задание: Дашборд мониторинга конвейерных линий

> **Стек:** React 18 · TypeScript · Vite · TanStack Query · Zustand · MSW  
> **Фокус оценки:** архитектура приложения + производительность (Core Web Vitals)  
---

## 1. Контекст задачи

Операторы смены на горно-обогатительных комбинатах следят за десятками конвейерных линий одновременно. Разрозненные интерфейсы заставляют переключаться между окнами — оператор теряет время и пропускает критические тревоги.

Задача — разработать **единый SPA-дашборд**, который:
- агрегирует телеметрию с конвейерных линий в реальном времени,
- отображает события детекции рудозасорения (от ML-системы),
- позволяет оператору управлять очередью инцидентов.

Это **frontend-only** проект. Весь «бэкенд» эмулируется через MSW (Mock Service Worker) прямо в браузере. Разработка мокового API является частью задания.

---

## 2. Мок-бэкенд (MSW)

### Что нужно реализовать в `src/mocks/`

#### REST handlers (`handlers.ts`)

```ts
// Пример структуры — схемы данных определяете сами
GET  /api/lines                    // список конвейерных линий (6–24 шт.)
GET  /api/lines/:id                // детали одной линии
GET  /api/incidents                // список инцидентов, query: ?page=&limit=&status=&lineId=&from=&to=
GET  /api/incidents/:id            // детальная карточка инцидента
PATCH /api/incidents/:id           // обновление статуса / ответственного
GET  /api/report                   // агрегированные данные за смену, query: ?date=&shift=
```

#### WebSocket handler

```ts
WS /ws/events
// Сервер эмитирует DetectionEvent каждые 3–8 секунд (случайный интервал)
// ~15% событий имеют confidence > 0.85 (критические тревоги)
// ~5% событий — статус камеры "offline"
```

#### Требования к мок-данным

- Данные **детерминированы по seed** — одинаковый `seed` даёт одинаковые данные при каждом запуске (для воспроизводимости тестов).
- Пагинация работает корректно: `total`, `page`, `limit` в ответе.

#### Стартовые данные

В репозитории поставляется файл `src/mocks/fixtures.ts` с базовыми типами и seed-функцией.

---

## 3. Сущности предметной области

Типы важно определять в `src/shared/types/`. Ниже — **минимально необходимые поля**; поля могут быть расширены.

```ts
interface ConveyorLine {
  id: string
  name: string                         // 'Линия 3-Север'
  status: 'active' | 'alarm' | 'idle' | 'offline'
  speed: number                        // м/с
  load: number                        
  cameraCount: number
  alertsLastHour: number
}

interface DetectionEvent {
  id: string
  lineId: string
  cameraId: string
  timestamp: string                    // ISO 8601
  type: 'waste_rock' | 'anomaly'
  confidence: number                   // 0–1
  bbox: { x: number; y: number; w: number; h: number }  // относительные координаты на изображении
  snapshotUrl: string                  // base64 или placeholder URL
}

interface Incident {
  id: string
  eventId: string
  lineId: string
  status: 'open' | 'in_progress' | 'resolved'
  assignee: string | null
  comment: string | null
  createdAt: string
  statusHistory: Array<{ status: string; changedAt: string; comment?: string }>
}

interface ShiftReport {
  date: string
  shift: 'morning' | 'day' | 'night'
  totalEvents: number
  criticalEvents: number
  avgResponseMinutes: number
  byHour: Array<{ hour: number; count: number }>
  byLine: Array<{ lineId: string; lineName: string; count: number }>
}
```

---

## 4. Функциональные требования

### 4.1 Страница «Обзор» (`/`)

- Grid-сетка карточек конвейерных линий (адаптивная: 2/3/4 колонки).
- Карточка показывает: название, статус (цветовой индикатор + label), скорость, нагрузку, количество тревог за час.
- При поступлении WS-события карточка соответствующей линии визуально пульсирует **без перерисовки соседних карточек** — проверяется через React DevTools Profiler.
- Фильтр по статусу (`all / active / alarm / offline`) синхронизирован с URL (`?status=alarm`).
- При статусе `alarm` карточка выделяется; при `offline` — приглушается.

### 4.2 Страница «Инциденты» (`/incidents`)

- Таблица с **серверной пагинацией** (параметры `?page=1&limit=20` в URL).
- Фильтры: статус, линия, диапазон дат — все отражены в URL и восстанавливаются при перезагрузке.
- Сортировка по колонкам (параметр `?sort=createdAt&order=desc` в URL).

### 4.3 Страница «Инцидент» (`/incidents/:id`)

- Детальная карточка с метаданными события.
- **Отрисовка bbox** детекции поверх снимка через `<canvas>` или `<svg>` overlay.
- Форма смены статуса: переход в `resolved` требует обязательного комментария (валидация на клиенте).
- **Timeline** истории статусов (вертикальный список с временными метками).

### 4.4 Страница «Отчёт» (`/report`)

- Выбор даты и смены (утро / день / ночь).
- Три чарта через **Recharts**:
  - `LineChart` — события по часам за смену;
  - `BarChart` — распределение по линиям;
- **Экспорт в CSV** — реализовать вручную через `Blob` + `URL.createObjectURL`, без библиотек.

### 4.5 Центр уведомлений (глобальный)

- Toast-уведомления при `confidence > 0.85` — появляются в углу экрана, автоматически исчезают через 5 сек.
- Звуковой сигнал при критическом событии (Web Audio API — `AudioContext`).
- Счётчик непрочитанных в шапке (`<header>`).
- Настройки «звук вкл/выкл» и «уведомления вкл/выкл» сохраняются в `localStorage`.

---

## 5. Технические требования

### 5.1 Обязательный стек

| Категория | Инструмент | Примечание |
|---|---|---|
| Фреймворк | React 18 | `useTransition`, `Suspense`, `lazy` — обязательны |
| Язык | TypeScript 5 | `strict: true`, `noImplicitAny: true`, 0 ошибок `tsc` |
| Сборщик | Vite 5 | |
| Роутинг | React Router v6 | loader API для prefetch данных |
| Мок-сервер | MSW 2.x | REST + WebSocket handlers |
| CSS | CSS Modules **или** Tailwind | единообразно по всему проекту |



---

## 6. Требования к сдаче

| Артефакт | Описание |
|---|---|
| **GitHub репозиторий** | Публичный, с историей коммитов (не один коммит «done»). Является форком репозитория с заданием |
| **Deploy** | Vercel / Netlify / GitHub Pages — обязателен |
| **Отчет по форме университета** | С описанием проекта |


> **Примечание по дизайну:** визуальное оформление не оценивается формально, составляется из готовых библиотек/компонентов.

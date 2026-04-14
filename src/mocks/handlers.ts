import { http, HttpResponse } from 'msw'
import { conveyorLines, incidents } from './fixtures'

export const handlers = [
  http.get('/api/lines', () => {
    return HttpResponse.json(conveyorLines)
  }),
  http.get('/api/incidents', () => {
    return HttpResponse.json(incidents)
  }),
  http.get('/api/incidents/:id', ({ params }) => {
    const incident = incidents.find((item) => item.id === params.id)

    if (!incident) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(incident)
  }),
  http.patch('/api/incidents/:id', async ({ params, request }) => {
    const incident = incidents.find((item) => item.id === params.id)

    if (!incident) {
      return new HttpResponse(null, { status: 404 })
    }

    const body = (await request.json()) as {
      status?: 'open' | 'in_progress' | 'resolved'
      assignee?: string | null
      comment?: string | null
    }

    if (body.status) {
      incident.status = body.status
    }

    if (body.assignee !== undefined) {
      incident.assignee = body.assignee
    }

    if (body.comment !== undefined) {
      incident.comment = body.comment
    }

    incident.statusHistory = [
      ...incident.statusHistory,
      {
        status: incident.status,
        changedAt: new Date().toISOString(),
        comment: body.comment ?? undefined,
      },
    ]

    return HttpResponse.json(incident)
  }),
]

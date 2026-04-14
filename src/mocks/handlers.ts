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
]

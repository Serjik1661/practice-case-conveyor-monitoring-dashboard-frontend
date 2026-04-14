import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import OverviewPage from './pages/OverviewPage'
import IncidentsPage from './pages/IncidentsPage'
import IncidentPage from './pages/IncidentPage'
import ReportPage from './pages/ReportPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
      {
        path: 'incidents',
        element: <IncidentsPage />,
      },
      {
        path: 'incidents/:id',
        element: <IncidentPage />,
      },
      {
        path: 'report',
        element: <ReportPage />,
      },
    ],
  },
])

async function prepareMocks() {
  const { worker } = await import('./mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}

prepareMocks()
  .catch(() => {
    // If the worker cannot start, still render the app so the UI does not go blank.
  })
  .finally(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>,
    )
  })

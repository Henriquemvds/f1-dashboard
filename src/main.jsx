import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(

    <RouterProvider router={router} />

)
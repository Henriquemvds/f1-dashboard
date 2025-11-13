import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
    {
    path: '/drivers',
    element: <Dashboard />
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(

    <RouterProvider router={router} />

)
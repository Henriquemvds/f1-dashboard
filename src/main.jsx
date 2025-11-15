import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter, BrowserRouter } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import About from './pages/About'
import ArticlePage from "./pages/ArticlePage";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/drivers',
    element: <Dashboard />
  },
  {
    path: "/article/:id",
    element: <ArticlePage />
  },
  {
    path: '/about',
    element: <About />
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(

  <RouterProvider router={router} />

)
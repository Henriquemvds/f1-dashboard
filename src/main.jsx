import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter, BrowserRouter } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import About from './pages/About'
import ArticlePage from "./pages/ArticlePage";
import EventsCalendar from "./pages/EventsCalendar";
import Results from "./pages/Results";
import Guide from "./pages/Guide";
import BioDriver from "./pages/BioDriver";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/pilotos',
    element: <Dashboard />
  },
  {
    path: '/piloto/:id',
    element: <BioDriver />
  },
  {
    path: "/artigo/:id",
    element: <ArticlePage />
  },
   {
    path: "/resultados",
    element: <Results />
  },
   {
    path: '/calendario',
    element: <EventsCalendar />
  },
    {
    path: '/guia',
    element: <Guide />
  },
  {
    path: '/sobre',
    element: <About />
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(

  <RouterProvider router={router} />

)
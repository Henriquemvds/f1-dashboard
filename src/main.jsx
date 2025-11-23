import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter, BrowserRouter } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import About from './pages/About'
import ArticlePage from "./pages/ArticlePage";
import EventsCalendar from "./pages/EventsCalendar";
import Results from "./pages/Results";
import BioDriver from "./pages/BioDriver";

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
    path: '/driver/:id',
    element: <BioDriver />
  },
  {
    path: "/article/:id",
    element: <ArticlePage />
  },
   {
    path: "/results",
    element: <Results />
  },
   {
    path: '/calendar',
    element: <EventsCalendar />
  },
  {
    path: '/about',
    element: <About />
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(

  <RouterProvider router={router} />

)
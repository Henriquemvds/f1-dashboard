// pages/_app.jsx  // CSS global
import '../styles/_index.css';
import '../styles/ResultsPilots.css';
import '../styles/Pilots.css';
import '../styles/Home.css';
import '../styles/EventsCalendar.css';
import '../styles/Guide.css';
import '../styles/Circuits.css';
import '../styles/BioDriver.css';
import '../styles/About.css';
import '../styles/ArticlePage.css';
import '../styles/Footer.css';
import '../styles/Navbar.css';
import '../styles/Results.css';
import '../styles/MaintenanceMessage.css';
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
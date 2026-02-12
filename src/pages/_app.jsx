import '../styles/index.css' // CSS global
import "../styles/Home.css";
import "../styles/Footer.css";
import "../styles/Navbar.css";
import "../styles/ArticlePage.css";
import "../styles/About.css";
import "../styles/EventsCalendar.css"
import "../styles/Pilots.css";
import "../styles/Results.css";
import  "../styles/MaintenanceMessage.css";
import "../styles/ResultsPilots.css"
import "../styles/Guide.css";
import "../styles/Circuits.css"
import "../styles/BioDriver.css";
import "../styles/FaqF1.css";
import React from 'react';

export default function MyApp({ Component, pageProps }) {
  // Component é a página atual
  // pageProps vem de getStaticProps / getServerSideProps
  return <Component {...pageProps} />;
}
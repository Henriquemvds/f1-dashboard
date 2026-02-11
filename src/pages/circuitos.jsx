// pages/circuitos.jsx
import { useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

export default function Circuits() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedYears, setExpandedYears] = useState({});

  useEffect(() => {
    async function fetchMeetings() {
      try {
        const res = await fetch("https://api.openf1.org/v1/meetings");
        const data = await res.json();
        setMeetings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao buscar meetings:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchMeetings();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p>Erro ao carregar dados.</p>;

  // Agrupa os meetings por ano
  const meetingsByYear = meetings.reduce((acc, m) => {
    const year = m.year || "Desconhecido";
    if (!acc[year]) acc[year] = [];
    acc[year].push(m);
    return acc;
  }, {});

  // Ordena os anos do mais recente para o mais antigo
  const sortedYears = Object.keys(meetingsByYear).sort((a, b) => b - a);

  const toggleYear = (year) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  function translateCircuitType(type = "") {
    if (type.includes("Permanent")) return "Permanente";
    if (type.includes("Temporary - Street")) return "Temporário - Rua";
    return type;
  }

  function buildCircuitsDescription(meetings = []) {
    if (!meetings.length) {
      return "Lista completa de circuitos da Fórmula 1, com localização, tipo de pista e imagens oficiais.";
    }
    const recent = meetings.slice(0, 3).map(m => m.meeting_name).join(" • ");
    return `Circuitos da Fórmula 1™: ${recent} e outros. Detalhes sobre localização, tipo de pista e datas das corridas.`;
  }

  const pageTitle = "Circuitos de Fórmula 1 | Localização, tipo de pista e datas";
  const pageDescription = buildCircuitsDescription(meetings);

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://www.blog-f1-dashboard.com/circuitos" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

        {/* CollectionPage Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Circuitos da Fórmula 1™",
            description: pageDescription,
            url: "https://www.blog-f1-dashboard.com/circuitos",
            inLanguage: "pt-BR",
            isPartOf: {
              "@type": "WebSite",
              name: "Blog F1 Dash",
              url: "https://www.blog-f1-dashboard.com/"
            }
          })}
        </script>

        {/* ItemList – circuitos */}
        {meetings.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: meetings.map((m, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "SportsEvent",
                  name: `${m.meeting_name} — Fórmula 1™`,
                  startDate: m.date_start,
                  endDate: m.date_end,
                  location: {
                    "@type": "Place",
                    name: m.circuit_short_name,
                    address: {
                      "@type": "PostalAddress",
                      addressLocality: m.location,
                      addressCountry: m.country_name
                    }
                  },
                  image: m.circuit_image,
                  eventStatus: new Date(m.date_end) < new Date()
                    ? "https://schema.org/EventCompleted"
                    : "https://schema.org/EventScheduled",
                  url: `https://www.blog-f1-dashboard.com/circuitos#${m.meeting_key}`
                }
              }))
            })}
          </script>
        )}
      </Head>

      <Navbar />

      {sortedYears.length === 0 && <p>Nenhum meeting encontrado.</p>}

      <div className="list-circuits">
        {sortedYears.map((year) => (
          <section className="year-block-circuits" key={year}>
            <h2 className="year-title-circuits" onClick={() => toggleYear(year)}>
              Circuitos de {year} {expandedYears[year] ? "▼" : "►"}
            </h2>

            {expandedYears[year] && (
              <div className="circuits-grid-2x2">
                {meetingsByYear[year].map((m) => (
                  <div
                    className="circuit-card"
                    key={m.meeting_key}
                    itemScope
                    itemType="https://schema.org/SportsEvent"
                  >
                    <div className="circuit-header">
                      <span className="circuit-name">{m.meeting_name}</span>
                      {m.country_flag && (
                        <img
                          className="circuit-flag"
                          src={m.country_flag}
                          alt={`${m.country_name} flag`}
                        />
                      )}
                    </div>
                    <p className="circuit-meta">{m.location}, {m.country_name}</p>
                    <p className="circuit-info">
                      Circuito: {m.circuit_short_name} ({translateCircuitType(m.circuit_type)})
                    </p>
                    {m.circuit_image && (
                      <img
                        className="circuit-image"
                        src={m.circuit_image}
                        alt={`${m.circuit_short_name} track`}
                      />
                    )}
                    <p className="circuit-info">
                      Início: {new Date(m.date_start).toLocaleString()} <br />
                      Fim: {new Date(m.date_end).toLocaleString()} <br />
                      GMT Offset: {m.gmt_offset}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      <Footer />
    </div>
  );
}

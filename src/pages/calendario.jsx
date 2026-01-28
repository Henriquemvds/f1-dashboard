// pages/calendario.jsx
import { useState } from "react";
import Head from "next/head";
import { EVENTS_2026 } from "../data/EventsCalendar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function getEventEndDate(event) {
  try {
    return new Date(event.weekend.end);
  } catch {
    return null;
  }
}

export default function EventsCalendar() {
  const [query, setQuery] = useState("");
  const [onlySprint, setOnlySprint] = useState(false);
  const [expandedRound, setExpandedRound] = useState(null);

  const filtered = EVENTS_2026.filter(e => {
    const q = query.trim().toLowerCase();
    if (onlySprint && !e.sprint) return false;
    if (!q) return true;
    return (
      e.gp.toLowerCase().includes(q) ||
      e.circuit.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q)
    );
  });

  function formatDateBR(dateStr) {
    const date = new Date(dateStr + "T00:00:00");
    const months = [
      "jan","fev","mar","abr","mai","jun",
      "jul","ago","set","out","nov","dez"
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  }

  function buildCalendarDescription(events = []) {
    if (!events.length) {
      return "Calendário oficial da temporada 2026 da Fórmula 1™, com datas, circuitos e fins de semana de corrida.";
    }
    const first = events[0];
    const last = events[events.length - 1];
    return `Calendário completo das corridas Fórmula 1™ 2026: ${events.length} etapas, de ${first.gp} até ${last.gp}, com datas, circuitos e corridas sprint.`;
  }

  const pageTitle = "Calendário das corridas F1™ 2026 | Datas, circuitos e corridas sprint";
  const pageDescription = buildCalendarDescription(EVENTS_2026);

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://www.blog-f1-dashboard.com/calendario" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

        {/* EventSeries JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            name: "Campeonato Mundial de Fórmula 1™ 2026",
            sport: "Formula One",
            startDate: EVENTS_2026[0]?.weekend.start,
            endDate: EVENTS_2026[EVENTS_2026.length - 1]?.weekend.end,
            location: { "@type": "Place", name: "Circuitos internacionais" },
            organizer: { "@type": "Organization", name: "Formula 1" },
            url: "https://www.blog-f1-dashboard.com/calendario"
          })}
        </script>

        {/* Lista de eventos JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: EVENTS_2026.map((e, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "SportsEvent",
                name: `${e.gp} — Fórmula 1™ 2026`,
                startDate: e.weekend.start,
                endDate: e.weekend.end,
                location: {
                  "@type": "Place",
                  name: e.circuit,
                  address: { "@type": "PostalAddress", addressLocality: e.location }
                },
                eventStatus: getEventEndDate(e) < new Date()
                  ? "https://schema.org/EventCompleted"
                  : "https://schema.org/EventScheduled",
                url: "https://www.blog-f1-dashboard.com/calendario"
              }
            }))
          })}
        </script>
      </Head>

      <Navbar />

      <div className="events-page">
        <header className="events-header">
          <h1>Calendário de Corridas — F1™ 2026</h1>
          <p>Calendário compilado a partir do calendário oficial (temporada 2026).</p>

          <div className="events-controls">
            <input
              type="search"
              placeholder="Buscar por GP, circuito ou país..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar corridas"
            />

            <label className="checkbox">
              <input
                type="checkbox"
                checked={onlySprint}
                onChange={(e) => setOnlySprint(e.target.checked)}
              />
              Mostrar apenas Sprint
            </label>
          </div>
        </header>

        <main className="events-list">
          {filtered.length === 0 ? (
            <p className="no-results">Nenhum evento encontrado.</p>
          ) : (
            filtered.map((e) => {
              const endDate = getEventEndDate(e);
              const isPastEvent = endDate && endDate < new Date();

              return (
                <article key={e.round} className="event-card">
                  <div className="event-left">
                    <div className="round">R{e.round}</div>
                    <div className="gp">{e.gp}</div>
                    <div className="circuit">{e.circuit}</div>
                    <div className="location">{e.location}</div>
                  </div>

                  <div className="event-right">
                    <div className="weekend">
                      {formatDateBR(e.weekend.start)} — {formatDateBR(e.weekend.end)}
                    </div>
                    <div className="meta">
                      {e.sprint && <span className="badge sprint">Sprint</span>}
                      {isPastEvent && <span className="badge past">Encerrado</span>}

                      <button
                        className="toggle"
                        onClick={() =>
                          setExpandedRound(expandedRound === e.round ? null : e.round)
                        }
                        aria-expanded={expandedRound === e.round}
                      >
                        {expandedRound === e.round ? "Fechar" : "Ver detalhes"}
                      </button>
                    </div>

                    {expandedRound === e.round && (
                      <div className="details">
                        <p><strong>Treino Livre 1:</strong> {formatDateBR(e.fp1_date)} — {e.fp1_time}</p>
                        {e.fp2_date && <p><strong>Treino Livre 2:</strong> {formatDateBR(e.fp2_date)} — {e.fp2_time}</p>}
                        {e.fp3_date && <p><strong>Treino Livre 3:</strong> {formatDateBR(e.fp3_date)} — {e.fp3_time}</p>}
                        <p><strong>Classificação:</strong> {formatDateBR(e.qualy_date)} — {e.qualy_time}</p>
                        <p><strong>Corrida:</strong> {formatDateBR(e.race_date)} — {e.race_time}</p>
                        <p className="small">
                          Dados compilados a partir de fontes oficiais e cobertura pública.
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </main>

        <footer className="events-footer">
          <small>
            Fonte: <a href="https://www.formula1.com/">Formula1.com</a> (calendário oficial) e reports públicos sobre sprint races.
          </small>
        </footer>
      </div>

      <Footer />
    </div>
  );
}

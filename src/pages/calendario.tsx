"use client";

import { useState } from "react";
import Head from "next/head";
import { EVENTS_2026 } from "../data/EventsCalendar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export interface Event {
  round: number;
  gp: string;
  circuit: string;
  location: string;
  weekend: { start: string; end: string };
  sprint: boolean;
  fp1_date: string;
  fp1_time: string;
  fp2_date?: string | null;
  fp2_time?: string | null;
  fp3_date?: string | null;
  fp3_time?: string | null;
  qualy_date: string;
  qualy_time: string;
  race_date: string;
  race_time: string;
}

// Converte string para Date com fallback
function getEventEndDate(event: Event): Date | null {
  try {
    return new Date(event.weekend.end);
  } catch {
    return null;
  }
}

// Converte data para formato brasileiro
function formatDateBR(dateStr?: string | null) {
  if (!dateStr) return "–";
  const date = new Date(dateStr + "T00:00:00");

  const months = [
    "jan","fev","mar","abr","mai","jun",
    "jul","ago","set","out","nov","dez"
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];

  return `${day} ${month}`;
}

export default function EventsCalendar() {
  const [query, setQuery] = useState<string>("");
  const [onlySprint, setOnlySprint] = useState<boolean>(false);
  const [expandedRound, setExpandedRound] = useState<number | null>(null);

  const filtered = EVENTS_2026.filter((e) => {
    const q = query.trim().toLowerCase();
    if (onlySprint && !e.sprint) return false;
    if (!q) return true;
    return (
      e.gp.toLowerCase().includes(q) ||
      e.circuit.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q)
    );
  });

  // Agrupa por ano
  const meetingsByYear = filtered.reduce<Record<string, Event[]>>((acc, m) => {
    const year = new Date(m.weekend.start).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(m);
    return acc;
  }, {});

  const sortedYears = Object.keys(meetingsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div>
      <Head>
        <title>Calendário de Corridas — F1™ 2026</title>
        <link
          rel="canonical"
          href="https://www.blog-f1-dashboard.com/calendario"
        />
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
              const isPastEvent = endDate ? endDate < new Date() : false;

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
                        <p>
                          <strong>Treino Livre 1:</strong> {formatDateBR(e.fp1_date)} — {e.fp1_time}
                        </p>

                        {e.fp2_date && e.fp2_time && (
                          <p>
                            <strong>Treino Livre 2:</strong> {formatDateBR(e.fp2_date)} — {e.fp2_time}
                          </p>
                        )}

                        {e.fp3_date && e.fp3_time && (
                          <p>
                            <strong>Treino Livre 3:</strong> {formatDateBR(e.fp3_date)} — {e.fp3_time}
                          </p>
                        )}

                        <p>
                          <strong>Classificação:</strong> {formatDateBR(e.qualy_date)} — {e.qualy_time}
                        </p>
                        <p>
                          <strong>Corrida:</strong> {formatDateBR(e.race_date)} — {e.race_time}
                        </p>

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
            Fonte: <a href="https://www.formula1.com/"> Formula1.com </a> (calendário oficial) e reports públicos sobre sprint races.
          </small>
        </footer>

        <Footer />
      </div>
    </div>
  );
}

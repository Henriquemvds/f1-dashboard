import React, { useState } from "react";
import { EVENTS_2025 } from "../data/EventsCalendar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/EventsCalendar.css";

// Agora a data final vem de weekend.end (YYYY-MM-DD)
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

    const filtered = EVENTS_2025.filter(e => {
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
            "jan", "fev", "mar", "abr", "mai", "jun",
            "jul", "ago", "set", "out", "nov", "dez"
        ];

        const day = date.getDate();
        const month = months[date.getMonth()];

        return `${day} ${month}`;
    }
    return (
        <div>
            <Navbar />
            <div className="events-page">
                <header className="events-header">
                    <h1>Calendário de Corridas — F1 2025</h1>
                    <p>Calendário compilado a partir do calendário oficial (temporada 2025).</p>

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

                                                {e.fp2_date && (
                                                    <p><strong>Treino Livre 2:</strong> {formatDateBR(e.fp2_date)} — {e.fp2_time}</p>
                                                )}

                                                {e.fp3_date && (
                                                    <p><strong>Treino Livre 3:</strong> {formatDateBR(e.fp3_date)} — {e.fp3_time}</p>
                                                )}

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
                    <small>Fonte: <a href="https://www.formula1.com/"> Formula1.com </a> (calendário oficial) e reports públicos sobre sprint races.</small>
                </footer>
            </div>
            <Footer />
        </div>
    );
}

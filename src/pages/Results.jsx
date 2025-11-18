import React, { useEffect, useState } from "react";
import NotRegistered from "../images/pilot-not-registered.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Pilots.css";
import "../styles/Results.css";
import ResultsPilots from "../components/ResultsPilots.jsx";

// =============== TRADUÇÃO DE TIPOS DE SESSÃO ===============
function translateSessionType(type = "") {
    const t = type.toLowerCase();

    if (t.includes("practice")) {
        const num = type.match(/\d+/)?.[0] || "";
        return `Treino Livre ${num}`.trim();
    }
    if (t.includes("qualifying")) return "Classificação";
    if (t.includes("race")) return "Corrida";

    return type;
}

// =============== FORMATAÇÃO DE DATA EM PORTUGUÊS ===============
function formatDatePT(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default function Results() {
    const [sessionsByYear, setSessionsByYear] = useState([]);
    const [loading, setLoading] = useState(true);

    const [sessionResults, setSessionResults] = useState({});
    const [modalSessionKey, setModalSessionKey] = useState(null);

    // =====================================================
    // CARREGAR SESSÕES
    // =====================================================
    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("https://api.openf1.org/v1/sessions");
                const data = await res.json();

                // Normaliza e enriquece cada sessão com campos úteis
                const normalized = data.map((s) => {
                    // normaliza year
                    let year = s.year;
                    if (!year || isNaN(Number(String(year).trim()))) {
                        // tenta usar session_start (fallback)
                        const dt = s.session_start ? new Date(s.session_start) : null;
                        year = dt && !isNaN(dt.getTime()) ? dt.getFullYear() : "Desconhecido";
                    }
                    year = Number(String(year).trim());

                    // normaliza session_start para Date (fallback para epoch 0 se inválido)
                    let sessionStartDate = null;
                    if (s.session_start) {
                        const d = new Date(s.session_start);
                        if (!isNaN(d.getTime())) sessionStartDate = d;
                    }
                    // se não tem, tenta date_start, date_end etc (opcional)
                    if (!sessionStartDate && s.date_start) {
                        const d2 = new Date(s.date_start);
                        if (!isNaN(d2.getTime())) sessionStartDate = d2;
                    }
                    // fallback
                    if (!sessionStartDate) sessionStartDate = new Date(0);

                    return {
                        ...s,
                        __year: year,
                        __sessionStart: sessionStartDate,
                        __locationKey: `${s.location || s.circuit_short_name || "Desconhecido"}||${s.country_name || "Desconhecido"}`
                    };
                });

                // Agrupa por ano usando Map para preservar ordem quando necessário
                const mapByYear = new Map();
                normalized.forEach((s) => {
                    const y = s.__year;
                    if (!mapByYear.has(y)) mapByYear.set(y, []);
                    mapByYear.get(y).push(s);
                });

                // Converte para array de { year, sessions } e ordena anos (desc)
                const yearsArray = Array.from(mapByYear.entries())
                    .map(([year, sessions]) => ({ year: Number(year), sessions }))
                    .sort((a, b) => b.year - a.year); // ano mais recente primeiro

                // Para cada ano, ordena sessões por data (sessionStart desc) e agrupa por location+country
                const result = yearsArray.map(({ year, sessions }) => {
                    // ordena por data da sessão (mais recente primeiro)
                    const sortedSessions = sessions.sort((a, b) => b.__sessionStart - a.__sessionStart);

                    // agrupa por location+country preservando a ordem (Map mantém inserção)
                    const groupsMap = new Map();
                    sortedSessions.forEach((s) => {
                        const key = s.__locationKey;
                        if (!groupsMap.has(key)) {
                            const [location, country] = key.split("||");
                            groupsMap.set(key, { key, location, country, sessions: [] });
                        }
                        groupsMap.get(key).sessions.push(s);
                    });

                    // transforma em array na ordem de inserção
                    const groups = Array.from(groupsMap.values());

                    return { year, groups };
                });

                setSessionsByYear(result);
            } catch (err) {
                console.error("Erro carregando sessões:", err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    // Carrega resultados da sessão e drivers (guardado em sessionResults)
    async function loadSessionResults(session_key) {
        if (!session_key) return;
        if (sessionResults[session_key]) return; // já carregado

        try {
            const sessionRes = await fetch(
                `https://api.openf1.org/v1/session_result?session_key=${session_key}`
            );
            const sessionData = await sessionRes.json();

            const driversRes = await fetch(
                `https://api.openf1.org/v1/drivers?session_key=${session_key}`
            );
            const driversData = await driversRes.json();

            const driversMap = new Map(driversData.map((d) => [d.driver_number, d]));

            const merged = sessionData
                .map((item) => ({ ...item, driver: driversMap.get(item.driver_number) || null }))
                .sort((a, b) => {
                    const posA = a.position;
                    const posB = b.position;
                    if (posA == null && posB != null) return 1;
                    if (posB == null && posA != null) return -1;
                    if (posA == null && posB == null) return 0;
                    return posA - posB;
                });

            setSessionResults((prev) => ({ ...prev, [session_key]: merged }));
        } catch (e) {
            console.error(e);
        }
    }

    function openModal(session_key) {
        loadSessionResults(session_key);
        setModalSessionKey(session_key);
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        setModalSessionKey(null);
        document.body.style.overflow = "";
    }

    if (loading) return <div className="pilots-section">Carregando...</div>;

    return (
        <div>
            <Navbar />

            <div className="pilots-section">
                <h2 className="pilots-title">Sessões por Ano</h2>

                {sessionsByYear.map(({ year, groups }) => (
                    <section className="year-block" key={year}>
                        <h3 className="year-title">{year}</h3>

                        <div className="year-groups">
                            {groups.map((g) => (
                                <div className="sessions-row" key={g.key}>
                                    <div className="sessions-row-header">
                                        <div className="row-location">
                                            <strong>{g.location}</strong>
                                            <span className="row-country"> — {g.country}</span>
                                        </div>
                                    </div>

                                    <div className="sessions-list">
                                        {g.sessions.map((s) => (
                                            <div
                                                key={s.session_key}
                                                className="session-card"
                                                onClick={() => openModal(s.session_key)}
                                            >
                                                <div className="session-header">
                                                    <span className="session-name">{translateSessionType(s.session_name)}</span>
                                                    <button
                                                        className="session-toggle"
                                                        onClick={(ev) => {
                                                            ev.stopPropagation();
                                                            openModal(s.session_key);
                                                        }}
                                                    >
                                                        Abrir
                                                    </button>
                                                </div>

                                                <p className="session-meta">
                                                    {s.circuit_short_name} • {translateSessionType(s.session_type)}
                                                </p>

                                                <div className="session-bottom">
                                                    <span
                                                        className={`badge ${s.session_type?.toLowerCase().includes("race")
                                                                ? "badge-race"
                                                                : s.session_type?.toLowerCase().includes("quali")
                                                                    ? "badge-quali"
                                                                    : s.session_type?.toLowerCase().includes("sprint")
                                                                        ? "badge-sprint"
                                                                        : ""
                                                            }`}
                                                    >
                                                        {translateSessionType(s.session_type)}
                                                    </span>

                                                    <span className="session-date">
                                                        {formatDatePT(s.date_start)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            <Footer />

            {modalSessionKey && sessionResults[modalSessionKey] && (
                <ResultsPilots
                    modalSessionKey={modalSessionKey}
                    sessionResults={sessionResults}
                    closeModal={closeModal} />
            )}
        </div>
    );
}

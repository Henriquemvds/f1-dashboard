import React, { useEffect, useState } from "react";
import NotRegistered from "../images/pilot-not-registered.png";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/EventsCalendar.css"
import "../styles/Pilots.css";
import "../styles/Results.css";
import "../styles/Home.css"
import ResultsPilots from "../components/ResultsPilots.jsx";
import Pagination from "../components/Pagination.jsx";
import Loading from "../components/Loading";
import MaintenanceMessage from "../components/MaintenanceMessage.jsx";

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
    const [error, setError] = useState(false); // Novo estado de erro

    // FILTROS NOVOS
    const [selectedYears, setSelectedYears] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [sessionResults, setSessionResults] = useState({});
    const [modalSessionKey, setModalSessionKey] = useState(null);

    // NOVO: busca + paginação
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 30;

    // =====================================================
    // CARREGAR SESSÕES
    // =====================================================
    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("https://api.openf1.org/v1/sessions");
                const data = await res.json();

                if (!data || data.length === 0) {
                    setError(true); // Marca erro se não houver dados
                    return;
                }

                // Normaliza e enriquece cada sessão
                const normalized = data.map((s) => {
                    let year = s.year;
                    if (!year || isNaN(Number(String(year).trim()))) {
                        const dt = s.session_start ? new Date(s.session_start) : null;
                        year = dt && !isNaN(dt.getTime()) ? dt.getFullYear() : "Desconhecido";
                    }
                    year = Number(String(year).trim());

                    let sessionStartDate = null;
                    if (s.session_start) {
                        const d = new Date(s.session_start);
                        if (!isNaN(d.getTime())) sessionStartDate = d;
                    }
                    if (!sessionStartDate && s.date_start) {
                        const d2 = new Date(s.date_start);
                        if (!isNaN(d2.getTime())) sessionStartDate = d2;
                    }
                    if (!sessionStartDate) sessionStartDate = new Date(0);

                    return {
                        ...s,
                        __year: year,
                        __sessionStart: sessionStartDate,
                        __locationKey: `${s.location || s.circuit_short_name || "Desconhecido"}||${s.country_name || "Desconhecido"}`
                    };
                });

                // Agrupa por ano
                const mapByYear = new Map();
                normalized.forEach((s) => {
                    const y = s.__year;
                    if (!mapByYear.has(y)) mapByYear.set(y, []);
                    mapByYear.get(y).push(s);
                });

                const yearsArray = Array.from(mapByYear.entries())
                    .map(([year, sessions]) => ({ year: Number(year), sessions }))
                    .sort((a, b) => b.year - a.year);

                const result = yearsArray.map(({ year, sessions }) => {
                    const sortedSessions = sessions.sort((a, b) => b.__sessionStart - a.__sessionStart);

                    const groupsMap = new Map();
                    sortedSessions.forEach((s) => {
                        const key = s.__locationKey;
                        if (!groupsMap.has(key)) {
                            const [location, country] = key.split("||");
                            groupsMap.set(key, { key, location, country, sessions: [] });
                        }
                        groupsMap.get(key).sessions.push(s);
                    });

                    return { year, groups: Array.from(groupsMap.values()) };
                });

                setSessionsByYear(result);

            } catch (err) {
                console.error("Erro carregando sessões:", err);
                setError(true); // Marca erro se a requisição falhar
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);


    // =====================================================
    // FILTRO GLOBAL
    // =====================================================
    function filterSessions(arr) {
        const q = search.toLowerCase().trim();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return arr
            .filter(({ year }) => {
                if (selectedYears.length === 0) return true;
                return selectedYears.includes(year);
            })
            .map(({ year, groups }) => {
                const filteredGroups = groups
                    .map((g) => ({
                        ...g,
                        sessions: g.sessions.filter((s) => {
                            const matchesSearch =
                                !q ||
                                s.session_name.toLowerCase().includes(q) ||
                                s.session_type.toLowerCase().includes(q) ||
                                (s.circuit_short_name || "").toLowerCase().includes(q) ||
                                (s.location || "").toLowerCase().includes(q) ||
                                (s.country_name || "").toLowerCase().includes(q);

                            const matchesType =
                                selectedTypes.length === 0 ||
                                selectedTypes.some(t =>
                                    s.session_type.toLowerCase().includes(t)
                                );

                            const sessionDate = new Date(s.__sessionStart);
                            sessionDate.setHours(0, 0, 0, 0);

                            const isPastOrToday = sessionDate <= today;

                            return matchesSearch && matchesType && isPastOrToday;
                        })
                    }))
                    .filter((g) => g.sessions.length > 0);

                return { year, groups: filteredGroups };
            })
            .filter((y) => y.groups.length > 0);
    }


    // =====================================================
    // PAGINAÇÃO (30 por página)
    // =====================================================
    const filtered = filterSessions(sessionsByYear);

    // Lista de anos disponíveis
    const allYears = sessionsByYear.map(y => y.year);

    // Lista de tipos de sessão disponíveis
    const sessionTypeOptions = [
        { id: "race", label: "Corrida" },
        { id: "qualifying", label: "Classificação" },
        { id: "practice", label: "Treino Livre" }
    ];


    const flatSessions = filtered.flatMap((y) =>
        y.groups.flatMap((g) => g.sessions)
    );

    const totalPages = Math.ceil(flatSessions.length / itemsPerPage);

    const paginatedSessions = flatSessions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Recria a estrutura original (ano > grupos > sessões)
    function rebuildStructure(list) {
        const map = new Map();

        list.forEach((s) => {
            const year = s.__year;
            if (!map.has(year)) map.set(year, new Map());

            const locKey = s.__locationKey;
            if (!map.get(year).has(locKey)) {
                const [location, country] = locKey.split("||");
                map.get(year).set(locKey, {
                    key: locKey,
                    location,
                    country,
                    sessions: []
                });
            }
            map.get(year).get(locKey).sessions.push(s);
        });

        return Array.from(map.entries()).map(([year, groupsMap]) => ({
            year,
            groups: Array.from(groupsMap.values())
        }));
    }

    const paginatedStructure = rebuildStructure(paginatedSessions);

    // =====================================================
    // MODAL
    // =====================================================
    async function loadSessionResults(session_key) {
        if (!session_key) return;
        if (sessionResults[session_key]) return;

        try {
            const sessionRes = await fetch(
                `https://api.openf1.org/v1/session_result?session_key=${session_key}`
            );
            const sessionData = await sessionRes.json();

            const driversRes = await fetch(
                `https://api.openf1.org/v1/drivers?session_key=${session_key}`
            );

            const driversData = await driversRes.json();

            const driversMap = new Map(
                driversData.map((d) => [d.driver_number, d])
            );

            const merged = sessionData
                .map((item) => ({
                    ...item,
                    driver: driversMap.get(item.driver_number) || null
                }))
                .sort((a, b) => {
                    if (a.position == null && b.position != null) return 1;
                    if (b.position == null && a.position != null) return -1;
                    if (a.position == null && b.position == null) return 0;
                    return a.position - b.position;
                });

            setSessionResults((prev) => ({ ...prev, [session_key]: merged }));
        } catch (e) {
            console.error(e);
        }
    }


    useEffect(() => {
        localStorage.setItem("lastPage", currentPage);
    }, [currentPage]);


    function openModal(session_key) {
        loadSessionResults(session_key);
        setModalSessionKey(session_key);
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        setModalSessionKey(null);
        document.body.style.overflow = "";
    }

    if (loading) return <Loading />

    if (error) {
        return (
            <MaintenanceMessage />
        );
    }

    return (
        <div>
            <Helmet>
                <link
                    rel="canonical"
                    href="https://www.blog-f1-dashboard.com/resultados"
                />
            </Helmet>

            <Navbar />

            <div className="list-results">
                <h2 className="pilots-title">Sessões por Ano</h2>
                <div className="events-controls">
                    {/* PESQUISA */}
                    <input
                        type="search"
                        placeholder="Pesquisar sessão, circuito, país..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                    />

                    {/* FILTRO POR ANO */}
                    <select

                        className="filter-years"
                        value={selectedYears}
                        onChange={(e) => {
                            const options = [...e.target.options]
                                .filter(o => o.selected)
                                .map(o => Number(o.value));

                            setSelectedYears(options);
                            setCurrentPage(1);
                        }}
                    >
                        {allYears.map((y) => (
                            <option value={y} key={y}>{y}</option>
                        ))}
                    </select>

                    {/* FILTRO POR TIPO */}
                    <div className="filter-types">
                        {sessionTypeOptions.map((t) => (
                            <label key={t.id}>
                                <input
                                    type="checkbox"
                                    value={t.id}
                                    checked={selectedTypes.includes(t.id)}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedTypes(prev =>
                                            prev.includes(value)
                                                ? prev.filter(x => x !== value)
                                                : [...prev, value]
                                        );
                                        setCurrentPage(1);
                                    }}
                                />
                                {t.label}
                            </label>
                        ))}
                    </div>
                </div>

                {paginatedStructure.map(({ year, groups }) => (
                    <section className="year-block" key={year}>
                        <h3 className="year-title">{year}</h3>

                        <div className="year-groups">
                            {groups.map((g) => (
                                <div className="sessions-row" key={g.key}>
                                    <div className="sessions-row-header">
                                        <div className="row-location">
                                            <strong>{g.location}</strong>
                                            <span className="row-country">
                                                {" "}
                                                — {g.country}
                                            </span>
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
                                                    <span className="session-name">
                                                        {translateSessionType(s.session_name)}
                                                    </span>
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
                                                    {s.circuit_short_name} •{" "}
                                                    {translateSessionType(s.session_type)}
                                                </p>

                                                <div className="session-bottom">
                                                    <span
                                                        className={`badge ${s.session_type
                                                            ?.toLowerCase()
                                                            .includes("race")
                                                            ? "badge-race"
                                                            : s.session_type
                                                                ?.toLowerCase()
                                                                .includes("quali")
                                                                ? "badge-quali"
                                                                : s.session_type
                                                                    ?.toLowerCase()
                                                                    .includes("sprint")
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

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />

            </div>

            <Footer />

            {modalSessionKey && sessionResults[modalSessionKey] && (
                <ResultsPilots
                    modalSessionKey={modalSessionKey}
                    sessionResults={sessionResults}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
}

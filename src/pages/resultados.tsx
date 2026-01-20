import { useEffect, useState } from "react";
import NotRegistered from "../images/pilot-not-registered.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ResultsPilots from "../components/ResultsPilots";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import MaintenanceMessage from "../components/MaintenanceMessage";

// ==================== TIPOS ====================
type Session = {
  session_key: string;
  session_name: string;
  session_type: string;
  session_start?: string;
  date_start?: string;
  circuit_short_name?: string;
  location?: string;
  country_name?: string;
  year?: number;
  __year?: number;
  __sessionStart?: Date;
  __locationKey?: string;
};

type SessionGroup = {
  key: string;
  location: string;
  country: string;
  sessions: Session[];
};

type SessionsByYear = {
  year: number;
  groups: SessionGroup[];
};

type SessionResultsMap = {
  [key: string]: any[]; // Pode refinar conforme a estrutura do ResultsPilots
};

// ==================== FUNÇÕES AUXILIARES ====================
function translateSessionType(type = ""): string {
  const t = type.toLowerCase();

  if (t.includes("practice")) {
    const num = type.match(/\d+/)?.[0] || "";
    return `Treino Livre ${num}`.trim();
  }
  if (t.includes("qualifying")) return "Classificação";
  if (t.includes("race")) return "Corrida";

  return type;
}

function formatDatePT(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ==================== COMPONENTE ====================
export default function Results() {
  const [sessionsByYear, setSessionsByYear] = useState<SessionsByYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sessionResults, setSessionResults] = useState<SessionResultsMap>({});
  const [modalSessionKey, setModalSessionKey] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // ==================== CARREGAR SESSÕES ====================
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("https://api.openf1.org/v1/sessions");
        const data: Session[] = await res.json();

        if (!data || data.length === 0) {
          setError(true);
          return;
        }

        const normalized = data.map((s) => {
          let year = s.year;
          if (!year || isNaN(Number(String(year).trim()))) {
            const dt = s.session_start ? new Date(s.session_start) : null;
            year = dt && !isNaN(dt.getTime()) ? dt.getFullYear() : 0;
          }
          year = Number(String(year).trim());

          let sessionStartDate = s.session_start
            ? new Date(s.session_start)
            : s.date_start
            ? new Date(s.date_start)
            : new Date(0);

          return {
            ...s,
            __year: year,
            __sessionStart: sessionStartDate,
            __locationKey: `${s.location || s.circuit_short_name || "Desconhecido"}||${s.country_name || "Desconhecido"}`,
          };
        });

        // Agrupa por ano
        const mapByYear = new Map<number, Session[]>();
        normalized.forEach((s) => {
          const y = s.__year!;
          if (!mapByYear.has(y)) mapByYear.set(y, []);
          mapByYear.get(y)?.push(s);
        });

        const result: SessionsByYear[] = Array.from(mapByYear.entries())
          .map(([year, sessions]) => {
            const sortedSessions = sessions.sort(
              (a, b) => (b.__sessionStart?.getTime() || 0) - (a.__sessionStart?.getTime() || 0)
            );

            const groupsMap = new Map<string, SessionGroup>();
            sortedSessions.forEach((s) => {
              const key = s.__locationKey!;
              if (!groupsMap.has(key)) {
                const [location, country] = key.split("||");
                groupsMap.set(key, { key, location, country, sessions: [] });
              }
              groupsMap.get(key)?.sessions.push(s);
            });

            return { year, groups: Array.from(groupsMap.values()) };
          })
          .sort((a, b) => b.year - a.year);

        setSessionsByYear(result);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // ==================== FILTRO ====================
  function filterSessions(arr: SessionsByYear[]): SessionsByYear[] {
    const q = search.toLowerCase().trim();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return arr
      .filter(({ year }) => (selectedYears.length === 0 ? true : selectedYears.includes(year)))
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
                selectedTypes.some((t) => s.session_type.toLowerCase().includes(t));

              const sessionDate = new Date(s.__sessionStart!);
              sessionDate.setHours(0, 0, 0, 0);

              return matchesSearch && matchesType && sessionDate <= today;
            }),
          }))
          .filter((g) => g.sessions.length > 0);

        return { year, groups: filteredGroups };
      })
      .filter((y) => y.groups.length > 0);
  }

  const filtered = filterSessions(sessionsByYear);

  const allYears = sessionsByYear.map((y) => y.year);

  const sessionTypeOptions = [
    { id: "race", label: "Corrida" },
    { id: "qualifying", label: "Classificação" },
    { id: "practice", label: "Treino Livre" },
  ];

  const flatSessions = filtered.flatMap((y) => y.groups.flatMap((g) => g.sessions));
  const totalPages = Math.ceil(flatSessions.length / itemsPerPage);
  const paginatedSessions = flatSessions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  function rebuildStructure(list: Session[]): SessionsByYear[] {
    const map = new Map<number, Map<string, SessionGroup>>();
    list.forEach((s) => {
      const year = s.__year!;
      if (!map.has(year)) map.set(year, new Map());

      const locKey = s.__locationKey!;
      if (!map.get(year)!.has(locKey)) {
        const [location, country] = locKey.split("||");
        map.get(year)!.set(locKey, { key: locKey, location, country, sessions: [] });
      }
      map.get(year)!.get(locKey)!.sessions.push(s);
    });

    return Array.from(map.entries()).map(([year, groupsMap]) => ({
      year,
      groups: Array.from(groupsMap.values()),
    }));
  }

  const paginatedStructure = rebuildStructure(paginatedSessions);

  // ==================== MODAL ====================
  async function loadSessionResults(session_key: string) {
    if (!session_key || sessionResults[session_key]) return;

    try {
      const sessionRes = await fetch(`https://api.openf1.org/v1/session_result?session_key=${session_key}`);
      const sessionData = await sessionRes.json();

      const driversRes = await fetch(`https://api.openf1.org/v1/drivers?session_key=${session_key}`);
      const driversData = await driversRes.json();

      const driversMap = new Map(driversData.map((d: any) => [d.driver_number, d]));

      const merged = sessionData
        .map((item: any) => ({ ...item, driver: driversMap.get(item.driver_number) || null }))
        .sort((a: any, b: any) => {
          if (a.position == null && b.position != null) return 1;
          if (b.position == null && a.position != null) return -1;
          if (a.position == null && b.position == null) return 0;
          return a.position - b.position;
        });

      setSessionResults((prev) => ({ ...prev, [session_key]: merged }));
    } catch (err) {
      console.error(err);
    }
  }

  function openModal(session_key: string) {
    loadSessionResults(session_key);
    setModalSessionKey(session_key);
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    setModalSessionKey(null);
    document.body.style.overflow = "";
  }

  useEffect(() => {
    localStorage.setItem("lastPage", currentPage.toString());
  }, [currentPage]);

  if (loading) return <Loading />;
  if (error) return <MaintenanceMessage />;

  return (
    <div>
      <Navbar />
      <div className="list-results">
        <h2 className="pilots-title">Sessões por Ano</h2>

        {/* CONTROLES */}
        <div className="events-controls">
          <input
            type="search"
            placeholder="Pesquisar sessão, circuito, país..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <select
            className="filter-years"
            value={selectedYears.map(String)}
            onChange={(e) => {
              const options = [...e.target.options]
                .filter((o) => o.selected)
                .map((o) => Number(o.value));
              setSelectedYears(options);
              setCurrentPage(1);
            }}
          >
            {allYears.map((y) => (
              <option value={y} key={y}>
                {y}
              </option>
            ))}
          </select>

          <div className="filter-types">
            {sessionTypeOptions.map((t) => (
              <label key={t.id}>
                <input
                  type="checkbox"
                  value={t.id}
                  checked={selectedTypes.includes(t.id)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedTypes((prev) =>
                      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
                    );
                    setCurrentPage(1);
                  }}
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        {/* SESSÕES */}
        {paginatedStructure.map(({ year, groups }) => (
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
                      <div key={s.session_key} className="session-card" onClick={() => openModal(s.session_key)}>
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
                            className={`badge ${
                              s.session_type
                                ?.toLowerCase()
                                .includes("race")
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

                          <span className="session-date">{formatDatePT(s.date_start)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div>

      <Footer />

      {modalSessionKey && sessionResults[modalSessionKey] && (
        <ResultsPilots modalSessionKey={modalSessionKey} sessionResults={sessionResults} closeModal={closeModal} />
      )}
    </div>
  );
}

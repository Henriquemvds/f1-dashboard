import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

  if (loading) return <p>Carregando meetings...</p>;
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

  // Função para alternar acordeão
  const toggleYear = (year) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  return (
    <div>
      <Navbar />

      {sortedYears.length === 0 && <p>Nenhum meeting encontrado.</p>}

      {sortedYears.map((year) => (
        <section key={year} style={{ marginBottom: "2rem" }}>
          <h2
            onClick={() => toggleYear(year)}>
            {year} {expandedYears[year] ? "▼" : "►"}
          </h2>

          {expandedYears[year] &&
            meetingsByYear[year].map((m) => (
              <div
                key={m.meeting_key}>
                <h3>{m.meeting_name}</h3>
                <p>
                  <strong>Nome oficial:</strong> {m.meeting_official_name}
                </p>

                <p>
                  <strong>Local:</strong> {m.location}, {m.country_name} (
                  {m.country_code})
                </p>

                {m.country_flag && (
                  <img
                    src={m.country_flag}
                    alt={`${m.country_name} flag`}
                    width="40"
                    style={{ marginRight: "0.5rem" }}
                  />
                )}

                <p>
                  <strong>Circuito:</strong> {m.circuit_short_name} (
                  {m.circuit_type})
                </p>

                {m.circuit_image && (
                  <div>
                    <strong>Imagem do circuito:</strong>
                    <br />
                    <img
                      src={m.circuit_image}
                      alt={`${m.circuit_short_name} track`}
                      width="250"
                    />
                  </div>
                )}

                <p>
                  <strong>Início:</strong>{" "}
                  {new Date(m.date_start).toLocaleString()} <br />
                  <strong>Fim:</strong>{" "}
                  {new Date(m.date_end).toLocaleString()}
                </p>

                <p>
                  <strong>GMT Offset:</strong> {m.gmt_offset}
                </p>

                <p>
                  <strong>Meeting Key:</strong> {m.meeting_key} <br />
                  <strong>Circuit Key:</strong> {m.circuit_key}
                </p>
              </div>
            ))}
        </section>
      ))}

      <Footer />
    </div>
  );
}

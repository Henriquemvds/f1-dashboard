"use client";

import { useEffect, useState } from "react";
import Head from "next/head";  
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

interface Meeting {
  meeting_key: string;
  year: number;
  meeting_name: string;
  country_name?: string;
  country_flag?: string;
  location?: string;
  circuit_short_name?: string;
  circuit_type?: string;
  circuit_image?: string;
  date_start?: string | number;
  date_end?: string | number;
  gmt_offset?: string;
}

export default function Circuits() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({});

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
  const meetingsByYear = meetings.reduce<Record<number, Meeting[]>>((acc, m) => {
    const year = m.year || 0;
    if (!acc[year]) acc[year] = [];
    acc[year].push(m);
    return acc;
  }, {});

  // Ordena os anos do mais recente para o mais antigo
  const sortedYears = Object.keys(meetingsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  // Alterna acordeão
  const toggleYear = (year: number) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  const translateCircuitType = (type?: string) => {
    if (!type) return "";
    if (type.includes("Permanent")) return "Permanente";
    if (type.includes("Temporary - Street")) return "Temporário - Rua";
    return type;
  };

  return (
    <div>
      <Head>
        <title>Circuitos — F1™ Dash</title>
        <link rel="canonical" href="https://www.blog-f1-dashboard.com/circuitos" />
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
                  <div className="circuit-card" key={m.meeting_key}>
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
                      Início: {m.date_start ? new Date(m.date_start).toLocaleString() : "–"} <br />
                      Fim: {m.date_end ? new Date(m.date_end).toLocaleString() : "–"} <br />
                      GMT Offset: {m.gmt_offset || "–"}
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

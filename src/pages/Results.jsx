import React, { useEffect, useState } from "react";
import NotRegistered from "../images/pilot-not-registered.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Pilots.css";
import "../styles/Results.css";

export default function Results() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const sessionRes = await fetch(
                    "https://api.openf1.org/v1/session_result?session_key=latest"
                );
                const sessionData = await sessionRes.json();

                const driversRes = await fetch(
                    "https://api.openf1.org/v1/drivers?session_key=latest"
                );
                const driversData = await driversRes.json();

                const driversMap = new Map(
                    driversData.map((d) => [d.driver_number, d])
                );

                const merged = sessionData
                    .map((item) => ({
                        ...item,
                        driver: driversMap.get(item.driver_number) || null,
                    }))
                    .sort((a, b) => {
                        const posA = a.position;
                        const posB = b.position;

                        // Se A é null e B não, A vai para o fim
                        if (posA == null && posB != null) return 1;

                        // Se B é null e A não, B vai para o fim
                        if (posB == null && posA != null) return -1;

                        // Se ambos são null, mantém ordem
                        if (posA == null && posB == null) return 0;

                        // Caso normal: ordena por posição
                        return posA - posB;
                    })

                setResults(merged);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    if (loading) return <div className="pilots-section">Carregando...</div>;

    return (
        <div>
            <Navbar />
            <div className="pilots-section">
                <h2 className="pilots-title">Resultados — Últimas Sessão</h2>

                <div className="pilots-grid pilots-grid-2x2">
                    {results.map((r, i) => {
                        const d = r.driver;
                        const color = d?.team_colour
                            ? `#${d.team_colour.replace("#", "")}`
                            : "#FFD700";

                        const imageSrc =
                            d?.headshot_url && d.headshot_url !== "null"
                                ? d.headshot_url.replace("/1col/", "/3col/")
                                : NotRegistered;

                        // --- GAP INCREMENTAL ---
                        let gapIncremental = null;

                        if (i === 0) {
                            // Líder não tem intervalo
                            gapIncremental = "—";
                        } else {
                            const atual = results[i].gap_to_leader;
                            const anterior = results[i - 1].gap_to_leader;

                            if (typeof atual === "number" && typeof anterior === "number") {
                                gapIncremental = `+${(atual - anterior).toFixed(3)}s`;
                            } else {
                                // Pode acontecer com pilotos 1 lap, DNF, etc.
                                gapIncremental = results[i].gap_to_leader;
                            }
                        }

                        return (
                            <div key={i} className="pilot-card">
                                <div className="position-badge" style={{ borderColor: color }}>
                                    {r.position || "—"}
                                </div>

                                <div className="pilot-photo-container">
                                    <span
                                        className="pilot-number"
                                        style={{
                                            color,
                                            textShadow: `0 0 10px ${color}, 0 0 18px ${color}`,
                                        }}
                                    >
                                        {d?.driver_number}
                                    </span>

                                    <img
                                        src={imageSrc}
                                        alt={d?.full_name || "Piloto não registrado"}
                                        className="pilot-photo"
                                    />
                                </div>

                                <p className="pilot-name">{d?.full_name || "Desconhecido"}</p>
                                <p className="pilot-team">{d?.team_name || "—"}</p>
                                <p className="pilot-gap">
                                    <strong>Intervalo:</strong> {gapIncremental || "Fora da corrida"}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Footer />
        </div>
    );
}

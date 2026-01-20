"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import NotRegistered from "../images/pilot-not-registered.png";
import Loading from "./Loading";
// se estiver usando React Router
import MaintenanceMessage from "./MaintenanceMessage";

// Tipagem para cada piloto
type Pilot = {
  driver_number: string;
  full_name: string;
  team_name: string;
  team_colour?: string;
  headshot_url?: string;
};

export default function Pilots() {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // Estado para erro

  useEffect(() => {
    async function fetchPilots() {
      try {
        const res = await axios.get<Pilot[]>(
          "https://api.openf1.org/v1/drivers?session_key=latest"
        );

        if (!res.data || res.data.length === 0) {
          setError(true); // Marca erro se não houver dados
        } else {
          setPilots(res.data);
        }
      } catch (err) {
        console.error("Erro ao buscar pilotos:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPilots();
  }, []);

  if (loading) return <Loading />;

  if (error) return <MaintenanceMessage />;

  // Função para gerar URL amigável
  function slugify(name: string): string {
    return name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]/g, "");
  }

  return (
    <div className="pilots-section">
      <h2 className="pilots-title">Pilotos — Última Sessão</h2>
      <div className="pilots-grid">
        {pilots.map((p) => {
          const color = p.team_colour
            ? `#${p.team_colour.replace("#", "")}`
            : "#FFD700";

      const imageSrc: string =
                p?.headshot_url && p.headshot_url !== "null"
                  ? p.headshot_url.replace("/1col/", "/3col/")
                  : NotRegistered.src;

          return (
            <div key={p.driver_number} className="pilot-card">
              <div className="pilot-photo-container">
                <span
                  className="pilot-number"
                  style={{
                    color,
                    textShadow: `0 0 8px ${color}, 0 0 15px ${color}`,
                  }}
                >
                  {p.driver_number}
                </span>

                   <img src={imageSrc} alt={p?.full_name || "Piloto não registrado"} className="pilot-photo" />
              </div>

              <p className="pilot-name">{p.full_name}</p>
              <p className="pilot-team">{p.team_name}</p>

              <Link
                href={`/piloto/${slugify(p.full_name)}`}
                className="bio-button"
              >
                Ver biografia
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

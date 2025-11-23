import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Pilots.css";
import NotRegistered from "../images/pilot-not-registered.png";
import Loading from "./Loading";
import { Link } from "react-router-dom"; // se estiver usando React Router

export default function Pilots() {
  const [pilots, setPilots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPilots() {
      try {
        const res = await axios.get(
          "https://api.openf1.org/v1/drivers?session_key=latest"
        );
        setPilots(res.data);
      } catch (err) {
        console.error("Erro ao buscar pilotos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPilots();
  }, []);

  if (loading) return <Loading />;

  // Função para gerar URL amigável
  function slugify(name) {
    return name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]/g, "");
  }

  return (
    <div className="pilots-section">
      <h2 className="pilots-title">Pilotos — Última Sessão</h2>
      <div className="pilots-grid">
        {pilots.map((p) => {
          const color = p.team_colour
            ? `#${p.team_colour.replace("#", "")}`
            : "#FFD700";

          const imageSrc =
            p.headshot_url && p.headshot_url !== "null"
              ? p.headshot_url.replace("/1col/", "/3col/")
              : NotRegistered;

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

                <img
                  src={imageSrc}
                  alt={p.full_name || "Piloto não registrado"}
                  className="pilot-photo"
                />
              </div>

              <p className="pilot-name">{p.full_name}</p>
              <p className="pilot-team">{p.team_name}</p>

              {/* 🔥 Botão de biografia */}
              <Link
                to={`/driver/${slugify(p.full_name.toLowerCase().replace(/ /g, "-"))}`}
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

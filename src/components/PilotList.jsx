import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Pilots.css"; // importa o CSS externo
import NotRegistered from "../images/pilot-not-registered.png";

export default function Pilots() {
  const [pilots, setPilots] = useState([]);

  useEffect(() => {
    async function fetchPilots() {
      try {
        const res = await axios.get(
          "https://api.openf1.org/v1/drivers?session_key=latest"
        );
        setPilots(res.data);
      } catch (err) {
        console.error("Erro ao buscar pilotos:", err);
      }
    }
    fetchPilots();
  }, []);

  return (
    <div className="pilots-section">
      <h2 className="pilots-title">Pilots — Current Session</h2>
      <div className="pilots-grid">
    {pilots.map((p) => (
  <div key={p.driver_number} className="pilot-card">
<img
  src={
    p.headshot_url && p.headshot_url !== "null"
      ? p.headshot_url.replace("/1col/", "/3col/")
      : NotRegistered
  }
  alt={p.full_name || "Piloto não registrado"}
  className="pilot-photo"
/>
    <p className="pilot-name">{p.full_name}</p>
    <p className="pilot-team">{p.team_name}</p>
  </div>
))}
      </div>
    </div>
  );
}

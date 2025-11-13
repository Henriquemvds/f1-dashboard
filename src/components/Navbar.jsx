import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Navbar.css";
import car from "../images/car.png";

export default function Navbar() {
  const [seasons, setSeasons] = useState([]);
  const [activeYear, setActiveYear] = useState(null);
  const [nextRace, setNextRace] = useState(null);

  // Buscar temporadas
  useEffect(() => {
    async function fetchSeasons() {
      try {
        const res = await axios.get("https://api.openf1.org/v1/seasons");
        const sorted = res.data.sort((a, b) => b.year - a.year);
        setSeasons(sorted);
        setActiveYear(sorted[0]?.year || null);
      } catch (err) {
        console.error("Erro ao buscar temporadas:", err);
      }
    }
    fetchSeasons();
  }, []);


  return (
    <header className="navbar-header">
      <div className="navbar-top">
        <div className="navbar-logo">
          <img src={car} alt="F1 logo" className="car" />
          <div className="logo-text">
            <h1>
              <span className="logo-f1">F1</span>
              <span className="logo-dash">Dashboard</span>
            </h1>
            <div className="tire-trail"></div>
          </div>
        </div>
  

        <div className="navbar-season-select">
          {seasons.length > 0 && (
            <select
              value={activeYear}
              onChange={(e) => setActiveYear(e.target.value)}
              className="season-select"
            >
              {seasons.map((s) => (
                <option key={s.year} value={s.year}>
                  {s.year}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <nav className="navbar-bottom">
        <ul className="navbar-links">
          <li><a href="#" className="active">Home</a></li>
          <li><a href="#">Pilotos</a></li>
          <li><a href="#">Equipes</a></li>
          <li><a href="#">Resultados</a></li>
          <li><a href="#">Calendário</a></li>
        </ul>

        <div className="navbar-social">
          <a href="https://www.instagram.com/henrique.mv/"><i className="fab fa-instagram"></i></a>
          <a href="https://github.com/Henriquemvds"><i className="fab fa-github"></i></a>
        </div>
      </nav>
    </header>
  );
}

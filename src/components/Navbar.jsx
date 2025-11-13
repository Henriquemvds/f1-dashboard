import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Navbar.css";
import car from "../images/car.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar-header">
      {/* ---------- TOPO ---------- */}
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

        {/* Botão de menu mobile */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
      </div>

      {/* ---------- INFERIOR ---------- */}
      <nav className="navbar-bottom">
        <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
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

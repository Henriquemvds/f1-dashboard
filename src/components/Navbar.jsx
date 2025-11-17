import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
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
              <span className="logo-f1">F1™</span>
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
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
              Início
            </NavLink>
          </li>
          <li>
            <NavLink to="/drivers" className={({ isActive }) => isActive ? "active" : ""}>
              Pilotos
            </NavLink>
          </li>
          <li><a href="#">Equipes</a></li>
          <NavLink to="/results" className={({ isActive }) => isActive ? "active" : ""}>
            <li>Resultados</li>
          </NavLink>
          <NavLink to="/calendar" className={({ isActive }) => isActive ? "active" : ""}>
            <li>Calendário</li>
          </NavLink>
          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>
              Sobre
            </NavLink>
          </li>
        </ul>

      </nav>
    </header>
  );
}

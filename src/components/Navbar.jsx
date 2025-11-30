import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.css";
import car from "../images/car.png";

export default function Navbar() {
 const [menuOpen, setMenuOpen] = useState({ main: false, topics: false });

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
        onClick={() => setMenuOpen(prev => ({ ...prev, main: !prev.main }))}
        >
          ☰
        </button>
      </div>

      {/* ---------- INFERIOR ---------- */}
      <nav className="navbar-bottom">
       <ul className={`navbar-links ${menuOpen.main ? "active" : ""}`}>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
              Início
            </NavLink>
          </li>
          <li className="dropdown">
            <button
              className="dropdown-toggle"
              onClick={() => setMenuOpen(prev => ({ ...prev, topics: !prev?.topics }))}
            >
              Tópicos
              <span className={`arrow ${menuOpen?.topics ? "open" : ""}`}>▼</span>
            </button>

            <ul className={`dropdown-menu ${menuOpen?.topics ? "show" : ""}`}>
              <li><NavLink to="/teams">Equipes</NavLink></li>
              <li><NavLink to="/tracks">Circuitos</NavLink></li>
              <li><NavLink to="/history">História</NavLink></li>
            </ul>
          </li>
          <li>
            <NavLink to="/drivers" className={({ isActive }) => isActive ? "active" : ""}>
              Pilotos
            </NavLink>
          </li>
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

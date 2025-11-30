import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Footer.css";

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-content">


                <div className="footer-col footer-about">
                    <h2 className="footer-title">F1™ Dash</h2>
                    <p>Sua central de estatísticas, temporadas e informações da Fórmula 1™.</p>
                </div>


                <div className="footer-col footer-links">
                    <h3>Links rápidos</h3>
                    <ul>
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
                </div>


                <div className="footer-col footer-social">
                    <h3>Siga-me</h3>
                    <div className="social-icons">
                        <a href="https://www.instagram.com/henrique.mv/"><i className="fab fa-instagram"></i></a>
                        <a href="https://github.com/Henriquemvds"><i className="fab fa-github"></i></a>
                    </div>
                </div>
            </div>


            <div className="footer-bottom">
                <p>© 2025 F1™ Dash. Este site não é oficial e não possui qualquer vínculo com as empresas da Fórmula 1. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX e marcas relacionadas são marcas registradas da Formula One Licensing BV.</p>
            </div>
        </footer>
    );
}
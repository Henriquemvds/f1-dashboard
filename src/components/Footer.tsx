"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../images/LOGO-F1-PNG.png";


export default function Footer(){
  return (
    <footer className="site-footer">
      <div className="footer-content">

        <div className="footer-col footer-about">
          <Link href="/">
            <Image src={logo} alt="F1 logo" className="logo-f1" />
          </Link>
          <p>
            Sua central de estatísticas, temporadas e informações das corridas da Fórmula 1™.
          </p>
        </div>

        <div className="footer-col footer-links">
          <h3>Links rápidos</h3>
          <ul>
            <li>
              <Link href="/">Início</Link>
            </li>
            <li>
              <Link href="/pilotos">Pilotos</Link>
            </li>
            <li>
              <Link href="/resultados">Resultados</Link>
            </li>
            <li>
              <Link href="/calendario">Calendário</Link>
            </li>
            <li>
              <Link href="/guia">Guia Para Iniciantes</Link>
            </li>
            <li>
              <Link href="/circuitos">Circuitos</Link>
            </li>
            <li>
              <Link href="/sobre">Sobre</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col footer-social">
          <h3>Siga-me</h3>
          <div className="social-icons">
            <a href="https://www.instagram.com/henrique.mv/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://github.com/Henriquemvds" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2025 F1™ Dash. Este site não é oficial e não possui qualquer vínculo com as empresas da Fórmula 1. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX e marcas relacionadas são marcas registradas da Formula One Licensing BV.
        </p>
      </div>
    </footer>
  );
}

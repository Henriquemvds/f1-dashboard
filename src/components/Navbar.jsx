// components/Navbar.jsx
"use client"; // Necessário para componentes com state/efeitos no Next 13+
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase"; // firebase adaptado para Next
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SelectTopics } from "../data/SelectTopics.js";
import logo from "../images/LOGO-F1-PNG.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState({ main: false, topics: false });
  const pathname = usePathname();
  const router = useRouter();

  const handleHomeClick = (e) => {
    if (pathname === "/") {
      e.preventDefault();
      router.refresh(); // Atualiza a página no Next.js
    }
  };


  return (
    <header className="navbar-header">
      <div className="navbar-top">
      <div className="navbar-logo">
  <Link href="/" onClick={handleHomeClick} title="Voltar para a página inicial do blog Um Olhar pelo Paddock">
    <Image 
      src={logo} 
      alt="Logo GT DASH" 
      className="logo-f1" 
      width={180} 
      height={70} 
      priority
    />
  </Link>

  <div className="logo-text">
    <h1>
      <span className="title-f1">UM OLHAR PELO PADDOCK</span>
    </h1>
    <p className="subtitle-f1">Notícias, resultados e tudo sobre o mundo da Fórmula 1</p>

    {/* Redes Sociais */}
    <div className="social-links">
       <a href="https://www.instagram.com/henrique.mv/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
      <a href="https://github.com/Henriquemvds" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
    </div>
  </div>
</div>
        <button
          className="menu-toggle"
          aria-label="Abrir ou fechar menu principal"
          onClick={() => setMenuOpen(prev => ({ ...prev, main: !prev.main }))}
        >
          ☰
        </button>
      </div>

   <nav className="navbar-bottom" aria-label="Menu de navegação principal">
  <ul className={`navbar-links ${menuOpen.main ? "active" : ""}`}>
    <li>
      <Link href="/" onClick={handleHomeClick} className="active" title="Página inicial – Últimas notícias e análises de Fórmula 1™">
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span>Início</span>
      </Link>
    </li>

    <li>
      <Link href="/pilotos" title="Página de pilotos – Informações e perfis de pilotos de F1™">
        {/* Capacete de Piloto */}
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4a8 8 0 0 0-8 8v5a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-5a8 8 0 0 0-8-8z" />
          <path d="M6 12h11a2 2 0 0 1 2 2v1H5v-1a2 2 0 0 1 1-2z" />
        </svg>
        <span>Pilotos</span>
      </Link>
    </li>

    <li>
      <Link href="/resultados" title="Página de resultados – Últimos resultados de corridas de F1™">
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        <span>Resultados</span>
      </Link>
    </li>

    <li>
      <Link href="/calendario" title="Calendário de corridas – Datas e locais da temporada de F1™">
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span>Calendário</span>
      </Link>
    </li>

    <li>
      <Link href="/guia" title="Guia para iniciantes – Entenda a Fórmula 1™ com dicas e explicações">
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
        <span>Guia Para Iniciantes</span>
      </Link>
    </li>

<li>
  <Link href="/circuitos" title="Circuitos – Detalhes sobre os autódromos de Fórmula 1™">
    {/* Bandeira Quadriculada */}
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="22" x2="4" y2="2" />
      <path d="M4 4h16v10H4z" />
      <line x1="12" y1="4" x2="12" y2="14" />
      <line x1="4" y1="9" x2="20" y2="9" />
      <rect x="4" y="4" width="8" height="5" fill="currentColor" stroke="none" />
      <rect x="12" y="9" width="8" height="5" fill="currentColor" stroke="none" />
    </svg>
    <span>Circuitos</span>
  </Link>
</li>

    <li>
      <Link href="/sobre" title="Sobre – Informações sobre o blog">
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <span>Sobre</span>
      </Link>
    </li>
  </ul>
</nav>
    </header>
  );
}

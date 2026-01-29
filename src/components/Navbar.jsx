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
              alt="Logo do blog Um Olhar pelo Paddock – Notícias e análises de F1™" 
              className="logo-f1" 
              width={120} // ajuste conforme necessário
              height={50} // ajuste conforme necessário
            />
          </Link>
          <div className="logo-text">
            <h1>
              <span className="title-f1">Um Olhar pelo Paddock</span>
            </h1>
            <div className="tire-trail"></div>
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
            <Link href="/" onClick={handleHomeClick} title="Página inicial – Últimas notícias e análises de Fórmula 1™">
              Início
            </Link>
          </li>
          <li><Link href="/pilotos" title="Página de pilotos – Informações e perfis de pilotos de F1™">Pilotos</Link></li>
          <li><Link href="/resultados" title="Página de resultados – Últimos resultados de corridas de F1™">Resultados</Link></li>
          <li><Link href="/calendario" title="Calendário de corridas – Datas e locais da temporada de F1™">Calendário</Link></li>
          <li><Link href="/guia" title="Guia para iniciantes – Entenda a Fórmula 1™ com dicas e explicações">Guia Para Iniciantes</Link></li>
          <li><Link href="/circuitos" title="Circuitos – Detalhes sobre os autódromos de Fórmula 1™">Circuitos</Link></li>
          <li><Link href="/sobre" title="Sobre – Informações sobre o blog">Sobre</Link></li>
        </ul>
      </nav>
    </header>
  );
}

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import "../styles/Navbar.css";
import logo from "../images/LOGO-F1-PNG.png";
import { NavLink, useLocation } from "react-router-dom";
import { SelectTopics } from "../data/SelectTopics.js";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState({ main: false, topics: false });
  const [tagsCount, setTagsCount] = useState([]);
  const location = useLocation();

  const handleHomeClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.location.reload();
    }
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const postsRef = collection(db, "posts");
        const snapshot = await getDocs(postsRef);

        let countMap = {};
        snapshot.forEach(doc => {
          const data = doc.data();
          const tags = data.tags || [];
          tags.forEach(tag => {
            const clean = tag.trim();
            if (clean.length > 0) countMap[clean] = (countMap[clean] || 0) + 1;
          });
        });

        const formatted = Object.entries(countMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20);

        setTagsCount(formatted);
      } catch (err) {
        console.error("Erro ao buscar tags:", err);
      }
    };
    fetchTags();
  }, []);

  const handleSelectTag = (tag) => {
    SelectTopics.emit("filter-by-tag", tag);
    setMenuOpen(prev => ({ ...prev, topics: false, main: false }));
  };

  return (
    <header className="navbar-header">
      <div className="navbar-top">
        <div className="navbar-logo">
          <NavLink to="/" onClick={handleHomeClick} title="Voltar para a página inicial do blog Um Olhar pelo Paddock">
            <img 
              src={logo} 
              alt="Logo do blog Um Olhar pelo Paddock – Notícias e análises de F1™" 
              className="logo-f1" 
              loading="lazy"
            />
          </NavLink>
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
            <NavLink 
              to="/" 
              onClick={handleHomeClick}
              title="Página inicial – Últimas notícias e análises de Fórmula 1™"
            >
              Início
            </NavLink>
          </li>

          <li className="dropdown">
            <button
              className="dropdown-toggle"
              aria-haspopup="true"
              aria-expanded={menuOpen.topics}
              onClick={() => setMenuOpen(prev => ({ ...prev, topics: !prev.topics }))}
              title="Abrir lista de tópicos mais populares"
            >
              Tópicos
              <span className={`arrow ${menuOpen.topics ? "open" : ""}`}>▼</span>
            </button>

            <ul className={`dropdown-menu ${menuOpen.topics ? "show" : ""}`} aria-busy={tagsCount.length === 0}>
              <span className="dropdown-btn-label">Tópicos Mais Publicados</span>
              {tagsCount.length === 0 ? (
                <li style={{ padding: "8px 14px", opacity: 0.7 }}>Carregando...</li>
              ) : (
                tagsCount.map(tag => (
                  <li key={tag.name}>
                    <button
                      className="dropdown-btn-item"
                      onClick={() => handleSelectTag(tag.name)}
                      data-tag={tag.name}
                      type="button"
                      title={`Filtrar posts pelo tópico ${tag.name}`}
                    >
                      <span className="dropdown-btn-label">{tag.name}</span>
                      <span className="dropdown-btn-count">({tag.count})</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </li>

          <li><NavLink to="/pilotos" title="Página de pilotos – Informações e perfis de pilotos de F1™">Pilotos</NavLink></li>
          <li><NavLink to="/resultados" title="Página de resultados – Últimos resultados de corridas de F1™">Resultados</NavLink></li>
          <li><NavLink to="/calendario" title="Calendário de corridas – Datas e locais da temporada de F1™">Calendário</NavLink></li>
          <li><NavLink to="/guia" title="Guia para iniciantes – Entenda a Fórmula 1™ com dicas e explicações">Guia Para Iniciantes</NavLink></li>
          <li><NavLink to="/circuitos" title="Circuitos – Detalhes sobre os autódromos de Fórmula 1™">Circuitos</NavLink></li>
          <li><NavLink to="/sobre" title="Sobre – Informações sobre o blog">Sobre</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}

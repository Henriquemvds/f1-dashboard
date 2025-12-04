import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import "../styles/Navbar.css";
import car from "../images/car.png";
import { NavLink, useLocation } from "react-router-dom";
import { SelectTopics } from "../data/SelectTopics.js";


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState({ main: false, topics: false });
  const [tagsCount, setTagsCount] = useState([]);

  const location = useLocation();

const handleHomeClick = (e) => {
  if (location.pathname === "/") {
    e.preventDefault(); // impede a navegação padrão do NavLink
    window.location.reload(); // recarrega a página
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
            if (clean.length > 0) {
              countMap[clean] = (countMap[clean] || 0) + 1;
            }
          });
        });

        const formatted = Object.entries(countMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20); // ⬅️ TOP 20

        setTagsCount(formatted);
      } catch (err) {
        console.error("Erro ao buscar tags:", err);
      }
    };

    fetchTags();
  }, []);

  // -----------------------------
  // 🔥 Enviar tag selecionada ao Home
  // -----------------------------
  const handleSelectTag = (tag) => {
    SelectTopics.emit("filter-by-tag", tag);
    setMenuOpen(prev => ({ ...prev, topics: false, main: false }));
  };

  return (
    <header className="navbar-header">
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

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(prev => ({ ...prev, main: !prev.main }))}
        >
          ☰
        </button>
      </div>

      <nav className="navbar-bottom">
        <ul className={`navbar-links ${menuOpen.main ? "active" : ""}`}>

          <li>
            <NavLink to="/" onClick={handleHomeClick}>Início</NavLink>
          </li>

          {/* Dropdown */}
          <li className="dropdown">
            <button
              className="dropdown-toggle"
              onClick={() =>
                setMenuOpen(prev => ({ ...prev, topics: !prev.topics }))
              }
            >
              Tópicos
              <span className={`arrow ${menuOpen.topics ? "open" : ""}`}>▼</span>
            </button>

            <ul className={`dropdown-menu ${menuOpen.topics ? "show" : ""}`}>
              <span className="dropdown-btn-label">Tópicos Mais Publicados</span>
              {tagsCount.length === 0 ? (
                <li style={{ padding: "8px 14px", opacity: 0.7 }}>Carregando...</li>
              ) : (
                tagsCount.map(tag => (
                  <li key={tag.name}>
                    <button
                      className="dropdown-btn-item"
                      onClick={() => handleSelectTag(tag.name)}
                      // opcional: data-attr para debug/testes
                      data-tag={tag.name}
                      type="button"
                    >
                      <span className="dropdown-btn-label">{tag.name}</span>
                      <span className="dropdown-btn-count">({tag.count})</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </li>

          <li><NavLink to="/drivers">Pilotos</NavLink></li>
          <NavLink to="/results"><li>Resultados</li></NavLink>
          <NavLink to="/calendar"><li>Calendário</li></NavLink>
          <NavLink to="/guide"><li>Guia Para Iniciantes</li></NavLink>
          <li><NavLink to="/about">Sobre</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}

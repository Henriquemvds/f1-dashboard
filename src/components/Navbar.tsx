"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../images/LOGO-F1-PNG.png";
import { SelectTopics } from "../data/SelectTopics.js";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase";

type TagCount = {
  name: string;
  count: number;
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState({ main: false, topics: false });
  const [tagsCount, setTagsCount] = useState<TagCount[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const postsRef = collection(db, "posts");
        const snapshot = await getDocs(postsRef);

        const countMap: Record<string, number> = {};

        snapshot.forEach((doc) => {
          const data = doc.data();
          const tags: string[] = data.tags || [];

          tags.forEach((tag) => {
            const clean = tag.trim();
            if (clean.length > 0) {
              countMap[clean] = (countMap[clean] || 0) + 1;
            }
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

  const handleSelectTag = (tag: string) => {
    SelectTopics.emit("filter-by-tag", tag);
    setMenuOpen((prev) => ({ ...prev, topics: false, main: false }));
  };

  return (
    <header className="navbar-header">
      <div className="navbar-top">
        <div className="navbar-logo">
          <Link href="/">
            <Image src={logo} alt="F1 logo" className="logo-f1" />
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
          onClick={() => setMenuOpen((prev) => ({ ...prev, main: !prev.main }))}
        >
          ☰
        </button>
      </div>

      <nav className="navbar-bottom">
        <ul className={`navbar-links ${menuOpen.main ? "active" : ""}`}>

          <li>
            <Link href="/">Início</Link>
          </li>

          {/* Dropdown */}
          <li className="dropdown">
            <button
              className="dropdown-toggle"
              onClick={() =>
                setMenuOpen((prev) => ({ ...prev, topics: !prev.topics }))
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
                tagsCount.map((tag) => (
                  <li key={tag.name}>
                    <button
                      className="dropdown-btn-item"
                      onClick={() => handleSelectTag(tag.name)}
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

          <li><Link href="/pilotos">Pilotos</Link></li>
          <li><Link href="/resultados">Resultados</Link></li>
          <li><Link href="/calendario">Calendário</Link></li>
          <li><Link href="/guia">Guia Para Iniciantes</Link></li>
          <li><Link href="/circuitos">Circuitos</Link></li>
          <li><Link href="/sobre">Sobre</Link></li>
        </ul>
      </nav>
    </header>
  );
}

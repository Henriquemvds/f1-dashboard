import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../Firebase";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { NavLink } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specials, setSpecials] = useState([]);

  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem("lastPage");
    return saved ? Number(saved) : 1;
  });
  const postsPerPage = 15; // ⬅️ mínimo 1 por página

  useEffect(() => {
    async function loadPosts() {
      try {
        const postsRef = collection(db, "posts");
        const snapshot = await getDocs(postsRef);

        const loaded = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(loaded);
      } catch (error) {
        console.error("❌ Erro ao carregar posts:", error);
      } finally {
        setLoading(false);
      }
    }

    async function loadSpecials() {
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("date", "desc"), limit(10));
        const snapshot = await getDocs(q);

        const tenPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const shuffled = tenPosts.sort(() => Math.random() - 0.5);
        const topRandom = shuffled.slice(0, 3);
        setSpecials(topRandom);

      } catch (error) {
        console.error("❌ Erro ao carregar posts especiais:", error);
      }
    }

    loadPosts();
    loadSpecials();
  }, []);

  // -------------------------------------------
  // 🔥 PAGINAÇÃO REAL
  // -------------------------------------------
  const indexLast = currentPage * postsPerPage;
  const indexFirst = indexLast - postsPerPage;
  const currentPosts = posts.slice(indexFirst, indexLast);

  const totalPages = Math.ceil(posts.length / postsPerPage);


  // ---- GERADOR DINÂMICO DE PÁGINAS ----
   function getPageNumbers(currentPage, totalPages) {
    const pages = [];

    // Caso total de páginas seja 10 ou menos → Mostra todas
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Caso tenha mais de 10 páginas
    if (currentPage <= 6) {
      // está no início → mostra 1 até 10
      for (let i = 1; i <= 10; i++) {
        pages.push(i);
      }
      pages.push("last");
      return pages;
    }

    if (currentPage >= totalPages - 5) {
      // está no final → mostra últimas 10
      pages.push("first");
      for (let i = totalPages - 9; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Caso esteja no meio → exibe primeiro, "..." e intervalo dinâmico
    pages.push("first");

    const start = currentPage - 4;
    const end = currentPage + 4;

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    pages.push("last");

    return pages;
  }

  useEffect(() => {
    localStorage.setItem("lastPage", currentPage);
  }, [currentPage]);

  return (
    <div>
      <Navbar />

      <div className="home-container">

        <section className="hero">
          <div className="hero-content">
            <h1>Bem-vindo ao Universo da Velocidade</h1>
            <p>Descubra opiniões, curiosidades e tudo que move o mundo da Fórmula 1™.</p>
          </div>
        </section>

        <section className="blog-grid">
          <h2>Últimos Artigos</h2>

          {loading && <p>Carregando artigos...</p>}

          {!loading && currentPosts.length === 0 && (
            <p>Nenhum artigo encontrado.</p>
          )}

          {!loading &&
            currentPosts.map(post => (
              <NavLink to={`/article/${post.id}`} key={post.id}
                onClick={() => localStorage.setItem("lastPage", currentPage)}>
                <div className="card">
                  <img src={post.banner} alt={post.title} />
                  <h3>{post.title}</h3>
                  <p>{post.subtitle}</p>
                  <button className="buttonMore">
                    Leia mais
                  </button>
                </div>
              </NavLink>
            ))}

          <div className="pagination">

            {getPageNumbers(currentPage, totalPages).map((num, index) => {

              if (num === "first") {
                return (
                  <button key={index} onClick={() => setCurrentPage(1)}>
                    Primeira
                  </button>
                );
              }

              if (num === "last") {
                return (
                  <button key={index} onClick={() => setCurrentPage(totalPages)}>
                    Última
                  </button>
                );
              }

              return (
                <button
                  key={index}
                  onClick={() => setCurrentPage(num)}
                  className={currentPage === num ? "active" : ""}
                >
                  {num}
                </button>
              );
            })}

          </div>


        </section>

        <section className="specials">
          <h2>Destaques</h2>

          {specials.map(post => (
            <NavLink to={`/article/${post.id}`} key={post.id}>
              <div className="special-card">
                <img src={post.banner} alt={post.title} />
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.subtitle}</p>
                </div>
              </div>
            </NavLink>
          ))}
        </section>

      </div>

      <Footer />
    </div>
  );
}

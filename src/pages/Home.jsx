import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../Firebase";
import { getPageNumbers } from "../data/Pagination.js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { NavLink } from "react-router-dom";
import "../styles/Home.css";
import { SelectTopics } from "../data/SelectTopics.js";
import ArticleCard from "../components/Post.jsx";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [specials, setSpecials] = useState([]);

  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem("lastPage");
    return saved ? Number(saved) : 1;
  });

  const postsPerPage = 15;

  useEffect(() => {
    async function loadPosts() {
      const ref = collection(db, "posts");
      const snapshot = await getDocs(ref);

      const loaded = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(loaded);
      setFiltered(loaded);
      setLoading(false);
    }

    async function loadSpecials() {
      const ref = collection(db, "posts");
      const q = query(ref, orderBy("date", "desc"), limit(10));
      const snapshot = await getDocs(q);

      const ten = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const shuffled = ten.sort(() => Math.random() - 0.5);
      setSpecials(shuffled.slice(0, 3));
    }

    loadPosts();
    loadSpecials();
  }, []); // <-- sem dependências

  useEffect(() => {
    const unsubscribe = SelectTopics.on("filter-by-tag", (tagName) => {
      const f = posts.filter(p => p.tags?.includes(tagName));
      setFiltered(f);
      setCurrentPage(1);
    });

    return () => unsubscribe(); // remove ao desmontar
  }, [posts]);


  const indexLast = currentPage * postsPerPage;
  const indexFirst = indexLast - postsPerPage;
  const currentPosts = filtered.slice(indexFirst, indexLast);

  const totalPages = Math.ceil(filtered.length / postsPerPage);


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
                <ArticleCard post={post} />
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

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

        // Pega até 10 posts mais recentes
        const q = query(postsRef, orderBy("date", "desc"), limit(10));
        const snapshot = await getDocs(q);

        const tenPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Embaralhar e pegar 3 aleatórios
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

          {!loading && posts.length === 0 && (
            <p>Nenhum artigo encontrado.</p>
          )}

          {!loading &&
            posts.map(post => (
              <NavLink to={`/article/${post.id}`}>
                <div className="card" key={post.id}>
                  <img src={post.banner} alt={post.title} />
                  <h3>{post.title}</h3>
                  <p>{post.subtitle}</p>
                  <button className="buttonMore">
                    Leia mais
                  </button>
                </div>
              </NavLink>
            ))}
        </section>

        <section className="specials">
          <h2>Destaques</h2>

          {specials.map(post => (
            <NavLink to={`/article/${post.id}`}>
              <div className="special-card" key={post.id}>
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

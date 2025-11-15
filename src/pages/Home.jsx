import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { NavLink } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const postsRef = collection(db, "posts");
        const snapshot = await getDocs(postsRef);

        const loaded = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("🔥 POSTS CARREGADOS:", loaded);

        setPosts(loaded);
      } catch (error) {
        console.error("❌ Erro ao carregar posts:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="home-container">

        <section className="blog-grid">
          <h2>Últimos Artigos</h2>

          {loading && <p>Carregando artigos...</p>}

          {!loading && posts.length === 0 && (
            <p>Nenhum artigo encontrado.</p>
          )}

          {!loading &&
            posts.map(post => (
              <div className="card" key={post.id}>

                {/* 💥 AQUI! */}
                <img src={post.banner} alt={post.title} />

                <h3>{post.title}</h3>

                {/* 💥 Substitui resume */}
                <p>{post.subtitle}</p>

                <NavLink to={`/article/${post.id}`} className="buttonMore">
                  Leia mais
                </NavLink>
              </div>
            ))}
        </section>

      </div>

      <Footer />
    </div>
  );
}

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../Firebase";
import Pagination from "../components/Pagination.jsx";
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
      const q = query(ref, orderBy("date", "desc"));
      const snapshot = await getDocs(q);

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

  function buildHomeDescription(posts = []) {
  if (!posts.length) {
    return "Notícias, análises e opiniões sobre Fórmula 1™ no F1 Dash.";
  }

  const titles = posts.slice(0, 3).map(p => p.title).join(" • ");

  return `Últimos artigos sobre as corridas da Fórmula 1™: ${titles}. Análises, opiniões e bastidores no F1™ Dash.`;
}

const pageTitle = "F1™ Dash | Notícias, análises e bastidores das corridas daFórmula 1™";
const pageDescription = buildHomeDescription(posts);


  return (
    <div>

      <Helmet>
        <title>{pageTitle}</title>

        <link
          rel="canonical"
          href="https://www.blog-f1-dashboard.com/"
        />

        <meta name="description" content={pageDescription} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="https://www.blog-f1-dashboard.com/logo-f1-meta.png" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://www.blog-f1-dashboard.com/logo-f1-meta.png" />

        {/* Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "F1™ Dash",
            url: "https://www.blog-f1-dashboard.com/",
            logo: "https://www.blog-f1-dashboard.com/logo-f1-meta.png",
            sameAs: [
              "https://www.instagram.com/",
              "https://twitter.com/"
            ]
          })}
        </script>

        {/* WebSite + Search */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "F1™ Dash",
            url: "https://www.blog-f1-dashboard.com/",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://www.blog-f1-dashboard.com/?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>

        {/* ItemList – últimos artigos */}
        {!loading && posts.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: posts.slice(0, 10).map((post, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `https://www.blog-f1-dashboard.com/artigo/${post.id}`,
                name: post.title
              }))
            })}
          </script>
        )}
      </Helmet>
      <Navbar />

      <div className="home-container">

        <section className="hero">
          <div className="hero-content">
            <h1>Corridas da Fórmula 1™ em profundidade</h1>
            <p>Análises, opiniões e bastidores do mundo da velocidade.</p>
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
              <NavLink to={`/artigo/${post.id}`} key={post.id}
                onClick={() => localStorage.setItem("lastPage", currentPage)}>
                <ArticleCard post={post} />
              </NavLink>
            ))}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />


        </section>

        <section className="specials">
          <h2>Destaques</h2>

          {specials.map(post => (
            <NavLink to={`/artigo/${post.id}`} key={post.id}>
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

// pages/index.jsx
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../Firebase.js";
import Pagination from "../components/Pagination.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { SelectTopics } from "../data/SelectTopics.js";
import ArticleCard from "../components/Post.jsx";

export default function Home({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [filtered, setFiltered] = useState(initialPosts);
  const [loading, setLoading] = useState(!initialPosts.length);
  const [specials, setSpecials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 15;

  // Carrega destaques (top 10 aleatórios)
  useEffect(() => {
    async function loadSpecials() {
      const ref = collection(db, "posts");
      const q = query(ref, orderBy("date", "desc"), limit(10));
      const snapshot = await getDocs(q);
      const ten = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const shuffled = ten.sort(() => Math.random() - 0.5);
      setSpecials(shuffled.slice(0, 3));
    }
    loadSpecials();
  }, []);

  // Filtragem por tags
  useEffect(() => {
    const unsubscribe = SelectTopics.on("filter-by-tag", (tagName) => {
      const f = posts.filter(p => p.tags?.includes(tagName));
      setFiltered(f);
      setCurrentPage(1);
    });
    return () => unsubscribe();
  }, [posts]);

  // Paginação
  const indexLast = currentPage * postsPerPage;
  const indexFirst = indexLast - postsPerPage;
  const currentPosts = filtered.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filtered.length / postsPerPage);

  // Meta dinâmico
  function buildHomeDescription(posts = []) {
    if (!posts.length) return "Notícias, análises e opiniões sobre Fórmula 1™ no F1 Dash.";
    const titles = posts.slice(0, 3).map(p => p.title).join(" • ");
    return `Últimos artigos sobre as corridas da Fórmula 1™: ${titles}. Análises, opiniões e bastidores no F1™ Dash.`;
  }

  const pageTitle = "F1™ Dash | Notícias, análises e bastidores das corridas da Fórmula 1™";
  const pageDescription = buildHomeDescription(posts);

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        <link rel="canonical" href="https://www.blog-f1-dashboard.com/" />
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "F1™ Dash",
          url: "https://www.blog-f1-dashboard.com/",
          logo: "https://www.blog-f1-dashboard.com/logo-f1-meta.png",
          sameAs: [
            "https://www.instagram.com/",
            "https://twitter.com/"
          ]
        })}} />

        {/* WebSite + Search */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "F1™ Dash",
          url: "https://www.blog-f1-dashboard.com/",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://www.blog-f1-dashboard.com/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}} />

        {/* ItemList – últimos artigos */}
        {posts.length > 0 && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: posts.slice(0, 10).map((post, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `https://www.blog-f1-dashboard.com/artigo/${post.id}`,
              name: post.title
            }))
          })}} />
        )}
      </Head>

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
          {!loading && currentPosts.length === 0 && <p>Nenhum artigo encontrado.</p>}

          {!loading && currentPosts.map(post => (
            <Link href={`/artigo/${post.id}`} key={post.id}>
           
                <ArticleCard post={post} />
              
            </Link>
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
            <Link href={`/artigo/${post.id}`} key={post.id}>
              
                <div className="special-card">
                  <img src={post.banner} alt={post.title} />
                  <div>
                    <h3>{post.title}</h3>
                    <p>{post.subtitle}</p>
                  </div>
                </div>
             
            </Link>
          ))}
        </section>
      </div>

      <Footer />
    </div>
  );
}

// Next.js SSG com Firebase
export async function getStaticProps() {
  const ref = collection(db, "posts");
  const q = query(ref, orderBy("date", "desc"));
  const snapshot = await getDocs(q);

  const posts = snapshot.docs.map(doc => {
    const data = doc.data();

    // Converte comentários
    const comments = data.comments
      ? Object.fromEntries(
          Object.entries(data.comments).map(([key, comment]) => [
            key,
            {
              ...comment,
              createdAt: comment.createdAt?.toDate
                ? comment.createdAt.toDate().toISOString()
                : null,
            },
          ])
        )
      : {};

    return {
      id: doc.id,
      ...data,
      date: data.date?.toDate ? data.date.toDate().toISOString() : null,
      comments,
    };
  });

  return {
    props: { initialPosts: posts },
    revalidate: 60,
  };
}
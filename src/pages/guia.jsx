// pages/guia.jsx
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArticleCard from "../components/Post";
import Pagination from "../components/Pagination";
import { db } from "../Firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function Guide() {
  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lastPage");
      return saved ? Number(saved) : 1;
    }
    return 1;
  });

  const postsPerPage = 15;

  // Carrega posts do Firestore
  useEffect(() => {
    async function loadPosts() {
      try {
        const ref = collection(db, "guide");
        const q = query(ref, orderBy("date", "desc"));
        const snapshot = await getDocs(q);

        const loaded = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "",
            subtitle: data.subtitle || "",
            content: data.content || "",
            image: data.image || "",
            banner: data.banner || "",
            tags: Array.isArray(data.tags) ? data.tags : [],
            date: data.date?.toDate ? data.date.toDate().toISOString() : data.date || null,
            comments: data.comments
              ? Object.fromEntries(
                  Object.entries(data.comments).map(([key, comment]) => [
                    key,
                    {
                      comment: comment.comment || "",
                      createdAt: comment.createdAt?.toDate
                        ? comment.createdAt.toDate().toISOString()
                        : comment.createdAt || null,
                    },
                  ])
                )
              : {},
          };
        });

        setPosts(loaded);
        setFiltered(loaded);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar artigos do guia:", err);
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  // Paginação
  const indexLast = currentPage * postsPerPage;
  const indexFirst = indexLast - postsPerPage;
  const currentPosts = filtered.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filtered.length / postsPerPage);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lastPage", currentPage);
    }
  }, [currentPage]);

  function buildGuideDescription(posts = []) {
    if (!posts.length) {
      return "Guia para iniciantes na Fórmula 1™, com explicações sobre regras, mecânica, estratégias e funcionamento das corridas.";
    }

    const titles = posts.slice(0, 3).map(p => p.title).join(" • ");
    return `Guia completo das corridas da Fórmula 1™ para iniciantes: ${titles}. Aprenda regras, mecânica e conceitos essenciais das corridas da F1™.`;
  }

  const pageTitle = "Guia das corridas Fórmula 1™ para Iniciantes | Regras, mecânica e conceitos";
  const pageDescription = buildGuideDescription(posts);

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://www.blog-f1-dashboard.com/guia" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

        {/* CollectionPage Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Guia da Fórmula 1™ para Iniciantes",
            description: pageDescription,
            url: "https://www.blog-f1-dashboard.com/guia",
            inLanguage: "pt-BR",
            isPartOf: {
              "@type": "WebSite",
              name: "F1™ Dash",
              url: "https://www.blog-f1-dashboard.com/"
            }
          })}
        </script>

        {/* ItemList – artigos do guia */}
        {!loading && posts.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: posts.slice(0, 10).map((post, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `https://www.blog-f1-dashboard.com/artigo/${post.id}`,
                name: post.title || "",
              })),
            })}
          </script>
        )}
      </Head>

      <Navbar />

      <div className="home-container">
        <section className="hero-guide">
          <div className="hero-content">
            <h1>Guia Para Iniciantes</h1>
            <p>Aprenda sobre detalhes técnicos, regulamentos e mecânica das corridas da Fórmula 1™.</p>
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
      </div>

      <Footer />
    </div>
  );
}

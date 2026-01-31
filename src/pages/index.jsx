// pages/index.jsx
import { useState, useEffect } from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Pagination from "../components/Pagination.jsx";
import ArticleCard from "../components/Post.jsx";
import { SelectTopics } from "../data/SelectTopics.js";

export default function Home({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [filtered, setFiltered] = useState(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 15;

  // Filtragem por tags
  useEffect(() => {
    const unsubscribe = SelectTopics.on("filter-by-tag", (tagName) => {
      const f = posts.filter((p) => p.tags?.includes(tagName));
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

  // SEO
  const pageTitle = "F1 Dash | Notícias e análises de corridas de Fórmula 1";
  const pageDescription =
    posts.length > 0
      ? `Últimos artigos sobre Fórmula 1: ${posts.slice(0, 3).map((p) => p.title).join(", ")}`
      : "Notícias, análises e bastidores das corridas da Fórmula 1. Acompanhe resultados, análises e curiosidades do mundo da F1.";
  const siteUrl = "https://www.blog-f1-dashboard.com";
  const defaultImage = `https://www.blog-f1-dashboard.com/logo-f1-meta.png`;

  return (
    <div>
      <Head>
        {/* Meta Básico */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={siteUrl} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={defaultImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={defaultImage} />

        {/* CollectionPage Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Notícias, análises e opiniões sobre as corridas da Fórmula 1",
            description: pageDescription,
            url: siteUrl,
            inLanguage: "pt-BR",
            isPartOf: {
              "@type": "WebSite",
              name: "F1 Dash",
              url: siteUrl
            }
          })}
        </script>

        {/* ItemList Schema – últimos artigos */}
        {posts.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: posts.slice(0, 10).map((post, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${siteUrl}/artigo/${post.slug}`,
                name: post.title
              }))
            })}
          </script>
        )}

        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteUrl
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Artigos",
                item: siteUrl
              }
            ]
          })}
        </script>

        {/* Paginação SEO */}
        {currentPage < totalPages && (
          <link rel="next" href={`/?page=${currentPage + 1}`} />
        )}
        {currentPage > 1 && (
          <link rel="prev" href={`/?page=${currentPage - 1}`} />
        )}
      </Head>

      <Navbar />

      <div className="home-container">
        <section className="blog-grid">
          <section className="hero">
            <div className="hero-content">
              <h1>Notícias, Análises e Bastidores</h1>
              <p>Últimas notícias e artigos sobre corridas de Fórmula 1™, análises detalhadas e curiosidades do mundo da F1™.</p>
            </div>
          </section>

          <h2>Últimos Artigos</h2>

          {currentPosts.length === 0 && <p>Nenhum artigo encontrado.</p>}

          {currentPosts.map((post) => (
            <Link href={`/artigo/${post.slug}`} key={post.slug}>
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

// ===============================
// SSG com posts em Markdown
// ===============================
export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), "posts");
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");

    const { data, content } = matter(fileContents);

    return {
      slug: filename.replace(/\.md$/, ""),
      ...data,
      content
    };
  });

  // Ordena por data decrescente
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    props: { initialPosts: posts },
    revalidate: 60
  };
}

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
import FaqF1 from "../components/FaqF1.jsx";
import { SelectTopics } from "../data/SelectTopics.js";

export default function Home({ initialPosts, initialGuide }) {
  const [posts, setPosts] = useState(initialPosts);
  const [guide, setGuide] = useState(initialGuide);
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
  const pageTitle = "Notícias e análises de corridas de Fórmula 1 | Blog F1 Dash";
  const pageDescription =
    posts.length > 0
      ? `Últimos artigos sobre Fórmula 1: ${posts.slice(0, 3).map((p) => p.title).join(", ")}`
      : "Notícias, análises e bastidores das corridas da Fórmula 1. Acompanhe resultados, análises e curiosidades do mundo da F1.";
  const siteUrl = "https://www.blog-f1-dashboard.com";
  const defaultImage = `https://www.blog-f1-dashboard.com/logo-f1-meta.png`;

  return (
    <div>
      <Head>
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
      </Head>

      <Navbar />

      <div className="home-container">
        <section className="blog-grid">
          <section className="hero">
            <div className="hero-content">
              <h1>Notícias da Fórmula 1™, Resultados e Análises das Corridas</h1>
              <p>Últimas notícias e artigos sobre corridas de Fórmula 1™.</p>
            </div>
          </section>

          <section className="seo-intro">
            <h2>Blog sobre Notícias da Fórmula 1™</h2>
            <p>
              O Blog F1 Dash traz notícias de caráter pessoal da Fórmula 1™, análises detalhadas das corridas, classificação do campeonato, resultados
              dos GPs e bastidores das equipes como Ferrari, Red Bull, Mercedes e McLaren.
            </p>
          </section>

          <section className="highlight-guide">
            <h2>🌟 Destaques do Guia para Iniciantes</h2>

            <ul className="guide-list">
              {guide.slice(0, 3).map((post) => (
                <li key={post.slug} className="guide-item">
                  <Link href={`/guia/${post.slug}`} className="guide-card">
                    <img src={post.image || post.banner} alt={post.title} />
                    <h4>{post.title}</h4>
                  </Link>
                </li>
              ))}
            </ul>

            <Link href="/guia" className="buttonMore">
              Ver todos os artigos do Guia →
            </Link>
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

      <FaqF1 />
      <Footer />
    </div>
  );
}

// ===============================
// SSG com posts em Markdown e guia
export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), "posts");
  const guideDirectory = path.join(process.cwd(), "guide");

  // Helper para serializar post
  function serializePost(filePath, filename) {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    return {
      slug: filename.replace(/\.md$/, ""),
      ...data,
      content,
      date: data.date ? new Date(data.date).toISOString() : null, // ✅ Serializa Date
    };
  }

  // Posts de notícias
  const postFiles = fs.readdirSync(postsDirectory);
  const initialPosts = postFiles
    .map((filename) => serializePost(path.join(postsDirectory, filename), filename))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Posts do guia
  const guideFiles = fs.readdirSync(guideDirectory);
  const initialGuide = guideFiles
    .map((filename) => serializePost(path.join(guideDirectory, filename), filename))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    props: { initialPosts, initialGuide },
    revalidate: 60,
  };
}

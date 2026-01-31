// pages/guide.jsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArticleCard from "../components/Post";
import Pagination from "../components/Pagination";

// ============================
// Serializa MD → JSON seguro
// ============================
function serializePost(post) {
  return {
    ...post,
    date: post.date ? new Date(post.date).toISOString() : null,
    comments: post.comments || {},
  };
}

// ============================
// Página Guia
// ============================
export default function Guide({ allPosts }) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 15;

  const indexLast = currentPage * postsPerPage;
  const indexFirst = indexLast - postsPerPage;
  const currentPosts = allPosts.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  function buildGuideDescription(posts = []) {
    if (!posts.length)
      return "Guia para iniciantes na Fórmula 1, com explicações sobre regras, mecânica, estratégias e funcionamento das corridas.";
    const titles = posts.slice(0, 3).map(p => p.title).join(" • ");
    return `Guia completo das corridas da Fórmula 1 para iniciantes: ${titles}. Aprenda regras, mecânica e conceitos essenciais da F1.`;
  }

  const pageTitle = "Guia de Corridas da Fórmula 1 para Iniciantes | Regras, Mecânica e Estratégias";
  const pageDescription = buildGuideDescription(allPosts);
  const siteUrl = "https://www.blog-f1-dashboard.com";
  const defaultImage = `${siteUrl}/images/og-banner.png`;

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        {/* Meta básico */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`${siteUrl}/guia`} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:url" content={`${siteUrl}/guia`} />
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
            name: "Guia da Fórmula 1 para Iniciantes",
            description: pageDescription,
            url: `${siteUrl}/guia`,
            inLanguage: "pt-BR",
            isPartOf: {
              "@type": "WebSite",
              name: "F1 Dash",
              url: siteUrl,
            },
          })}
        </script>

        {/* ItemList Schema – últimos artigos */}
        {allPosts.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: allPosts.slice(0, 10).map((post, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${siteUrl}/artigo/${post.slug}`,
                name: post.title || "",
              })),
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
                item: siteUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Guia",
                item: `${siteUrl}/guia`,
              },
            ],
          })}
        </script>

        {/* Paginação SEO */}
        {currentPage < totalPages && (
          <link rel="next" href={`/guia?page=${currentPage + 1}`} />
        )}
        {currentPage > 1 && (
          <link rel="prev" href={`/guia?page=${currentPage - 1}`} />
        )}
      </Head>

      <Navbar />

      <div className="home-container">
        <section className="hero-guide">
          <div className="hero-content">
            <h1>Guia Completo para Iniciantes em Fórmula 1™</h1>
            <p>Aprenda regras, mecânica, estratégias e detalhes técnicos das corridas da Fórmula 1™.</p>
          </div>
        </section>

        <section className="blog-grid">
          <h2>Últimos Artigos do Guia</h2>

          {currentPosts.length === 0 && <p>Nenhum artigo encontrado.</p>}

          {currentPosts.map(post => (
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

// ============================
// SSG – Lê arquivos Markdown da pasta "guide"
// ============================
export async function getStaticProps() {
  const guideDir = path.join(process.cwd(), "guide");

  let allPosts = [];
  if (fs.existsSync(guideDir)) {
    const files = fs.readdirSync(guideDir).filter(f => f.endsWith(".md"));

    allPosts = files.map(f => {
      const filePath = path.join(guideDir, f);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);
      return serializePost({
        slug: f.replace(/\.md$/, ""),
        ...data,
        content,
      });
    });

    // Ordena por data decrescente
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return {
    props: { allPosts },
    revalidate: 60,
  };
}

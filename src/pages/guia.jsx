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
    if (!posts.length) return "Guia para iniciantes na Fórmula 1™, com explicações sobre regras, mecânica, estratégias e funcionamento das corridas.";
    const titles = posts.slice(0, 3).map(p => p.title).join(" • ");
    return `Guia completo das corridas da Fórmula 1™ para iniciantes: ${titles}. Aprenda regras, mecânica e conceitos essenciais das corridas da F1™.`;
  }

  const pageTitle = "Guia das corridas Fórmula 1™ para Iniciantes | Regras, mecânica e conceitos";
  const pageDescription = buildGuideDescription(allPosts);

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
        {allPosts.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: allPosts.slice(0, 10).map((post, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `https://www.blog-f1-dashboard.com/artigo/${post.id}`,
                name: post.title || "",
              }))
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

          {currentPosts.length === 0 && <p>Nenhum artigo encontrado.</p>}

          {currentPosts.map(post => (
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
        id: f.replace(/\.md$/, ""),
        ...data,
        content,
      });
    });

    // Ordena por data decrescente
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return {
    props: { allPosts },
    revalidate: 60, // revalida a cada 60s
  };
}

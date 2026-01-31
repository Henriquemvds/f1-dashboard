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

  const pageTitle = "F1™ Dash | Notícias, análises e bastidores das corridas da Fórmula 1™";
  const pageDescription =
    posts.length > 0
      ? `Últimos artigos: ${posts.slice(0, 3).map((p) => p.title).join(" • ")}`
      : "Notícias, análises e opiniões sobre as corridas da Fórmula 1™.";

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>

      <Navbar />

      <div className="home-container">
        <section className="blog-grid">
          <section className="hero">
            <div className="hero-content">
              <h1>Guia Para Iniciantes</h1>
              <p>Notícias, análises e opiniões sobre as corridas da Fórmula 1™</p>
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
      content,
    };
  });

  // Ordena por data decrescente
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    props: { initialPosts: posts },
    revalidate: 60,
  };
}

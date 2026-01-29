import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ArticleContent from "../../components/ArticleContent";

// Serializa MD → JSON seguro
function serializePost(post) {
  if (!post) return null;
  return {
    ...post,
    date: post.date ? new Date(post.date).toISOString() : null,
    comments: post.comments || {},
  };
}

// Página
export default function ArticlePage({ post, relatedPosts, collectionType }) {
  if (!post) {
    return (
      <>
        <Navbar />
        <h1>Conteúdo não encontrado</h1>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="article-container">
        <ArticleContent content={post} collectionType={collectionType} />

        <div className="article-related">
          <h3>Leia também</h3>
          <div className="related-list">
            {relatedPosts.map((p) => (
              <Link key={p.id} href={`/artigo/${p.id}`} className="related-card">
                <img src={p.image || p.banner} alt={p.title} />
                <h4>{p.title}</h4>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

// ============================
// Paths estáticos
// ============================
export async function getStaticPaths() {
  const directories = ["posts", "guide"];
  let paths = [];

  directories.forEach((dir) => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) return;

    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".md"));
    const dirPaths = files.map((f) => ({
      params: { id: f.replace(/\.md$/, "") },
    }));
    paths = paths.concat(dirPaths);
  });

  return {
    paths,
    fallback: false, // ou true/‘blocking’ se quiser gerar novas páginas on-demand
  };
}

// ============================
// Conteúdo estático MD
// ============================
export async function getStaticProps({ params }) {
  const { id } = params;
  const directories = ["posts", "guide"];
  let found = null;

  for (const dir of directories) {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath);
    const fileName = files.find((f) => f.replace(/\.md$/, "") === id);
    if (!fileName) {
      continue;
    }

    const filePath = path.join(dirPath, fileName);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);

    const relatedPosts = files
      .filter((f) => f !== fileName)
      .slice(0, 3)
      .map((f) => {
        const md = fs.readFileSync(path.join(dirPath, f), "utf8");
        const { data } = matter(md);
        return serializePost({ id: f.replace(/\.md$/, ""), ...data });
      });

    found = {
      post: serializePost({ id, ...data, content }),
      relatedPosts,
      collectionType: dir,
    };

    break;
  }

  if (!found) {
    return {
      notFound: true,
    };
  }

  return {
    props: found,
  };
}

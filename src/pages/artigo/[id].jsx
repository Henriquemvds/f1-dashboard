import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ArticleContent from "../../components/ArticleContent";

// ============================
// Serializa MD → JSON seguro
// ============================
function serializePost(post) {
  if (!post) return null;

  return {
    ...post,
    date: post.date ? new Date(post.date).toISOString() : null,
    comments: post.comments || {},
  };
}

// ============================
// Página
// ============================
export default function ArticlePage({ post, relatedPosts, collectionType }) {

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
// SSR lendo Markdown (posts ou guide)
// ============================
export async function getServerSideProps({ params }) {
  const { id } = params;

  const directories = ["posts", "guide"]; // busca primeiro em posts, depois em guide

  let found = null;
  let collectionType = "posts";

  for (const dir of directories) {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath);
    const fileName = files.find((f) => f.replace(/\.md$/, "") === id);
    if (fileName) {
      const filePath = path.join(dirPath, fileName);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);

      found = {
        post: serializePost({ id, ...data, content }),
        relatedPosts: files
          .filter((f) => f !== fileName)
          .slice(0, 3)
          .map((f) => {
            const md = fs.readFileSync(path.join(dirPath, f), "utf8");
            const { data } = matter(md);
            return serializePost({ id: f.replace(/\.md$/, ""), ...data });
          }),
        collectionType: dir,
      };
      break;
    }
  }

  if (!found) {
    return { props: { post: null, relatedPosts: [], collectionType: null } };
  }

  return {
    props: found,
  };
}

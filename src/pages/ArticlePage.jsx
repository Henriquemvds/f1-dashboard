import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/ArticlePage.css";
import { useEffect, useState } from "react";
import { db } from "../Firebase";
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export default function ArticlePage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const postRef = doc(db, "posts", id);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
          setPost(null);
          setLoading(false);
          return;
        }

        const currentPost = { id: postSnap.id, ...postSnap.data() };
        setPost(currentPost);

        // Buscar posts relacionados
        const postsRef = collection(db, "posts");
        const postsQuery = query(postsRef, orderBy("date", "desc"), limit(4));
        const snapshot = await getDocs(postsQuery);
        const lastPosts = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(p => p.id !== id)
          .slice(0, 3);

        setRelatedPosts(lastPosts);

      } catch (error) {
        console.error("Erro ao carregar o post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id]);

  if (loading) return <p>Carregando artigo...</p>;
  if (!post) return <h1>Artigo não encontrado</h1>;

  return (
    <>
      <Navbar />

      <div className="article-container">

        <img src={post.image} className="article-banner" alt={post.title} />

        <div className="article-header">
          <h1>{post.title}</h1>

          <p className="article-meta">
            Publicado em{" "}
            <span>
              {post.date && post.date.toDate
                ? post.date.toDate().toLocaleDateString("pt-BR")
                : "Sem data definida"}
            </span>{" "}
            • Por <span>{post.author || "Henrique Santos"}</span>
          </p>

          <div className="article-tags">
            {post.tags?.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>

        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="article-related">
          <h3>Leia também</h3>
          <div className="related-list">
            {relatedPosts.map(p => (
              <Link key={p.id} to={`/article/${p.id}`} className="related-card">
                <img src={p.image} alt={p.title} />
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

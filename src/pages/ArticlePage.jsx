import { useParams, Link } from "react-router-dom";
import { posts } from "../data/posts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/ArticlePage.css";
import { useEffect, useState } from "react";

export default function ArticlePage() {
  const { id } = useParams();
  const post = posts.find(p => p.id === id);
  const [progress, setProgress] = useState(0);

  if (!post) return <h1>Artigo não encontrado</h1>;


  return (
    <>
      <Navbar />

      <div className="article-container">

        <img src={post.image} className="article-banner" />

        <div className="article-header">
          <h1>{post.title}</h1>

          <p className="article-meta">
            Publicado em <span>{post.date || "20/02/2025"}</span> • Por <span>{post.author || "Henrique Santos"}</span>
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

        {/* Leia Também */}
        <div className="article-related">
          <h3>Leia também</h3>
          <div className="related-list">
            {posts
              .filter(p => p.id !== id)
              .slice(0, 3)
              .map(p => (
                <Link key={p.id} to={`/article/${p.id}`} className="related-card">
                  <img src={p.image} />
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

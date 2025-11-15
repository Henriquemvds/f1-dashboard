import { useParams } from "react-router-dom";
import { posts } from "../data/posts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/ArticlePage.css";

export default function ArticlePage() {
  const { id } = useParams();
  const post = posts.find(p => p.id === id);

  if (!post) return <h1>Artigo não encontrado</h1>;

  return (
    <>
      <Navbar />
      
      <div className="article-container">
        <img src={post.image} className="article-banner" />

        <h1>{post.title}</h1>

        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      <Footer />
    </>
  );
}

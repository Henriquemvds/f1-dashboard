import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/ArticlePage.css";
import { useEffect, useState } from "react";
import { db } from "../Firebase";
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import Loading from "../components/Loading";
import ArticleContent from "../components/ArticleContent";

export default function ArticlePage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collectionName, setCollectionName] = useState(null);

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);

        let ref = doc(db, "posts", id);
        let snap = await getDoc(ref);

        // 1️⃣ TENTA POSTS
        if (snap.exists()) {
          setCollectionName("posts");
        } else {
          // 2️⃣ SE NÃO EXISTIR, TENTA GUIDE
          ref = doc(db, "guide", id);
          snap = await getDoc(ref);

          if (!snap.exists()) {
            setPost(null);
            setLoading(false);
            return;
          }

          setCollectionName("guide");
        }

        // 3️⃣ CONTEÚDO PRINCIPAL
        const data = { id: snap.id, ...snap.data() };
        setPost(data);

      } catch (e) {
        console.error("Erro ao carregar conteúdo:", e);
        setPost(null);
      }
    }

    loadContent();
  }, [id]);

  // 4️⃣ Carregar RELACIONADOS assim que collectionName estiver definido
  useEffect(() => {
    async function loadRelated() {
      if (!collectionName) return;

      try {
        const listRef = collection(db, collectionName);
        const q = query(listRef, orderBy("date", "desc"), limit(6));

        const relatedSnap = await getDocs(q);
        const related = relatedSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(p => p.id !== id)
          .slice(0, 3);

        setRelatedPosts(related);

      } catch (e) {
        console.error("Erro ao carregar relacionados:", e);
        setRelatedPosts([]);
      } finally {
        setLoading(false);
      }
    }

    loadRelated();
  }, [collectionName, id]);

  if (loading) return <Loading />;
  if (!post) return <h1>Conteúdo não encontrado</h1>;

  return (
    <>
      <Navbar />
      <div className="article-container">

        <ArticleContent content={post} />

        <div className="article-related">
          <h3>Leia também</h3>

          <div className="related-list">
            {relatedPosts.map(p => (
              <Link key={p.id} to={`/article/${p.id}`} className="related-card">
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

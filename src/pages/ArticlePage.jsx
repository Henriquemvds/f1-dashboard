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
  const [collectionType, setCollectionType] = useState(null); // 'posts' ou 'guide'

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);

        // 1️⃣ TENTA POSTS
        let ref = doc(db, "posts", id);
        let snap = await getDoc(ref);

        if (snap.exists()) {
          setCollectionType("posts");
        } else {
          // 2️⃣ SE NÃO EXISTIR, TENTA GUIDE
          ref = doc(db, "guide", id);
          snap = await getDoc(ref);

          if (!snap.exists()) {
            setPost(null);
            setLoading(false);
            return;
          }

          setCollectionType("guide");
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

  // 4️⃣ Carregar RELACIONADOS assim que collectionType estiver definido
  useEffect(() => {
    async function loadRelated() {
      if (!collectionType) return;

      try {
        const listRef = collection(db, collectionType);
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
  }, [collectionType, id]);

  if (loading) return <Loading />;
  if (!post) return <h1>Conteúdo não encontrado</h1>;

  return (
    <>
      <Navbar />
      <div className="article-container">
        {/* PASSA collectionType para ArticleContent */}
        <ArticleContent content={post} collectionType={collectionType} />

        <div className="article-related">
          <h3>Leia também</h3>
          <div className="related-list">
            {relatedPosts.map(p => (
              <Link key={p.id} to={`/artigo/${p.id}`} className="related-card">
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

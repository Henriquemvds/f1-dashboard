// src/pages/artigo/[id].tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import Link from "next/link";
import ArticleContent, { Content } from "../../components/ArticleContent";
import { db } from "../../../Firebase"; // ajuste do path
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";

// Tipo dos posts
interface Post {
  id: string;
  title?: string;
  banner?: string;
  image?: string;
  description?: string;
  author?: string;
  content?: string;
  tags?: string[];
  date?: Timestamp | null;
}

export default function ArticlePage() {
  const router = useRouter();
  const { id } = router.query;

  const postId = typeof id === "string" ? id : null;

  const [post, setPost] = useState<Content | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [collectionType, setCollectionType] = useState<"posts" | "guide" | null>(
    null
  );

  // 🔹 Carrega o artigo principal
  useEffect(() => {
    if (!postId) return;

    async function loadContent(currentId: string) {
      try {
        setLoading(true);

        // Tenta buscar primeiro em "posts"
        let ref = doc(db, "posts", currentId);
        let snap = await getDoc(ref);

        if (!snap.exists()) {
          // Se não existir, tenta "guide"
          ref = doc(db, "guide", currentId);
          snap = await getDoc(ref);

          if (!snap.exists()) {
            setPost(null);
            return;
          }
          setCollectionType("guide");
        } else {
          setCollectionType("posts");
        }

        const rawData = snap.data() as Post;

        const data: Content = {
          id: snap.id,
          title: rawData.title || "Sem título",
          banner: rawData.banner || "",
          image: rawData.image || "",
          description: rawData.description || "",
          author: rawData.author || "Henrique Santos",
          content: rawData.content || "",
          tags: rawData.tags || [],
          date: rawData.date || null,
        };

        setPost(data);
      } catch (error) {
        console.error("Erro ao carregar artigo:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    }

    loadContent(postId);
  }, [postId]);

  // 🔹 Carrega artigos relacionados
  useEffect(() => {
    if (!collectionType || !postId) return;

    async function loadRelated(
      currentCollection: "posts" | "guide",
      currentId: string
    ) {
      try {
        const listRef = collection(db, currentCollection);
        const q = query(listRef, orderBy("date", "desc"), limit(6));
        const relatedSnap = await getDocs(q);

        const related: Post[] = relatedSnap.docs
          .map((d) => ({ id: d.id, ...d.data() } as Post))
          .filter((p) => p.id !== currentId)
          .slice(0, 3);

        setRelatedPosts(related);
      } catch (error) {
        console.error("Erro ao carregar relacionados:", error);
        setRelatedPosts([]);
      }
    }

    loadRelated(collectionType, postId);
  }, [collectionType, postId]);

  return (
    <>
      <Navbar />

      <div className="article-container">
        {loading && <Loading />}

        {!loading && post && collectionType && (
          <ArticleContent content={post} collectionType={collectionType} />
        )}

        {!loading && relatedPosts.length > 0 && (
          <div className="article-related">
            <h3>Leia também</h3>
            <div className="related-list">
              {relatedPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/artigo/${p.id}`}
                  className="related-card"
                >
                  <img src={p.image || p.banner || ""} alt={p.title || "Sem título"} />
                  <h4>{p.title || "Sem título"}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

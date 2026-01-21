// src/pages/guide.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArticleCard, { Post as ArticleCardPost } from "../components/Post";
import Pagination from "../components/Pagination";
import { db } from "../../Firebase"; // ajuste do path
import {
  collection,
  getDocs,
  query,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

// Tipo dos posts do guia
export type GuidePost = ArticleCardPost & {
  id: string;
  date?: { toDate?: () => Date } | null;
};

export default function Guide() {
  const [posts, setPosts] = useState<GuidePost[]>([]);
  const [filtered, setFiltered] = useState<GuidePost[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 15;

  // Carrega página salva apenas no client
  useEffect(() => {
    const saved = localStorage.getItem("lastPage");
    if (saved) setCurrentPage(Number(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("lastPage", currentPage.toString());
  }, [currentPage]);

  // Carrega posts do Firestore
  useEffect(() => {
    async function loadPosts() {
      try {
        const ref = collection(db, "guide");
        const q = query(ref, orderBy("date", "desc"));
        const snapshot = await getDocs(q);

        const loaded: GuidePost[] = snapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title || "Sem título",
              subtitle: data.subtitle || "",
              banner: data.banner || "",
              tags: data.tags || [],
              date: data.date || null,
              author: data.author || "Henrique Santos",
            };
          }
        );

        setPosts(loaded);
        setFiltered(loaded);
      } catch (err) {
        console.error("Erro ao carregar posts do guia:", err);
        setPosts([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  // Paginação
  const indexLast = currentPage * postsPerPage;
  const indexFirst = indexLast - postsPerPage;
  const currentPosts = filtered.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filtered.length / postsPerPage);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="home-container">
        <section className="hero">
          <div className="hero-content">
            <h1>Guia Para Iniciantes</h1>
            <p>
              Aprenda sobre detalhes técnicos, regulamentos e mecânica das
              corridas da Fórmula 1™.
            </p>
          </div>
        </section>

        <section className="blog-grid">
          <h2>Últimos Artigos</h2>

          {loading && <p>Carregando artigos...</p>}

          {!loading && currentPosts.length === 0 && <p>Nenhum artigo encontrado.</p>}

          {!loading &&
            currentPosts.map((post) => (
              <Link
                href={`/artigo/${post.id}`}
                key={post.id}
                onClick={() =>
                  localStorage.setItem("lastPage", currentPage.toString())
                }
              >
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

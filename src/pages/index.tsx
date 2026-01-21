import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../Firebase"; // ajustado para o path correto
import Pagination from "../components/Pagination";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArticleCard, { Post as ArticleCardPost } from "../components/Post";
import { SelectTopics } from "../data/SelectTopics";

// Tipo compatível com ArticleCard
export type HomePost = ArticleCardPost & { id: string };

export default function Home() {
  const [posts, setPosts] = useState<HomePost[]>([]);
  const [filtered, setFiltered] = useState<HomePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [specials, setSpecials] = useState<HomePost[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 15;

  // Sincroniza página com localStorage apenas no Client
  useEffect(() => {
    const saved = localStorage.getItem("lastPage");
    if (saved) setCurrentPage(Number(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("lastPage", currentPage.toString());
  }, [currentPage]);

  // Carrega posts e destaques
  useEffect(() => {
    async function loadPosts() {
      try {
        const ref = collection(db, "posts");
        const q = query(ref, orderBy("date", "desc"));
        const snapshot = await getDocs(q);

        const loaded: HomePost[] = snapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            title: doc.data().title || "Sem título",
            subtitle: doc.data().subtitle || "",
            banner: doc.data().banner || "",
            tags: doc.data().tags || [],
            date: doc.data().date || null,
            author: doc.data().author || "Henrique Santos",
          })
        );

        setPosts(loaded);
        setFiltered(loaded);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar posts:", err);
        setLoading(false);
      }
    }

    async function loadSpecials() {
      try {
        const ref = collection(db, "posts");
        const q = query(ref, orderBy("date", "desc"), limit(10));
        const snapshot = await getDocs(q);

        const ten: HomePost[] = snapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            title: doc.data().title || "Sem título",
            subtitle: doc.data().subtitle || "",
            banner: doc.data().banner || "",
            tags: doc.data().tags || [],
            date: doc.data().date || null,
            author: doc.data().author || "Henrique Santos",
          })
        );

        const shuffled = ten.sort(() => Math.random() - 0.5);
        setSpecials(shuffled.slice(0, 3));
      } catch (err) {
        console.error("Erro ao carregar destaques:", err);
      }
    }

    loadPosts();
    loadSpecials();
  }, []);

  // Filtro por tag
  useEffect(() => {
    const unsubscribe = SelectTopics.on("filter-by-tag", (tagName: string) => {
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

  return (
    <div>
      <Navbar />

      <div className="home-container">
        <section className="hero">
          <div className="hero-content">
            <h1>Bem-vindo ao Universo da Velocidade</h1>
            <p>
              Descubra opiniões, curiosidades e tudo que move o mundo das
              corridas Fórmula 1™.
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

        <section className="specials">
          <h2>Destaques</h2>

          {specials.map((post) => (
            <Link href={`/artigo/${post.id}`} key={post.id}>
              <div className="special-card">
                {post.banner && <img src={post.banner} alt={post.title} />}
                <div>
                  <h3>{post.title}</h3>
                  {post.subtitle && <p>{post.subtitle}</p>}
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>

      <Footer />
    </div>
  );
}

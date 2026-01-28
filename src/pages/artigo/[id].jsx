// pages/artigo/[id].jsx
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ArticleContent from "../../components/ArticleContent";
import { db } from "../../Firebase";
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

// Função para serializar posts e comentários do Firestore
function serializePost(post) {
  if (!post) return null;

  return {
    ...post,
    date: post.date?.toDate?.()?.toISOString() || post.date || null,
    comments: post.comments
      ? Object.fromEntries(
          Object.entries(post.comments).map(([id, comment]) => [
            id,
            {
              ...comment,
              createdAt: comment.createdAt?.toDate?.()?.toISOString() || comment.createdAt || null,
            },
          ])
        )
      : {},
  };
}

export default function ArticlePage({ post, relatedPosts, collectionType }) {
  const router = useRouter();

  if (router.isFallback) return <Loading />;

  if (!post)
    return (
      <>
        <Navbar />
        <h1>Conteúdo não encontrado</h1>
        <Footer />
      </>
    );

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

// Carrega os dados do artigo e relacionados no servidor
export async function getServerSideProps(context) {
  const { id } = context.params;
  let post = null;
  let collectionType = null;

  try {
    // Tenta "posts"
    let ref = doc(db, "posts", id);
    let snap = await getDoc(ref);

    if (snap.exists()) {
      collectionType = "posts";
    } else {
      // Tenta "guide"
      ref = doc(db, "guide", id);
      snap = await getDoc(ref);

      if (!snap.exists()) {
        return { props: { post: null, relatedPosts: [], collectionType: null } };
      }
      collectionType = "guide";
    }

    const data = snap.data();
    post = serializePost({ id: snap.id, ...data });

    // Carrega relacionados
    const listRef = collection(db, collectionType);
    const q = query(listRef, orderBy("date", "desc"), limit(6));
    const relatedSnap = await getDocs(q);

    const relatedPosts = relatedSnap.docs
      .map((d) => serializePost({ id: d.id, ...d.data() }))
      .filter((p) => p.id !== id)
      .slice(0, 3);

    return { props: { post, relatedPosts, collectionType } };
  } catch (e) {
    console.error("Erro ao carregar artigo:", e);
    return { props: { post: null, relatedPosts: [], collectionType: null } };
  }
}
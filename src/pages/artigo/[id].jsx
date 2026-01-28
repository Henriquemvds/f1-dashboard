import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ArticleContent from "../../components/ArticleContent";
import { adminDb } from "../../FirebaseAdmin";

// Serializa Firestore Admin → JSON seguro
function serializePost(post) {
  if (!post) return null;

  return {
    ...post,
    date: post.date?.toDate
      ? post.date.toDate().toISOString()
      : post.date || null,
    comments: post.comments
      ? Object.fromEntries(
          Object.entries(post.comments).map(([id, comment]) => [
            id,
            {
              ...comment,
              createdAt: comment.createdAt?.toDate
                ? comment.createdAt.toDate().toISOString()
                : comment.createdAt || null,
            },
          ])
        )
      : {},
  };
}

export default function ArticlePage({ post, relatedPosts, collectionType }) {
  const router = useRouter();

  if (router.isFallback) return <Loading />;

  if (!post) {
    return (
      <>
        <Navbar />
        <h1>Conteúdo não encontrado</h1>
        <Footer />
      </>
    );
  }

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

// =======================
// SSR com Firebase Admin
// =======================
export async function getServerSideProps({ params }) {
  const { id } = params;

  try {
    let collectionType = "posts";
    let snap = await adminDb.collection("posts").doc(id).get();

    if (!snap.exists) {
      snap = await adminDb.collection("guide").doc(id).get();
      if (!snap.exists) {
        return { props: { post: null, relatedPosts: [], collectionType: null } };
      }
      collectionType = "guide";
    }

    const post = serializePost({ id: snap.id, ...snap.data() });

    // Relacionados
    const relatedSnap = await adminDb
      .collection(collectionType)
      .orderBy("date", "desc")
      .limit(6)
      .get();

    const relatedPosts = relatedSnap.docs
      .map((d) => serializePost({ id: d.id, ...d.data() }))
      .filter((p) => p.id !== id)
      .slice(0, 3);

    return {
      props: {
        post,
        relatedPosts,
        collectionType,
      },
    };
  } catch (err) {
    console.error("Erro ao carregar artigo:", err);
    return { props: { post: null, relatedPosts: [], collectionType: null } };
  }
}

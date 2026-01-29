
import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import {
  getFirestore,
  doc,
  updateDoc,
  Timestamp,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export default function ArticleContent({ content, collectionType }) {
  /* ===========================
     ESTADOS BÁSICOS
  ============================ */
  const [mounted, setMounted] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({});

  /* ===========================
     FIRESTORE ESTÁVEL
  ============================ */
  const db = useMemo(() => getFirestore(), []);
  const collectionName = collectionType === "guide" ? "guide" : "posts";

  /* ===========================
     NORMALIZAÇÕES (SSR SAFE)
  ============================ */
  const safeTitle = typeof content?.title === "string" ? content.title : "Artigo";
  const safeAuthor =
    typeof content?.author === "string" ? content.author : "Henrique Santos";

  const safeHtml =
    typeof content?.content === "string" ? content.content : "";

  const description = safeHtml
    ? safeHtml.replace(/<[^>]+>/g, "").slice(0, 160)
    : "";

  const formattedDate =
    typeof content?.date === "string"
      ? new Date(content.date).toLocaleDateString("pt-BR")
      : "Sem data definida";

  /* ===========================
     MARCA MOUNT (ANTI #418)
  ============================ */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ===========================
     FIRESTORE (CLIENT ONLY)
  ============================ */
  useEffect(() => {
    if (!mounted) return;
    if (!content?.id || typeof content.id !== "string") return;

    const docRef = doc(db, collectionName, content.id);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.data();

      const serializedComments = data.comments
        ? Object.fromEntries(
            Object.entries(data.comments).map(([id, c]) => [
              id,
              {
                comment: typeof c.comment === "string" ? c.comment : "",
                createdAt: c.createdAt || null,
              },
            ])
          )
        : {};

      setComments(serializedComments);
    });

    return () => unsubscribe();
  }, [mounted, db, collectionName, content?.id]);

  const commentsArray = Object.values(comments);

  /* ===========================
     ENVIO DE COMENTÁRIO
  ============================ */
  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !content?.id) return;

    const commentId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const newCommentObj = {
      comment: newComment.trim(),
      createdAt: serverTimestamp(),
    };

    setNewComment("");

    try {
      const docRef = doc(db, collectionName, content.id);
      await updateDoc(docRef, {
        [`comments.${commentId}`]: newCommentObj,
      });
    } catch (err) {
      console.error("Erro ao enviar comentário:", err);
    }
  };

  /* ===========================
     JSON-LD (CLIENT ONLY)
  ============================ */
  const jsonLd =
    mounted && content?.id
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: safeTitle,
          image: content?.image ? [content.image] : [],
          datePublished: content?.date || "",
          dateModified: content?.updatedAt || content?.date || "",
          author: {
            "@type": "Person",
            name: safeAuthor,
          },
          publisher: {
            "@type": "Organization",
            name: "F1 Dash",
            logo: {
              "@type": "ImageObject",
              url: "https://www.blog-f1-dashboard.com/logo.png",
            },
          },
          description,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://www.blog-f1-dashboard.com/artigo/${content.id}`,
          },
        }
      : null;

  /* ===========================
     RENDER
  ============================ */
  return (
    <div>
      <Head>
        <title>{safeTitle} | F1™ Dash</title>

        <link
          rel="canonical"
          href={`https://www.blog-f1-dashboard.com/artigo/${content?.id || ""}`}
        />

        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content={safeTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={content?.image || ""} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="pt_BR" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={safeTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={content?.image || ""} />

        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd),
            }}
          />
        )}
      </Head>

      {content?.image && (
        <img
          src={content.image}
          alt={safeTitle}
          className="article-banner"
        />
      )}

      <div className="article-header">
        <h1>{safeTitle}</h1>
        <p className="article-meta">
          Publicado em <span>{formattedDate}</span> • Por{" "}
          <span>{safeAuthor}</span>
        </p>

        <div className="article-tags">
          {Array.isArray(content?.tags) &&
            content.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
        </div>
      </div>

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />

      <div className="article-comments" style={{ marginTop: "2rem" }}>
        <h2>Deixe sua opinião anônima para todos!</h2>

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escreva seu comentário..."
          rows={4}
          style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
        />

        <button
          className="buttonMore"
          style={{ marginTop: "0.5rem" }}
          onClick={handleCommentSubmit}
        >
          Enviar
        </button>

        <div className="comments-list" style={{ marginTop: "1rem" }}>
          {commentsArray.length === 0 && <p>Nenhum comentário ainda.</p>}

          {commentsArray.map((c, i) => {
            let createdDate = null;

            if (c.createdAt) {
              createdDate =
                c.createdAt instanceof Timestamp
                  ? c.createdAt.toDate()
                  : new Date(c.createdAt);
            }

            return (
              <div
                key={i}
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: "0.5rem 0",
                }}
              >
                <ReactMarkdown>{c.comment}</ReactMarkdown>

                {createdDate && (
                  <small style={{ color: "#555", fontSize: "0.8rem" }}>
                    {createdDate.toLocaleString("pt-BR")}
                  </small>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

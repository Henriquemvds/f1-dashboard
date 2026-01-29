"use client"; // Necessário para hooks no Next 13+

import { useState, useEffect } from "react";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import {
  getFirestore,
  doc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";

export default function ArticleContent({ content, collectionType }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({});

  const db = getFirestore();

  const collectionName = collectionType === "guide" ? "guide" : "posts";

  // Garantindo string ISO para a data
  const formattedDate = content?.date
    ? new Date(content.date).toLocaleDateString("pt-BR")
    : "Sem data definida";

  // Atualiza comentários em tempo real
  useEffect(() => {
    if (!content?.id) return;

    const docRef = doc(db, collectionName, content.id);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();

        // Serializa comentários para evitar erros de deploy
        const serializedComments = data.comments
          ? Object.fromEntries(
            Object.entries(data.comments).map(([id, comment]) => [
              id,
              {
                comment: comment.comment || "",
                createdAt: comment.createdAt?.toDate
                  ? comment.createdAt.toDate().toISOString()
                  : comment.createdAt || null,
              },
            ])
          )
          : {};

        setComments(serializedComments);
      }
    });

    return () => unsubscribe();
  }, [db, collectionName, content?.id]);

  const commentsArray = Object.values(comments);

  // Envia comentário para o Firestore
  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !content?.id) return;

    const commentId = crypto.randomUUID();
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
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
    }
  };

  return (
    <div>
      <Head>
        <title>{content?.title || "Artigo"} | F1™ Dash</title>
        <link
          rel="canonical"
          href={`https://www.blog-f1-dashboard.com/artigo/${content?.id || ""}`}
        />
        <meta name="description" content={content?.content || ""} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content={content?.title || ""} />
        <meta property="og:description" content={content?.content || ""} />
        <meta property="og:image" content={content?.image || ""} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="pt_BR" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content?.title || ""} />
        <meta name="twitter:description" content={content?.content || ""} />
        <meta name="twitter:image" content={content?.image || ""} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: content?.title || "",
              image: [content?.image || ""],
              datePublished: content?.date || new Date().toISOString(),
              dateModified: content?.updatedAt || content?.date || new Date().toISOString(),
              author: { "@type": "Person", name: content?.author || "Henrique Santos" },
              publisher: {
                "@type": "Organization",
                name: "F1 Dash",
                logo: { "@type": "ImageObject", url: "https://www.blog-f1-dashboard.com/logo.png" },
              },
              description: content?.content || "",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://www.blog-f1-dashboard.com/artigo/${content?.id || ""}`,
              },
            }),
          }}
        />
      </Head>

      {/* Banner */}
      {content?.image && (
        <img src={content.image} className="article-banner" alt={content.title} />
      )}

      {/* Cabeçalho */}
      <div className="article-header">
        <h1>{content?.title || "Sem título"}</h1>
        <p className="article-meta">
          Publicado em <span>{formattedDate}</span> • Por{" "}
          <span>{content?.author || "Henrique Santos"}</span>
        </p>
        <div className="article-tags">
          {Array.isArray(content?.tags)
            ? content.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))
            : null}
        </div>
      </div>

      {/* Conteúdo */}
      <div
        className="article-content"
        dangerouslySetInnerHTML={{
          __html: typeof content.content === "string" ? content.content : "<p>Sem conteúdo</p>",
        }}
      />

      {/* Comentários */}
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

          {commentsArray.map((c, i) => (
            <div key={i} style={{ borderBottom: "1px solid #ddd", padding: "0.5rem 0" }}>
              <ReactMarkdown>{c.comment || ""}</ReactMarkdown>
              {c.createdAt && (
                <small style={{ color: "#555", fontSize: "0.8rem" }}>
                  {new Date(c.createdAt).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

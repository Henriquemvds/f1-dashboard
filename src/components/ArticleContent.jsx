import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import ReactMarkdown from "react-markdown";
import { getFirestore, doc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";

export default function ArticleContent({ content, collectionType }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({});

  const db = getFirestore();

  // Garantir que collectionType seja 'posts' ou 'guide'
  const collectionName = collectionType === "guide" ? "guide" : "posts";

  const formattedDate =
    content.date && content.date.toDate
      ? content.date.toDate().toLocaleDateString("pt-BR")
      : "Sem data definida";

  // Atualiza os comentários em tempo real
  useEffect(() => {
    if (!content.id) return;

    const docRef = doc(db, collectionName, content.id);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setComments(data.comments ? { ...data.comments } : {});
      }
    });

    return () => unsubscribe();
  }, [db, collectionName, content.id]);

  const commentsArray = Object.values(comments);

  // Envia comentário para o Firestore
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    if (!content.id) {
      console.error("Erro: content.id não definido");
      return;
    }

    const commentId = crypto.randomUUID();
    const newCommentObj = {
      comment: newComment.trim(),
      createdAt: serverTimestamp(),
    };

    setNewComment(""); // limpa textarea

    try {
      const docRef = doc(db, collectionName, content.id);
      await updateDoc(docRef, {
        [`comments.${commentId}`]: newCommentObj,
      });
      console.log("Comentário enviado!");
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
    }
  };
  return (
    <div>
      {/* Meta Tags e JSON-LD */}
      <Helmet>

        <link
          rel="canonical"
          href={`https://www.blog-f1-dashboard.com/artigo/${content.id}`}
        />
        <title>{content.title} | F1™ Dash</title>
        <meta
          name="description"
          content={content.description || "Meu blog sobre as corridas da Fórmula 1™."}
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={content.title} />
        <meta property="og:description" content={content.description || ""} />
        <meta property="og:image" content={content.image} />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* Conteúdo do artigo */}
      {content.image && (
        <img src={content.image} className="article-banner" alt={content.title} />
      )}

      <div className="article-header">
        <h1>{content.title}</h1>
        <p className="article-meta">
          Publicado em <span>{formattedDate}</span> • Por{" "}
          <span>{content.author || "Henrique Santos"}</span>
        </p>
        <div className="article-tags">
          {content.tags?.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: content.content }}
      />

      {/* Seção de Comentários */}
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
            <div
              key={i}
              style={{ borderBottom: "1px solid #ddd", padding: "0.5rem 0" }}
            >
              <ReactMarkdown>{c.comment}</ReactMarkdown>
              {c.createdAt && (
                <small style={{ color: "#555", fontSize: "0.8rem" }}>
                  {c.createdAt.toDate
                    ? c.createdAt.toDate().toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : new Date(c.createdAt.seconds * 1000).toLocaleString("pt-BR", {
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

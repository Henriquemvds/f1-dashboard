"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { getFirestore, doc, updateDoc, serverTimestamp, onSnapshot, Timestamp } from "firebase/firestore";
import Head from "next/head";

type Comment = {
  comment: string;
  createdAt: Timestamp | { seconds: number } | Date; // Pode ser Timestamp ou Date
};

export interface Content {
  id: string;
  title: string;
  banner: string;
  image: string;
  description: string;
  author: string;
  content: string;
  tags: string[];
  date: Timestamp | Date | null;
}

type ArticleContentProps = {
  content: Content;
  collectionType: "posts" | "guide";
};

// === Type Guards ===
function isTimestamp(obj: any): obj is Timestamp {
  return obj && typeof obj.toDate === "function";
}

function isDate(obj: any): obj is Date {
  return obj instanceof Date;
}

function isSecondsObject(obj: any): obj is { seconds: number } {
  return obj && typeof obj.seconds === "number";
}

export default function ArticleContent({ content, collectionType }: ArticleContentProps) {
  // Se content ainda não existe, podemos mostrar um loading ou nada
  if (!content) {
    return <p>Carregando artigo...</p>;
  }

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Record<string, Comment>>({});

  const db = getFirestore();
  const collectionName = collectionType === "guide" ? "guide" : "posts";

  // === Formata a data do artigo ===
  const formattedDate = content.date
    ? isTimestamp(content.date)
      ? content.date.toDate().toLocaleDateString("pt-BR")
      : isDate(content.date)
        ? content.date.toLocaleDateString("pt-BR")
        : isSecondsObject(content.date)
          ? new Date(content.date * 1000).toLocaleDateString("pt-BR")
          : "Sem data definida"
    : "Sem data definida";

  // === Atualiza comentários em tempo real ===
  useEffect(() => {
    if (!content.id) return;

    const docRef = doc(db, collectionName, content.id);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as { comments?: Record<string, Comment> };
        setComments(data.comments ? { ...data.comments } : {});
      }
    });

    return () => unsubscribe();
  }, [db, collectionName, content.id]);

  const commentsArray = Object.values(comments);

  // === Envio de novo comentário ===
  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !content.id) return;

    const commentId = crypto.randomUUID();
    const newCommentObj: Comment = {
      comment: newComment.trim(),
      createdAt: serverTimestamp() as Timestamp,
    };

    setNewComment("");

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

  // === Formata createdAt de comentários ===
 // === Formata createdAt de comentários ===
function formatCreatedAt(createdAt: Comment["createdAt"]) {
  if (!createdAt) return "";

  // Type guard para Timestamp do Firestore
  if ((createdAt as Timestamp).toDate !== undefined && typeof (createdAt as Timestamp).toDate === "function") {
    return (createdAt as Timestamp).toDate().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Type guard para objeto {seconds: number}
  if ((createdAt as { seconds: number }).seconds !== undefined) {
    return new Date((createdAt as { seconds: number }).seconds * 1000).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Type guard para Date
  if (createdAt instanceof Date) {
    return createdAt.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return "";
}
  return (
    <div>
      <Head>
        <title>{content.title} | F1™ Dash</title>
        <meta name="description" content={content.description || "Meu blog sobre as corridas da Fórmula 1™."} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={content.title} />
        <meta property="og:description" content={content.description || ""} />
        <meta property="og:image" content={content.image} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://www.blog-f1-dashboard.com/artigo/${content.id}`} />
      </Head>

      {content.image && <img src={content.image} className="article-banner" alt={content.title} />}

      <div className="article-header">
        <h1>{content.title}</h1>
        <p className="article-meta">
          Publicado em <span>{formattedDate}</span> • Por <span>{content.author || "Henrique Santos"}</span>
        </p>
        <div className="article-tags">
          {content.tags?.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="article-content" dangerouslySetInnerHTML={{ __html: content.content }} />

      <div className="article-comments" style={{ marginTop: "2rem" }}>
        <h2>Deixe sua opinião anônima para todos!</h2>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escreva seu comentário..."
          rows={4}
          style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
        />
        <button className="buttonMore" style={{ marginTop: "0.5rem" }} onClick={handleCommentSubmit}>
          Enviar
        </button>

        <div className="comments-list" style={{ marginTop: "1rem" }}>
          {commentsArray.length === 0 && <p>Nenhum comentário ainda.</p>}
          {commentsArray.map((c, i) => (
            <div key={i} style={{ borderBottom: "1px solid #ddd", padding: "0.5rem 0" }}>
              <ReactMarkdown>{c.comment}</ReactMarkdown>
              {c.createdAt && (
                <small style={{ color: "#555", fontSize: "0.8rem" }}>
                  {formatCreatedAt(c.createdAt)}
                </small>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

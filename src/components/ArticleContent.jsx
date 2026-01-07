import React, { useState } from "react";
import { Helmet } from "react-helmet";
import ReactMarkdown from "react-markdown";

export default function ArticleContent({ content }) {
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);

  const formattedDate =
    content.date && content.date.toDate
      ? content.date.toDate().toLocaleDateString("pt-BR")
      : "Sem data definida";

  const handleCommentSubmit = () => {
    if (comment.trim() === "") return;
    setCommentsList([...commentsList, comment]);
    setComment("");
  };

  return (
    <div>
      {/* Meta Tags e JSON-LD */}
      <Helmet>
        <title>{content.title} | F1 Dashboard </title>
        <meta
          name="description"
          content={content.description || "Meu blog sobre Fórmula 1™."}
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content={content.title} />
        <meta property="og:description" content={content.description || ""} />
        <meta property="og:image" content={content.image} />
        <meta property="og:type" content="article" />

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: content.title,
            author: { "@type": "Person", name: content.author || "Henrique Santos" },
            datePublished:
              content.date && content.date.toDate
                ? content.date.toDate().toISOString()
                : new Date().toISOString(),
            image: content.image,
          })}
        </script>
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
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escreva seu comentário... (em desenvolvimento)"
          rows={4}
          style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
        />

        <button
          onClick={handleCommentSubmit}
          className="buttonMore">
          Enviar
        </button>

        <div className="comments-list" style={{ marginTop: "1rem" }}>
          {commentsList.map((c, i) => (
            <div key={i} style={{ borderBottom: "1px solid #ddd", padding: "0.5rem 0" }}>
              <ReactMarkdown>{c}</ReactMarkdown>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Helmet } from "react-helmet";

export default function ArticleContent({ content }) {
  const formattedDate =
    content.date && content.date.toDate
      ? content.date.toDate().toLocaleDateString("pt-BR")
      : "Sem data definida";

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
    </div>
  );
}

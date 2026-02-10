import React from "react";

export default function ArticleCard({ post, horizontal = false }) {
  return (
    <div className={`card ${horizontal ? "card-horizontal" : ""}`}>
      <img src={post.banner} alt={post.title} />

      <div className={horizontal ? "card-content" : ""}>
        <h3>{post.title}</h3>
        <p>{post.subtitle}</p>

        {post.tags?.length > 0 && (
          <div className="article-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="article-meta">
          Publicado em{" "}
          <span>
            {post.date
              ? new Date(post.date).toLocaleDateString("pt-BR")
              : "Sem data definida"}
          </span>{" "}
          • Por <span>{post.author || "Henrique Santos"}</span>
        </p>

        <button className="buttonMore">Leia mais</button>
      </div>
    </div>
  );
}

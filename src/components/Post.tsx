import React from "react";

export type Post = {
  banner?: string;
  title?: string; // agora opcional
  subtitle?: string;
  tags?: string[];
  date?: {
    toDate?: () => Date;
  };
  author?: string;
};

type ArticleCardProps = {
  post: Post;
};

export default function ArticleCard({ post }: ArticleCardProps) {
  const formattedDate =
    post.date && post.date.toDate
      ? post.date.toDate().toLocaleDateString("pt-BR")
      : "Sem data definida";

  return (
    <div className="card">
      {post.banner && <img src={post.banner} alt={post.title || "Sem título"} />}
      <h3>{post.title || "Sem título"}</h3>
      {post.subtitle && <p>{post.subtitle}</p>}

      {post.tags && post.tags.length > 0 && (
        <div className="article-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="article-meta">
        Publicado em <span>{formattedDate}</span> • Por{" "}
        <span>{post.author || "Henrique Santos"}</span>
      </p>

      <button className="buttonMore">Leia mais</button>
    </div>
  );
}

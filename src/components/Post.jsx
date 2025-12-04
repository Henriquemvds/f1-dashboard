import React from "react";


export default function ArticleCard({ post }) {
    return (
        <div className="card">
            <img src={post.banner} alt={post.title} />
            <h3>{post.title}</h3>
            <p>{post.subtitle}</p>


            <div className="article-tags">
                {post.tags?.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
            </div>


            <p className="article-meta">
                Publicado em{" "}
                <span>
                    {post.date && post.date.toDate
                        ? post.date.toDate().toLocaleDateString("pt-BR")
                        : "Sem data definida"}
                </span>{" "}
                • Por <span>{post.author || "Henrique Santos"}</span>
            </p>


            <button className="buttonMore">Leia mais</button>
        </div>
    );
}
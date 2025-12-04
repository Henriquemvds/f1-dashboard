import React from "react";


export default function ArticleContent({ content }) {
    return (

        <div>

            <img src={content.image} className="article-banner" alt={content.title} />

            <div className="article-header">
                <h1>{content.title}</h1>

                <p className="article-meta">
                    Publicado em{" "}
                    <span>
                        {content.date && content.date.toDate
                            ? content.date.toDate().toLocaleDateString("pt-BR")
                            : "Sem data definida"}
                    </span>{" "}
                    • Por <span>{content.author || "Henrique Santos"}</span>
                </p>

                <div className="article-tags">
                    {content.tags?.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
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
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArticleCard from "../components/Post";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { getPageNumbers } from "../data/Pagination";
import "../styles/Guide.css";

export default function Guide() {

      const [posts, setPosts] = useState([]);
       const [filtered, setFiltered] = useState([]);
      const [loading, setLoading] = useState(true);
    
      const [currentPage, setCurrentPage] = useState(() => {
        const saved = localStorage.getItem("lastPage");
        return saved ? Number(saved) : 1;
      });
    
      const postsPerPage = 15;
    
      useEffect(() => {
        async function loadPosts() {
          const ref = collection(db, "guide");
          const snapshot = await getDocs(ref);
    
          const loaded = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
    
          setPosts(loaded);
          setFiltered(loaded);
          setLoading(false);
        }
        loadPosts();
  
      }, []); // <-- sem dependências
    
    
      const indexLast = currentPage * postsPerPage;
      const indexFirst = indexLast - postsPerPage;
      const currentPosts = filtered.slice(indexFirst, indexLast);
    
      const totalPages = Math.ceil(filtered.length / postsPerPage);
    
    
      useEffect(() => {
        localStorage.setItem("lastPage", currentPage);
      }, [currentPage]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="home-container">

                <section className="hero">
                    <div className="hero-content">
                        <h1>Guia Para Iniciantes</h1>
                        <p>Aprenda sobre detalhes técnicos, regulamentos e mecânica da Formula 1™.</p>
                    </div>
                </section>

                <section className="blog-grid">
                    <h2>Últimos Artigos</h2>

                    {loading && <p>Carregando artigos...</p>}

                    {!loading && currentPosts.length === 0 && (
                        <p>Nenhum artigo encontrado.</p>
                    )}

                    {!loading &&
                        currentPosts.map(post => (
                            <NavLink to={`/article/${post.id}`} key={post.id}
                                onClick={() => localStorage.setItem("lastPage", currentPage)}>
                                <ArticleCard post={post} />
                            </NavLink>
                        ))}

                    <div className="pagination">

                        {getPageNumbers(currentPage, totalPages).map((num, index) => {

                            if (num === "first") {
                                return (
                                    <button key={index} onClick={() => setCurrentPage(1)}>
                                        Primeira
                                    </button>
                                );
                            }

                            if (num === "last") {
                                return (
                                    <button key={index} onClick={() => setCurrentPage(totalPages)}>
                                        Última
                                    </button>
                                );
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(num)}
                                    className={currentPage === num ? "active" : ""}
                                >
                                    {num}
                                </button>
                            );
                        })}

                    </div>

                </section>
            </div>

            <Footer />
        </div>
    );
}

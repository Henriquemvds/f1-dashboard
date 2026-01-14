import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArticleCard from "../components/Post";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Pagination from "../components/Pagination.jsx";
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
            const q = query(ref, orderBy("date", "desc"));
            const snapshot = await getDocs(q);

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
            <Helmet>
                <link
                    rel="canonical"
                    href="https://www.blog-f1-dashboard.com/guia"
                />
            </Helmet>
            <Navbar />
            <div className="home-container">

                <section className="hero">
                    <div className="hero-content">
                        <h1>Guia Para Iniciantes</h1>
                        <p>Aprenda sobre detalhes técnicos, regulamentos e mecânica das corridas da Fórmula 1™.</p>
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
                            <NavLink to={`/artigo/${post.id}`} key={post.id}
                                onClick={() => localStorage.setItem("lastPage", currentPage)}>
                                <ArticleCard post={post} />
                            </NavLink>
                        ))}


                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                    />

                </section>
            </div>

            <Footer />
        </div>
    );
}

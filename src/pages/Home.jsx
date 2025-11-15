import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { posts } from "../data/posts";
import { NavLink } from "react-router-dom";
import "../styles/Home.css";


export default function Home() {
  return (
    <div>
      <Navbar />

      <div class="home-container">


        <section class="hero">
          <div class="hero-content">
            <h1>Bem-vindo ao Universo da Velocidade</h1>
            <p>Descubra tecnologia, curiosidades e tudo que move o mundo da Fórmula 1.</p>
          </div>
        </section>


        <section className="blog-grid">
          <h2>Últimos Artigos</h2>

          {posts.map(post => (
            <div className="card" key={post.id}>
              <img src={post.image} />
              <h3>{post.title}</h3>
              <p>{post.resume}</p>

              <NavLink to={`/article/${post.id}`} className="buttonMore">
             
                  Leia mais
                
              </NavLink>
            </div>
          ))}
        </section>


        <section class="specials">
          <h2>Destaques</h2>

          <div class="special-card">
            <img src="https://images.unsplash.com/photo-1521540216272-a50305cd4421" />
            <div>
              <h3>Aerodinâmica e Downforce</h3>
              <p>O segredo por trás da velocidade absurda nos circuitos.</p>
            </div>
          </div>

          <div class="special-card">
            <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205" />
            <div>
              <h3>O ambiente do paddock</h3>
              <p>Um mundo exclusivo e cheio de detalhes curiosos.</p>
            </div>
          </div>

          <div class="special-card">
            <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" />
            <div>
              <h3>Telemetria e Estratégia</h3>
              <p>A ciência por trás de cada decisão na pista.</p>
            </div>
          </div>

        </section>

      </div>
      <Footer />
    </div>
  );
}
import Navbar from "../components/Navbar";
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

   
        <section class="blog-grid">
          <h2>Últimos Artigos</h2>

          <div class="card">
            <img src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d" />
            <h3>A evolução dos carros ao longo das décadas</h3>
            <p>Descubra como o design aerodinâmico mudou o rumo da categoria.</p>
            <button>Leia mais</button>
          </div>

          <div class="card">
            <img src="https://images.unsplash.com/photo-1525609004556-c46c7d6cf023" />
            <h3>Por dentro da aerodinâmica moderna</h3>
            <p>Entenda os detalhes que fazem um carro voar baixo nas pistas.</p>
            <button>Leia mais</button>
          </div>

          <div class="card">
            <img src="https://images.unsplash.com/photo-1504609813442-a8924e83f76e" />
            <h3>Os bastidores de um final de semana da F1</h3>
            <p>Telemetria, estratégia, pneus e muito mais.</p>
            <button>Leia mais</button>
          </div>
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
    </div>
  );
}
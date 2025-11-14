import "../styles/About.css";
import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div>
      <Navbar />
      <div className="about-container">
        <div className="about-content">

          <h1 className="about-title">Sobre o Projeto</h1>

          <p className="about-text">
            Este projeto foi desenvolvido com o objetivo de criar uma plataforma
            moderna, rápida e visualmente envolvente dedicada aos fãs da Fórmula 1.
            Ele apresenta dados públicos acessíveis sobre pilotos, equipes e
            corridas, organizados em uma interface clara e responsiva.
          </p>

          <p className="about-text">
            Toda a interface e identidade visual foram projetadas manualmente,
            sem uso de elementos oficiais da Fórmula 1, garantindo total
            originalidade e respeito aos direitos autorais e marcas registradas.
          </p>

          <h2 className="about-subtitle">Tecnologias Utilizadas</h2>

          <ul className="about-list">
            <li>React + React Router</li>
            <li>Fetch / Axios para obter dados da API</li>
            <li>CSS modular com design responsivo</li>
            <li>Manipulação avançada de dados e componentes dinâmicos</li>
          </ul>

          <h2 className="about-subtitle">Objetivo do Dashboard</h2>

          <p className="about-text">
            A ideia central é fornecer uma experiência visual simples e intuitiva,
            permitindo que qualquer pessoa explore métricas, dados e estatísticas
            da temporada sem complexidade. O foco principal é aprendizado,
            apresentação de dados e desenvolvimento de habilidades front-end.
          </p>

          <h2 className="about-subtitle">Origem dos Dados</h2>

          <p className="about-text">
            Todas as informações vêm de APIs públicas e gratuitas. Nenhum conteúdo
            proprietário, logotipo oficial ou material protegido é utilizado.
            Os dados são interpretados e exibidos de forma independente pelo
            próprio código do projeto.
          </p>

          <div className="about-footer">
            <p>Desenvolvido com paixão por velocidade, tecnologia e design.</p>
          </div>

        </div>
      </div>
    </div>
  );
}

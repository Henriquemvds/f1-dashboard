import Head from "next/head";
import Link from "next/link";

export default function FaqF1() {
  return (
    <div>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Quando é a próxima corrida da Fórmula 1™?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "O calendário oficial da Fórmula 1™ é divulgado pela FIA antes do início da temporada. As corridas geralmente acontecem aos domingos."
                }
              },
              {
                "@type": "Question",
                "name": "Como funciona a pontuação na Fórmula 1™?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "O vencedor recebe 25 pontos, o segundo 18, o terceiro 15, até o décimo colocado que recebe 1 ponto. Há ponto extra para a volta mais rápida entre os dez primeiros."
                }
              },
              {
                "@type": "Question",
                "name": "Como funciona a classificação na Fórmula 1™?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A classificação é dividida em Q1, Q2 e Q3. Os pilotos mais lentos são eliminados nas duas primeiras fases e os 10 mais rápidos disputam a pole position."
                }
              },
                 {
                "@type": "Question",
                "name": "Como faço para tirar mais dúvidas sobre a Fórmula 1™?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Clique aqui que será direcionado para o Guia para Iniciantes"
                }
              }
            ]
          })}
        </script>

      </Head>
      <section className="faq-f1">
        <h2>Perguntas Frequentes rápidas sobre Fórmula 1™</h2>

        <div className="faq-item">
          <h3>Quando é a próxima corrida da Fórmula 1™?</h3>
          <p>
            O calendário oficial da Fórmula 1™ é divulgado pela FIA antes do início
            da temporada. As corridas geralmente acontecem aos domingos,
            com sessões de treino na sexta-feira e classificação no sábado.
          </p>
        </div>

        <div className="faq-item">
          <h3>Como funciona a pontuação na Fórmula 1™?</h3>
          <p>
            Os pontos são distribuídos do 1º ao 10º colocado. O vencedor recebe
            25 pontos, o segundo 18, o terceiro 15, seguindo até 1 ponto para o
            10º colocado. Há ponto extra para a volta mais rápida, se o piloto
            terminar entre os dez primeiros.
          </p>
        </div>

        <div className="faq-item">
          <h3>Quem lidera o campeonato de pilotos?</h3>
          <p>
            A liderança do campeonato é determinada pela soma de pontos
            conquistados ao longo da temporada. A classificação é atualizada
            após cada Grande Prêmio.
          </p>
        </div>

        <div className="faq-item">
          <h3>Como funciona a classificação (qualifying) na Fórmula 1™?</h3>
          <p>
            O qualifying é dividido em três fases: Q1, Q2 e Q3. Os pilotos mais
            lentos são eliminados nas duas primeiras fases, e os 10 mais rápidos
            disputam a pole position no Q3.
          </p>
        </div>
          <div className="faq-item">
          <h3>Como faço para tirar mais dúvidas sobre a Fórmula 1™?</h3>
          <p>
            <Link href={`/guia`}>Clique aqui que será direcionado para o "Guia para Iniciantes".</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

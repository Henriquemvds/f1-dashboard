// src/pages/piloto/[id].tsx
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../../../Firebase"; // ajuste do path
import Loading from "../../components/Loading";

interface Pilot {
  driver_number: string;
  full_name: string;
  team_name: string;
  country?: string;
  birthdate?: Timestamp | null;
  birthplace?: string;
  height?: string;
  weight?: string;
  championships?: number;
  biography?: string;
  portrait_image?: string;
  "social-instagram"?: string;
  "social-twitter"?: string;
  "social-website"?: string;
}

export default function BioDriver() {
  const router = useRouter();
  const { id } = router.query;

  const pilotId = typeof id === "string" ? id : null;

  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Função para buscar piloto no Firestore
  async function fetchPilot(docId: string): Promise<Pilot | null> {
    try {
      const ref = doc(db, "pilots", docId);
      const snap = await getDoc(ref);
      return snap.exists() ? (snap.data() as Pilot) : null;
    } catch (err) {
      console.error("Erro ao buscar piloto:", err);
      return null;
    }
  }

  useEffect(() => {
    if (!pilotId) return;

    async function load() {
      setLoading(true);
      const data = await fetchPilot(pilotId);
      setPilot(data);
      setLoading(false);
    }

    load();
  }, [pilotId]);

  if (loading) return <Loading />;
  if (!pilot)
    return (
      <div className="p-6 min-h-screen flex justify-center items-center text-xl">
        Piloto não encontrado.
      </div>
    );

  // 🔹 Converte Timestamp para data legível
  const birthDate =
    pilot.birthdate instanceof Timestamp
      ? pilot.birthdate.toDate().toLocaleDateString("pt-BR")
      : "-";

  const pageTitle = `${pilot.full_name} | ${pilot.team_name}`;
  const pageDescription = `Conheça a biografia, carreira e estatísticas de ${pilot.full_name}, piloto da equipe ${pilot.team_name}.`;

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://www.blog-f1-dashboard.com/piloto" />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pilot.portrait_image || ""} />
        <meta property="og:type" content="profile" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pilot.portrait_image || ""} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: pilot.full_name,
              nationality: pilot.country,
              birthDate,
              birthPlace: pilot.birthplace,
              height: pilot.height,
              weight: pilot.weight,
              image: pilot.portrait_image,
              affiliation: { "@type": "SportsTeam", name: pilot.team_name },
              sameAs: [
                pilot["social-instagram"],
                pilot["social-twitter"],
                pilot["social-website"],
              ].filter(Boolean),
            }),
          }}
        />
      </Head>

      <Navbar />

      <div className="details-pilot pilot-card">
        {/* FOTO */}
        <div className="portrait">
          <img src={pilot.portrait_image} alt={`Retrato de ${pilot.full_name}`} />
        </div>

        {/* INFORMAÇÕES */}
        <div>
          <div className="header">
            <div className="full-name">{pilot.full_name}</div>
            <div className="team-name">{pilot.team_name}</div>

            <div className="meta-row">
              <div className="meta-item">
                <strong>Número:</strong> {pilot.driver_number}
              </div>

              <div className="meta-item">
                <strong>País:</strong> {pilot.country}
              </div>

              <div className="meta-item">
                <strong>Nasc.:</strong> {birthDate}
              </div>

              <div className="meta-item">
                <strong>Natural de:</strong> {pilot.birthplace}
              </div>
            </div>
          </div>

          {/* BIO */}
          <div className="section">
            <h3>Biografia</h3>
            <p>{pilot.biography}</p>
          </div>

          {/* CARREIRA */}
          <div className="section">
            <h3>Carreira</h3>

            <div className="grid-stats">
              <div className="stat">
                <div className="value">{pilot.championships}</div>
                <div className="label">Mundiais</div>
              </div>

              <div className="stat">
                <div className="value">{pilot.height}</div>
                <div className="label">Altura</div>
              </div>

              <div className="stat">
                <div className="value">{pilot.weight}</div>
                <div className="label">Peso</div>
              </div>
            </div>
          </div>

          {/* REDES SOCIAIS */}
          <div className="section">
            <h3>Redes Sociais</h3>

            <div className="socials">
              {pilot["social-instagram"] && (
                <a
                  href={pilot["social-instagram"]}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              )}

              {pilot["social-twitter"] && (
                <a href={pilot["social-twitter"]} target="_blank" rel="noreferrer">
                  Twitter
                </a>
              )}

              {pilot["social-website"] && (
                <a href={pilot["social-website"]} target="_blank" rel="noreferrer">
                  Site Oficial
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

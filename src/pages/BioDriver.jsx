import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet";
import "../styles/BioDriver.css";

export default function BioDriver() {
  const { id } = useParams();
  const [pilot, setPilot] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchPilot(docId) {
    try {
      const ref = doc(db, "pilots", docId);
      const snap = await getDoc(ref);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      console.error("Erro ao buscar piloto:", err);
      return null;
    }
  }

  useEffect(() => {
    async function load() {
      const data = await fetchPilot(id);
      setPilot(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <Loading />;

  if (!pilot)
    return (
      <div className="p-6 min-h-screen flex justify-center items-center text-xl">
        Piloto não encontrado.
      </div>
    );

  const birthDate =
    pilot.birthdate?.toDate
      ? pilot.birthdate.toDate().toISOString().split("T")[0]
      : null;

  const pageTitle = `${pilot.full_name} | ${pilot.team_name}`;
  const pageDescription = `Conheça a biografia, carreira e estatísticas de ${pilot.full_name}, piloto da equipe ${pilot.team_name}.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: pilot.full_name,
    nationality: pilot.country,
    birthDate: birthDate,
    birthPlace: pilot.birthplace,
    height: pilot.height,
    weight: pilot.weight,
    image: pilot.portrait_image,
    affiliation: {
      "@type": "SportsTeam",
      name: pilot.team_name,
    },
    sameAs: [
      pilot["social-instagram"],
      pilot["social-twitter"],
      pilot["social-website"],
    ].filter(Boolean),
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Helmet>

        <link
          rel="canonical"
          href="https://www.blog-f1-dashboard.com/piloto"
        />

        {/* SEO básico */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pilot.portrait_image} />
        <meta property="og:type" content="profile" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pilot.portrait_image} />

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <Navbar />

      <div className="details-pilot pilot-card">
        {/* FOTO */}
        <div className="portrait">
          <img
            src={pilot.portrait_image}
            alt={`Retrato de ${pilot.full_name}`}
          />
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
                <strong>Nasc.:</strong>{" "}
                {pilot.birthdate?.toDate
                  ? pilot.birthdate.toDate().toLocaleDateString("pt-BR")
                  : pilot.birthdate}
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
                <a href={pilot["social-instagram"]} target="_blank" rel="noreferrer">
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

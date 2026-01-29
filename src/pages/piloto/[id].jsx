import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Head from "next/head";

// ====================
// Página
// ====================
export default function BioDriver({ pilot }) {
  if (!pilot) {
    return (
      <div className="p-6 min-h-screen flex justify-center items-center text-xl">
        Piloto não encontrado.
      </div>
    );
  }

  // Normaliza data no UTC para evitar mismatch
  const formattedBirthDate = pilot.birthdate
    ? new Date(pilot.birthdate).toLocaleDateString("pt-BR", { timeZone: "UTC" })
    : "";

  const seoDescription =
    pilot.biography ||
    `Biografia e carreira do piloto ${pilot.full_name} da equipe ${pilot.team_name} na Fórmula 1™.`;

  const pageTitle = `${pilot.full_name} | ${pilot.team_name}`;

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{pageTitle}</title>
        <link rel="canonical" href={`https://www.blog-f1-dashboard.com/piloto/${pilot.id}`} />

        <meta name="description" content={seoDescription} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={pilot.portrait_image || ""} />
        <meta property="og:type" content="profile" />
        <meta property="og:locale" content="pt_BR" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={pilot.portrait_image || ""} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: pilot.full_name || "",
              description: seoDescription,
              image: pilot.portrait_image || "",
              nationality: pilot.country || "",
              birthDate: pilot.birthdate || null,
              birthPlace: pilot.birthplace || "",
              height: pilot.height || null,
              weight: pilot.weight || null,
              affiliation: {
                "@type": "SportsTeam",
                name: pilot.team_name || "",
              },
              jobTitle: "Piloto de Fórmula 1",
              sameAs: [pilot["social-instagram"], pilot["social-twitter"], pilot["social-website"]].filter(Boolean),
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://www.blog-f1-dashboard.com/piloto/${pilot.id}`,
              },
            }),
          }}
        />
      </Head>

      <Navbar />

      <div className="details-pilot pilot-card">
        <div className="portrait">
          <img src={pilot.portrait_image || ""} alt={`Retrato de ${pilot.full_name}`} />
        </div>

        <div>
          <div className="header">
            <div className="full-name">{pilot.full_name}</div>
            <div className="team-name">{pilot.team_name}</div>

            <div className="meta-row">
              <div className="meta-item"><strong>Número:</strong> {pilot.driver_number || ""}</div>
              <div className="meta-item"><strong>País:</strong> {pilot.country || ""}</div>
              <div className="meta-item"><strong>Nasc.:</strong> {formattedBirthDate}</div>
              <div className="meta-item"><strong>Natural de:</strong> {pilot.birthplace || ""}</div>
            </div>
          </div>

          <div className="section">
            <h3>Biografia</h3>
            <p>{pilot.biography || "Sem biografia disponível."}</p>
          </div>

          <div className="section">
            <h3>Carreira</h3>
            <div className="grid-stats">
              <div className="stat">
                <div className="value">{pilot.championships || 0}</div>
                <div className="label">Mundiais</div>
              </div>
              <div className="stat">
                <div className="value">{pilot.height || "—"}</div>
                <div className="label">Altura</div>
              </div>
              <div className="stat">
                <div className="value">{pilot.weight || "—"}</div>
                <div className="label">Peso</div>
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Redes Sociais</h3>
            <div className="socials">
              {pilot["social-instagram"] && <a href={pilot["social-instagram"]} target="_blank" rel="noreferrer">Instagram</a>}
              {pilot["social-twitter"] && <a href={pilot["social-twitter"]} target="_blank" rel="noreferrer">Twitter</a>}
              {pilot["social-website"] && <a href={pilot["social-website"]} target="_blank" rel="noreferrer">Site Oficial</a>}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// ====================
// SSR – Markdown
// ====================
export async function getServerSideProps({ params }) {
  const { id } = params;
  const pilotsDir = path.join(process.cwd(), "pilots");

  try {
    const files = fs.readdirSync(pilotsDir);
    const fileName = files.find((f) => f.replace(/\.md$/, "") === id);

    if (!fileName) {
      return { props: { pilot: null } };
    }

    const fileContent = fs.readFileSync(path.join(pilotsDir, fileName), "utf8");
    const { data, content } = matter(fileContent);

    const pilot = {
      id,
      ...data,
      biography: data.biography,
      birthdate: data.birthdate ? new Date(data.birthdate).toISOString() : null,
      height: data.height || null,
      weight: data.weight || null,
      championships: data.championships || 0,
    };

    return { props: { pilot } };
  } catch (err) {
    console.error("Erro ao carregar piloto MD:", err);
    return { props: { pilot: null } };
  }
}

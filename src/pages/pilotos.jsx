// pages/pilotos.jsx
import PilotList from "../components/PilotList";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Head>
        <title>Pilotos de Fórmula 1™ | Blog F1 Dash</title>
        <meta
          name="description"
          content="Lista completa de pilotos da Fórmula 1™, com estatísticas, histórico e informações detalhadas."
        />
        <link
          rel="canonical"
          href="https://www.blog-f1-dashboard.com/pilotos"
        />
      </Head>

      <Navbar />
      <PilotList />
      <Footer />
    </div>
  );
}
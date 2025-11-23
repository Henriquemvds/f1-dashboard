import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import Loading from "../components/Loading";

export default function BioDriver() {

  const { id } = useParams(); // aqui vem "max-verstappen"
  const [pilot, setPilot] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchPilot(docId) {
    try {
      const ref = doc(db, "pilots", docId);  // usa o ID exatamente como está no Firebase
      const snap = await getDoc(ref);

      if (snap.exists()) return snap.data();
      else return null;

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

  if (loading)
    return (
     <Loading />
    );

  if (!pilot)
    return (
      <div className="p-6 min-h-screen flex justify-center items-center text-xl">
        Piloto não encontrado.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold">{pilot.full_name}</h1>
        <p>{pilot.biography?.long || "Biografia indisponível."}</p>
      </div>

      <Footer />
    </div>
  );
}

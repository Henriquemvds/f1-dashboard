import { useEffect, useState } from "react";
import axios from "axios";

export default function PilotList() {
  const [pilots, setPilots] = useState([]);

  useEffect(() => {
    async function fetchPilots() {
      try {
        const res = await axios.get("https://api.openf1.org/v1/drivers?session_key=latest");
        setPilots(res.data);
      } catch (err) {
        console.error("Erro ao buscar pilotos:", err);
      }
    }
    fetchPilots();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">Pilotos (Sessão Atual)</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pilots.map((p) => (
          <div
            key={p.driver_number}
            className="border p-3 rounded-md shadow-sm bg-white text-center"
          >
            <p className="font-bold">{p.full_name}</p>
            <p className="text-sm text-gray-500">#{p.driver_number}</p>
            <p className="text-sm">{p.team_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

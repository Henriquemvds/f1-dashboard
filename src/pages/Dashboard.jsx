import PilotList from "../components/PilotList";
import Charts from "../components/Charts";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [speedData, setSpeedData] = useState([]);

  useEffect(() => {
    async function fetchSpeeds() {
      try {
        const res = await axios.get("https://api.openf1.org/v1/car_data?session_key=latest&limit=100");
        const formatted = res.data.map((item) => ({
          date: new Date(item.date).toLocaleTimeString(),
          speed: item.speed,
        }));
        setSpeedData(formatted);
      } catch (err) {
        console.error("Erro ao buscar velocidades:", err);
      }
    }
    fetchSpeeds();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PilotList />
      <Charts data={speedData} />
    </div>
  );
}

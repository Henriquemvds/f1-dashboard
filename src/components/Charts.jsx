import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function Charts({ data }) {
  if (!data || data.length === 0) return null;

  const labels = data.map((d) => d.date);
  const speeds = data.map((d) => d.speed);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Velocidade Média (km/h)",
        data: speeds,
        fill: false,
        borderColor: "rgb(239, 68, 68)",
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mt-4">
      <h3 className="text-lg font-semibold mb-2">Velocidade Média</h3>
      <Line data={chartData} />
    </div>
  );
}

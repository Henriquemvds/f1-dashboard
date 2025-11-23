import PilotList from "../components/PilotList";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [speedData, setSpeedData] = useState([]);


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Navbar />
      <PilotList />
      <Footer />

    </div>
  );
}
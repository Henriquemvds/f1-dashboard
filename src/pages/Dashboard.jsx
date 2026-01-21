import PilotList from "../components/PilotList";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

export default function Dashboard() {

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Helmet>
        <link
          rel="canonical"
          href="https://www.blog-f1-dashboard.com/pilotos"
        />
      </Helmet>
      <Navbar />
      <PilotList />
      <Footer />

    </div>
  );
}
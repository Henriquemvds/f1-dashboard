import "../styles/Navbar.css";
import car from "../images/car.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo"><img src={car} className="car"/></div>

      <ul className="navbar-links">
        <li><a href="#" className="active">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Issues</a></li>
        <li><a href="#">Submissions</a></li>
      </ul>

      <div className="navbar-social">
        <a href="https://www.instagram.com/henrique.mv/"><i className="fab fa-instagram"></i></a>
        <a href="https://github.com/Henriquemvds"><i className="fab fa-github"></i></a>
      </div>
    </nav>
  );
}
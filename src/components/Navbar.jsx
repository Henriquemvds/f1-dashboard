import "../styles/Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">YourLogo</div>

      <ul className="navbar-links">
        <li><a href="#" className="active">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Issues</a></li>
        <li><a href="#">Submissions</a></li>
      </ul>

      <div className="navbar-social">
        <a href="#"><i className="fab fa-facebook-f"></i></a>
        <a href="#"><i className="fab fa-twitter"></i></a>
        <a href="#"><i className="fab fa-instagram"></i></a>
      </div>
    </nav>
  );
}
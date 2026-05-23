import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">Weather Travel Assistant</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/history">History</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
}

export default Navbar;
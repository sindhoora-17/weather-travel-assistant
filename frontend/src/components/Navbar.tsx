import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo-link">
  <h1>Weather Travel Assistant</h1>
</Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        {import.meta.env.VITE_ENABLE_HISTORY === "true" && <Link to="/history">History</Link>}
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
}

export default Navbar;
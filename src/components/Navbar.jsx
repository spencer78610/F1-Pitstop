import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut(auth);
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        F1 <span>Pitstop</span>
      </Link>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/drivers">Drivers</Link></li>
        <li><Link to="/teams">Teams</Link></li>
        <li><Link to="/races">Races</Link></li>
        {currentUser && <li><Link to="/favourites">Favourites</Link></li>}
      </ul>
      <div className="navbar-auth">
        {currentUser ? (
          <button onClick={handleLogout} className="nav-btn">Logout</button>
        ) : (
          <>
            <Link to="/login" className="nav-btn outline">Login</Link>
            <Link to="/register" className="nav-btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
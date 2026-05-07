import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div>
        <Link to="/" className="navbar-logo">NewsNest</Link>
      </div>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <span className="navbar-welcome">Welcome back!</span>
            <Link to="/bookmarks" className="navbar-link">
              📚 My Bookmarks
            </Link>
            <button onClick={handleLogout} className="navbar-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">
              Login
            </Link>
            <Link to="/register" className="navbar-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

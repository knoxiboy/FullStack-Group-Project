import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand">
          Resume<span>AI</span>
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-muted">Hello, {user.username}</span>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '0.4rem 1.2rem' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

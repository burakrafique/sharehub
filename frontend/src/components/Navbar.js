import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar-brand fw-bold fs-4">
          <i className="bi bi-box-seam me-2"></i>
          ShareHub
        </Link>

        {/* Mobile Toggle */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <i className="bi bi-house-door me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/items" className="nav-link">
                <i className="bi bi-grid me-1"></i> Items
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/search-nearby" className="nav-link">
                <i className="bi bi-geo-alt me-1"></i> Search Nearby
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/ngos" className="nav-link">
                <i className="bi bi-building me-1"></i> NGOs
              </Link>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <Link to="/messages" className="nav-link">
                    <i className="bi bi-chat-dots me-1"></i> Messages
                    <span className="badge bg-danger ms-1">3</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/favorites" className="nav-link">
                    <i className="bi bi-heart me-1"></i> Favorites
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* User Menu */}
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="dropdown">
                <button 
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div 
                    className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                    style={{ width: '35px', height: '35px' }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                </button>
                {showDropdown && (
                  <div className="dropdown-menu dropdown-menu-end show">
                    <Link to="/profile" className="dropdown-item">
                      <i className="bi bi-person me-2"></i>Profile
                    </Link>
                    <Link to="/create-item" className="dropdown-item">
                      <i className="bi bi-plus-circle me-2"></i>Create Listing
                    </Link>
                    <Link to="/my-items" className="dropdown-item">
                      <i className="bi bi-box me-2"></i>My Items
                    </Link>
                    <Link to="/ngo-verification" className="dropdown-item">
                      <i className="bi bi-shield-check me-2"></i>NGO Verification
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item">
                        <i className="bi bi-gear me-2"></i>Admin Dashboard
                      </Link>
                    )}
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item text-danger">
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light">
                  Login
                </Link>
                <Link to="/register" className="btn btn-light">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

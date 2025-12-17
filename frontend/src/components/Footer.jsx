import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5">
      <div className="container py-5">
        <div className="row g-4">
          {/* About */}
          <div className="col-md-4">
            <h5 className="mb-3">
              <i className="bi bi-box-seam me-2"></i>
              ShareHub
            </h5>
            <p className="text-white-50">
              A platform for sharing, selling, and donating items in your community. 
              Making a difference, one item at a time.
            </p>
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-outline-light btn-sm">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="btn btn-outline-light btn-sm">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="btn btn-outline-light btn-sm">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-2">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/items" className="text-white-50 text-decoration-none">
                  Browse Items
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/items?type=donate" className="text-white-50 text-decoration-none">
                  Donations
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/register" className="text-white-50 text-decoration-none">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-md-2">
            <h6 className="mb-3">Categories</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/items?category=clothes" className="text-white-50 text-decoration-none">
                  Clothes
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/items?category=books" className="text-white-50 text-decoration-none">
                  Books
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/items?category=ration" className="text-white-50 text-decoration-none">
                  Ration
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-4">
            <h6 className="mb-3">Contact Us</h6>
            <p className="text-white-50 mb-2">
              <i className="bi bi-envelope me-2"></i>
              support@sharehub.com
            </p>
            <p className="text-white-50 mb-2">
              <i className="bi bi-telephone me-2"></i>
              +92 300 1234567
            </p>
            <p className="text-white-50">
              <i className="bi bi-geo-alt me-2"></i>
              Lahore, Pakistan
            </p>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <small className="text-white-50">
              © 2024 ShareHub. All rights reserved.
            </small>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <small className="text-white-50">
              Final Year Project by Haroon Usman & Muhammad Buraq
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
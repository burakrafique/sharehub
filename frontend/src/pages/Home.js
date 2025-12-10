import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      title: "Share What You Don't Need",
      subtitle: 'Help others while decluttering your space',
      cta: 'Start Sharing',
      link: '/register'
    },
    {
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
      title: 'Donate to Those in Need',
      subtitle: 'Make a difference in your community',
      cta: 'Donate Now',
      link: '/items?type=donate'
    },
    {
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc',
      title: 'Find Great Deals',
      subtitle: 'Buy quality items at affordable prices',
      cta: 'Browse Items',
      link: '/items'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Slider */}
      <section className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay"></div>
            <div className="container">
              <div className="slide-content">
                <h1 className="display-3 fw-bold text-white mb-3" data-aos="fade-up">
                  {slide.title}
                </h1>
                <p className="lead text-white mb-4" data-aos="fade-up" data-aos-delay="100">
                  {slide.subtitle}
                </p>
                <Link
                  to={slide.link}
                  className="btn btn-light btn-lg px-5 py-3"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  {slide.cta}
                  <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Quick Search */}
      <section className="quick-search-section py-4 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for clothes, books, ration items..."
                />
                <button className="btn btn-primary px-5">Search</button>
              </div>
            </div>
            <div className="col-md-4 text-end">
              <span className="text-muted">Over 5,000+ items available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-3 text-center">
              <div className="feature-icon bg-primary bg-opacity-10 rounded-circle mx-auto mb-3">
                <i className="bi bi-shield-check text-primary fs-1"></i>
              </div>
              <h5>Verified Users</h5>
              <p className="text-muted">Safe and trusted community</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="feature-icon bg-success bg-opacity-10 rounded-circle mx-auto mb-3">
                <i className="bi bi-truck text-success fs-1"></i>
              </div>
              <h5>Free Delivery</h5>
              <p className="text-muted">On select items</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="feature-icon bg-info bg-opacity-10 rounded-circle mx-auto mb-3">
                <i className="bi bi-chat-dots text-info fs-1"></i>
              </div>
              <h5>Direct Chat</h5>
              <p className="text-muted">Connect with sellers instantly</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="feature-icon bg-warning bg-opacity-10 rounded-circle mx-auto mb-3">
                <i className="bi bi-geo-alt text-warning fs-1"></i>
              </div>
              <h5>Location Based</h5>
              <p className="text-muted">Find items near you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories with Images */}
      <section className="categories-section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Browse by Category</h2>
            <p className="lead text-muted">Find exactly what you're looking for</p>
          </div>
          <div className="row g-4">
            {/* Clothes */}
            <div className="col-md-4">
              <Link to="/items?category=clothes" className="text-decoration-none">
                <div className="category-card position-relative overflow-hidden rounded-4">
                  <img
                    src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f"
                    alt="Clothes"
                    className="w-100"
                    style={{ height: '300px', objectFit: 'cover' }}
                  />
                  <div className="category-overlay">
                    <div className="category-content">
                      <i className="bi bi-bag fs-1 text-white mb-3"></i>
                      <h3 className="text-white fw-bold">Clothes</h3>
                      <p className="text-white mb-3">Fashion for everyone</p>
                      <span className="btn btn-light">Browse Now</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Books */}
            <div className="col-md-4">
              <Link to="/items?category=books" className="text-decoration-none">
                <div className="category-card position-relative overflow-hidden rounded-4">
                  <img
                    src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d"
                    alt="Books"
                    className="w-100"
                    style={{ height: '300px', objectFit: 'cover' }}
                  />
                  <div className="category-overlay">
                    <div className="category-content">
                      <i className="bi bi-book fs-1 text-white mb-3"></i>
                      <h3 className="text-white fw-bold">Books</h3>
                      <p className="text-white mb-3">Knowledge for all</p>
                      <span className="btn btn-light">Browse Now</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Ration */}
            <div className="col-md-4">
              <Link to="/items?category=ration" className="text-decoration-none">
                <div className="category-card position-relative overflow-hidden rounded-4">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e"
                    alt="Ration"
                    className="w-100"
                    style={{ height: '300px', objectFit: 'cover' }}
                  />
                  <div className="category-overlay">
                    <div className="category-content">
                      <i className="bi bi-basket fs-1 text-white mb-3"></i>
                      <h3 className="text-white fw-bold">Ration</h3>
                      <p className="text-white mb-3">Help feed families</p>
                      <span className="btn btn-light">Browse Now</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 bg-primary text-white">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-3">
              <h2 className="display-3 fw-bold mb-0">1000+</h2>
              <p className="lead mb-0">Active Users</p>
            </div>
            <div className="col-md-3">
              <h2 className="display-3 fw-bold mb-0">5000+</h2>
              <p className="lead mb-0">Items Listed</p>
            </div>
            <div className="col-md-3">
              <h2 className="display-3 fw-bold mb-0">2000+</h2>
              <p className="lead mb-0">Items Donated</p>
            </div>
            <div className="col-md-3">
              <h2 className="display-3 fw-bold mb-0">500+</h2>
              <p className="lead mb-0">Daily Visitors</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Make a Difference?</h2>
          <p className="lead text-muted mb-4">
            Join thousands of users sharing, selling, and donating items
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/register" className="btn btn-primary btn-lg px-5">
              Get Started Free
            </Link>
            <Link to="/items" className="btn btn-outline-primary btn-lg px-5">
              Browse Items
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

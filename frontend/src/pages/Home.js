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

  // Intersection Observer for smooth section animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, observerOptions);

    // Observe all sections with animation class
    const animatedSections = document.querySelectorAll('.section-animate');
    animatedSections.forEach((section) => observer.observe(section));

    return () => {
      animatedSections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="home-page">
      {/* Hero Slider */}
      <section className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero-overlay"></div>
            <div className="container h-100">
              <div className="row h-100 align-items-center">
                <div className="col-lg-8 col-xl-7">
                  <div className="hero-content">
                    <h1 className="hero-title text-white mb-3">
                      {slide.title}
                    </h1>
                    <p className="hero-subtitle text-white mb-4">
                      {slide.subtitle}
                    </p>
                    <Link
                      to={slide.link}
                      className={slide.link === '/register' ? 'cta-primary' : 'cta-secondary'}
                    >
                      {slide.cta}
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <div className="hero-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section section-animate">
        <div className="container">
          <div className="search-wrapper">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <div className="search-header mb-3">
                  <h3 className="search-title">Find What You Need</h3>
                  <p className="search-subtitle">Search through thousands of items in your area</p>
                </div>
                <div className="search-input-wrapper">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search for clothes, books, ration items..."
                    />
                    <button className="cta-secondary">
                      <i className="bi bi-search me-2"></i>
                      Search
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="search-stats">
                  <div className="stat-item">
                    <i className="bi bi-check-circle-fill text-success"></i>
                    <div className="stat-content">
                      <div className="stat-number">5,000+</div>
                      <div className="stat-label">Items Available</div>
                    </div>
                  </div>
                  <div className="stat-item">
                    <i className="bi bi-people-fill text-primary"></i>
                    <div className="stat-content">
                      <div className="stat-number">1,000+</div>
                      <div className="stat-label">Active Users</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section-animate delay-1">
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

      {/* Categories Section */}
      <section className="categories-section section-animate delay-2">
        <div className="categories-container">
          <div className="categories-header">
            <h2 className="categories-title">Browse by Category</h2>
            <p className="categories-subtitle">Find exactly what you're looking for</p>
          </div>
          
          <div className="categories-grid">
            {/* Clothes */}
            <Link to="/items?category=clothes" className="category-link">
              <article className="category-card">
                <div className="category-image-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f"
                    alt="Clothes Category"
                    className="category-image"
                  />
                </div>
                <div className="category-overlay">
                  <div className="category-content">
                    <div className="category-icon">
                      <i className="bi bi-bag"></i>
                    </div>
                    <h3 className="category-title">Clothes</h3>
                    <p className="category-description">Fashion for everyone</p>
                    <span className="cta-tertiary">Browse Now</span>
                  </div>
                </div>
              </article>
            </Link>

            {/* Books */}
            <Link to="/items?category=books" className="category-link">
              <article className="category-card">
                <div className="category-image-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d"
                    alt="Books Category"
                    className="category-image"
                  />
                </div>
                <div className="category-overlay">
                  <div className="category-content">
                    <div className="category-icon">
                      <i className="bi bi-book"></i>
                    </div>
                    <h3 className="category-title">Books</h3>
                    <p className="category-description">Knowledge for all</p>
                    <span className="cta-tertiary">Browse Now</span>
                  </div>
                </div>
              </article>
            </Link>

            {/* Ration */}
            <Link to="/items?category=ration" className="category-link">
              <article className="category-card">
                <div className="category-image-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e"
                    alt="Ration Category"
                    className="category-image"
                  />
                </div>
                <div className="category-overlay">
                  <div className="category-content">
                    <div className="category-icon">
                      <i className="bi bi-basket"></i>
                    </div>
                    <h3 className="category-title">Ration</h3>
                    <p className="category-description">Help feed families</p>
                    <span className="cta-tertiary">Browse Now</span>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section section-animate delay-3 text-white">
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
      <section className="cta-section section-animate">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Make a Difference?</h2>
          <p className="lead text-muted mb-4">
            Join thousands of users sharing, selling, and donating items
          </p>
          <div className="cta-group">
            <Link to="/register" className="cta-primary cta-large">
              Start Sharing
            </Link>
            <Link to="/items" className="cta-primary cta-large">
              Browse Items
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

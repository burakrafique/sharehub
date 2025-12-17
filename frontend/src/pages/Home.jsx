import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { getFeaturedItems, getPremiumItems } from '../services/itemService';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [premiumItems, setPremiumItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const heroSlides = [
    {
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      title: 'Share What Matters',
      subtitle: 'Transform unused items into opportunities',
      image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800',
      cta: 'Start Sharing',
      link: '/register'
    },
    {
      bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      title: 'Donate with Purpose',
      subtitle: 'Every donation creates a ripple of change',
      image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800',
      cta: 'Donate Now',
      link: '/items?type=donate'
    },
    {
      bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      title: 'Discover Great Deals',
      subtitle: 'Quality items at unbeatable prices',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
      cta: 'Browse Items',
      link: '/items'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featuredResponse, premiumResponse] = await Promise.all([
          getFeaturedItems(3),
          getPremiumItems(2)
        ]);
        
        if (featuredResponse.success) {
          setFeaturedItems(featuredResponse.data);
        }
        
        if (premiumResponse.success) {
          setPremiumItems(premiumResponse.data);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  return (
    <div className="home-page">
      {/* Hero Slider */}
      <section className="hero-slider">
        {heroSlides.map((slide, index) => (
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
          {heroSlides.map((_, index) => (
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

      {/* Stats Section - Smaller */}
      <section className="stats-section py-3 text-white" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="container">
          <div className="row text-center g-3">
            <div className="col-md-3">
              <h3 className="display-6 fw-bold mb-0">1000+</h3>
              <p className="mb-0">Active Users</p>
            </div>
            <div className="col-md-3">
              <h3 className="display-6 fw-bold mb-0">5000+</h3>
              <p className="mb-0">Items Listed</p>
            </div>
            <div className="col-md-3">
              <h3 className="display-6 fw-bold mb-0">2000+</h3>
              <p className="mb-0">Items Donated</p>
            </div>
            <div className="col-md-3">
              <h3 className="display-6 fw-bold mb-0">500+</h3>
              <p className="mb-0">Daily Visitors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="featured-items-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Featured Items</h2>
            <p className="lead text-muted">Discover amazing deals and donations</p>
          </div>
          <div className="row g-4">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="col-md-4">
                  <div className="card h-100 shadow-sm">
                    <div className="placeholder-glow">
                      <div className="placeholder bg-secondary" style={{ height: '250px' }}></div>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title placeholder-glow">
                        <span className="placeholder col-8"></span>
                      </h5>
                      <p className="card-text placeholder-glow">
                        <span className="placeholder col-7"></span>
                        <span className="placeholder col-4"></span>
                      </p>
                      <div className="placeholder-glow">
                        <span className="placeholder col-4"></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : featuredItems.length > 0 ? (
              // Real featured items
              featuredItems.map((item) => (
                <div key={item.id} className="col-md-4">
                  <div className="card h-100 shadow-sm">
                    <div className="position-relative">
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=300&fit=crop'}
                        className="card-img-top"
                        alt={item.title}
                        style={{ height: '250px', objectFit: 'cover' }}
                      />
                      <span className={`badge position-absolute top-0 end-0 m-2 ${
                        item.listing_type === 'sell' ? 'bg-success' :
                        item.listing_type === 'donate' ? 'bg-warning' : 'bg-info'
                      }`}>
                        <i className="bi bi-star-fill me-1"></i>Featured
                      </span>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text text-muted">{item.description?.substring(0, 100)}...</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className={`h5 mb-0 ${item.listing_type === 'sell' ? 'text-primary' : 'text-success'}`}>
                          {item.listing_type === 'sell' ? `Rs. ${item.price?.toLocaleString()}` : 'Free Donation'}
                        </span>
                        <small className="text-muted">
                          <i className="bi bi-geo-alt me-1"></i>
                          {item.address?.split(',')[0] || 'Lahore'}
                        </small>
                      </div>
                    </div>
                    <div className="card-footer bg-transparent">
                      <Link to={`/items/${item.id}`} className={`btn w-100 ${
                        item.listing_type === 'sell' ? 'btn-primary' : 'btn-success'
                      }`}>
                        {item.listing_type === 'sell' ? 'View Details' : 'Request Donation'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback items
              <div className="col-12 text-center">
                <div className="alert alert-info">
                  <h5>No featured items available</h5>
                  <p className="mb-0">Check back later for amazing deals and donations!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Premium Items Section */}
      <section className="premium-items-section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">
              <i className="bi bi-gem text-warning me-2"></i>Premium Items
            </h2>
            <p className="lead text-muted">Exclusive high-quality items from verified sellers</p>
          </div>
          <div className="row g-4">
            {loading ? (
              // Loading skeleton for premium items
              Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="col-md-6">
                  <div className="card h-100 shadow border-warning">
                    <div className="placeholder-glow">
                      <div className="placeholder bg-secondary" style={{ height: '250px' }}></div>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title placeholder-glow">
                        <span className="placeholder col-8"></span>
                      </h5>
                      <p className="card-text placeholder-glow">
                        <span className="placeholder col-7"></span>
                        <span className="placeholder col-4"></span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : premiumItems.length > 0 ? (
              // Real premium items
              premiumItems.map((item) => (
                <div key={item.id} className="col-md-6">
                  <div className="card h-100 shadow border-warning">
                    <div className="position-relative">
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=300&fit=crop'}
                        className="card-img-top"
                        alt={item.title}
                        style={{ height: '250px', objectFit: 'cover' }}
                      />
                      <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-2">
                        <i className="bi bi-gem me-1"></i>Premium
                      </span>
                      <span className="badge bg-primary position-absolute top-0 end-0 m-2">
                        <i className="bi bi-shield-check me-1"></i>Verified
                      </span>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text text-muted">{item.description?.substring(0, 120)}...</p>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="h4 text-primary mb-0">
                          {item.listing_type === 'sell' ? `Rs. ${item.price?.toLocaleString()}` : 'Premium Donation'}
                        </span>
                        <div className="text-warning">
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                        </div>
                      </div>
                      <small className="text-muted">
                        <i className="bi bi-geo-alt me-1"></i>
                        {item.address?.split(',').slice(0, 2).join(', ') || 'Lahore'}
                      </small>
                    </div>
                    <div className="card-footer bg-transparent">
                      <Link to={`/items/${item.id}`} className="btn btn-warning w-100 text-dark fw-bold">
                        <i className="bi bi-gem me-2"></i>View Premium Item
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback for no premium items
              <div className="col-12 text-center">
                <div className="alert alert-warning">
                  <h5><i className="bi bi-gem me-2"></i>No Premium Items Available</h5>
                  <p className="mb-0">Premium items will appear here when available!</p>
                </div>
              </div>
            )}
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

import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Row, Col, Badge, Modal, Form } from 'react-bootstrap';
import cartService from '../services/cartService';
import transactionService from '../services/transactionService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const DashboardCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState({ total_items: 0, total_amount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const [itemsRes, summaryRes] = await Promise.all([
        cartService.getCartItems(),
        cartService.getCartSummary()
      ]);
      setCartItems(itemsRes.data.data);
      setSummary(summaryRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartId, newQuantity) => {
    try {
      await cartService.updateCartItem(cartId, newQuantity);
      fetchCartData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (cartId) => {
    try {
      await cartService.removeFromCart(cartId);
      setSuccess('Item removed from cart');
      fetchCartData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    try {
      setProcessing(true);
      
      // Create transactions for each cart item
      for (const item of cartItems) {
        await transactionService.createTransaction({
          item_id: item.id,
          seller_id: item.user_id,
          transaction_type: 'sell',
          amount: item.price * item.quantity
        });
      }

      // Clear cart after successful checkout
      await cartService.clearCart();
      setSuccess('Purchase completed successfully!');
      setShowCheckout(false);
      fetchCartData();
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard-cart">
      <div className="page-header">
        <h2>Shopping Cart</h2>
        <p className="text-muted">Review and manage your cart items</p>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {cartItems.length === 0 ? (
        <EmptyState
          icon="cart-x"
          title="Your cart is empty"
          message="Browse items and add them to your cart"
        />
      ) : (
        <>
          <Row>
            <Col lg={8}>
              {cartItems.map((item) => (
                <Card key={item.cart_id} className="mb-3">
                  <Card.Body>
                    <Row>
                      <Col md={3}>
                        {item.image_url ? (
                          <img
                            src={`http://localhost:5000${item.image_url}`}
                            alt={item.title}
                            className="img-fluid rounded"
                          />
                        ) : (
                          <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '100px' }}>
                            <i className="bi bi-image text-muted" style={{ fontSize: '2rem' }}></i>
                          </div>
                        )}
                      </Col>
                      <Col md={6}>
                        <h5>{item.title}</h5>
                        <p className="text-muted mb-2">{item.category}</p>
                        <Badge bg="info">{item.item_condition}</Badge>
                        <p className="mt-2 mb-0">
                          <small>Seller: {item.seller_name}</small>
                        </p>
                      </Col>
                      <Col md={3} className="text-end">
                        <h5 className="text-primary">${item.price}</h5>
                        <div className="d-flex align-items-center justify-content-end gap-2 mb-2">
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => handleUpdateQuantity(item.cart_id, Math.max(1, item.quantity - 1))}
                          >
                            -
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => handleUpdateQuantity(item.cart_id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleRemoveItem(item.cart_id)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </Col>

            <Col lg={4}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Cart Summary</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Items:</span>
                    <strong>{summary.total_items || 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Quantity:</span>
                    <strong>{summary.total_quantity || 0}</strong>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <h5>Total Amount:</h5>
                    <h5 className="text-primary">${summary.total_amount || 0}</h5>
                  </div>
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => setShowCheckout(true)}
                  >
                    <i className="bi bi-credit-card me-2"></i>
                    Proceed to Checkout
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Checkout Modal */}
          <Modal show={showCheckout} onHide={() => setShowCheckout(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Purchase</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>You are about to purchase {summary.total_items} item(s) for ${summary.total_amount}.</p>
              <Alert variant="info">
                <i className="bi bi-info-circle me-2"></i>
                This is a demo checkout. In production, integrate with a payment gateway.
              </Alert>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowCheckout(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCheckout}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Confirm Purchase'}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default DashboardCart;

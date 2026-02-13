import React, { useState, useEffect } from 'react';
import { Card, Alert, Row, Col, Badge, Tabs, Tab } from 'react-bootstrap';
import transactionService from '../services/transactionService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const DashboardHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await transactionService.getUserTransactions();
      // Backend returns { success, count, data }
      // axios wraps it in res.data
      setTransactions(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      completed: 'success',
      cancelled: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getTypeBadge = (type) => {
    const variants = {
      sell: 'primary',
      donate: 'success',
      swap: 'info'
    };
    return <Badge bg={variants[type] || 'secondary'}>{type}</Badge>;
  };

  const purchases = Array.isArray(transactions) ? transactions.filter(t => t.user_role === 'buyer') : [];
  const sales = Array.isArray(transactions) ? transactions.filter(t => t.user_role === 'seller') : [];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard-history">
      <div className="page-header">
        <h2>Transaction History</h2>
        <p className="text-muted">View your purchase and sales history</p>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Tabs defaultActiveKey="purchases" className="mb-4">
        <Tab eventKey="purchases" title={`Purchases (${purchases.length})`}>
          {purchases.length === 0 ? (
            <EmptyState
              icon="bag-x"
              title="No purchases yet"
              message="Your purchase history will appear here"
            />
          ) : (
            <Row>
              {purchases.map((transaction) => (
                <Col md={6} lg={4} key={transaction.id} className="mb-3">
                  <Card>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0">{transaction.item_title}</h6>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <p className="text-muted mb-2">
                        <small>Seller: {transaction.seller_name}</small>
                      </p>
                      <div className="mb-2">
                        <Badge bg="secondary" className="me-2">{transaction.item_category}</Badge>
                        {getTypeBadge(transaction.transaction_type)}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-primary fw-bold">${transaction.amount}</span>
                        <small className="text-muted">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </small>
                      </div>
                      {transaction.completed_at && (
                        <p className="mb-0 mt-2">
                          <small className="text-success">
                            <i className="bi bi-check-circle me-1"></i>
                            Completed: {new Date(transaction.completed_at).toLocaleDateString()}
                          </small>
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>

        <Tab eventKey="sales" title={`Sales (${sales.length})`}>
          {sales.length === 0 ? (
            <EmptyState
              icon="shop"
              title="No sales yet"
              message="Your sales history will appear here"
            />
          ) : (
            <Row>
              {sales.map((transaction) => (
                <Col md={6} lg={4} key={transaction.id} className="mb-3">
                  <Card>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0">{transaction.item_title}</h6>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <p className="text-muted mb-2">
                        <small>Buyer: {transaction.buyer_name}</small>
                      </p>
                      <div className="mb-2">
                        <Badge bg="secondary" className="me-2">{transaction.item_category}</Badge>
                        {getTypeBadge(transaction.transaction_type)}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-success fw-bold">+${transaction.amount}</span>
                        <small className="text-muted">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </small>
                      </div>
                      {transaction.completed_at && (
                        <p className="mb-0 mt-2">
                          <small className="text-success">
                            <i className="bi bi-check-circle me-1"></i>
                            Completed: {new Date(transaction.completed_at).toLocaleDateString()}
                          </small>
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>

        <Tab eventKey="all" title={`All (${transactions.length})`}>
          {transactions.length === 0 ? (
            <EmptyState
              icon="clock-history"
              title="No transactions yet"
              message="Your transaction history will appear here"
            />
          ) : (
            <Row>
              {transactions.map((transaction) => (
                <Col md={6} lg={4} key={transaction.id} className="mb-3">
                  <Card>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0">{transaction.item_title}</h6>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <p className="text-muted mb-2">
                        <small>
                          {transaction.user_role === 'buyer' 
                            ? `Seller: ${transaction.seller_name}`
                            : `Buyer: ${transaction.buyer_name}`
                          }
                        </small>
                      </p>
                      <div className="mb-2">
                        <Badge bg="secondary" className="me-2">{transaction.item_category}</Badge>
                        {getTypeBadge(transaction.transaction_type)}
                        <Badge bg={transaction.user_role === 'buyer' ? 'info' : 'warning'} className="ms-2">
                          {transaction.user_role}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className={`fw-bold ${transaction.user_role === 'seller' ? 'text-success' : 'text-primary'}`}>
                          {transaction.user_role === 'seller' ? '+' : ''}${transaction.amount}
                        </span>
                        <small className="text-muted">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </small>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>
      </Tabs>
    </div>
  );
};

export default DashboardHistory;

import React, { useState } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import DashboardProfile from './DashboardProfile';
import DashboardCart from './DashboardCart';
import DashboardSwaps from './DashboardSwaps';
import DashboardDonations from './DashboardDonations';
import DashboardHistory from './DashboardHistory';
import Messages from './Messages';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <DashboardProfile />;
      case 'cart':
        return <DashboardCart />;
      case 'swaps':
        return <DashboardSwaps />;
      case 'donations':
        return <DashboardDonations />;
      case 'messages':
        return <Messages />;
      case 'history':
        return <DashboardHistory />;
      default:
        return <DashboardProfile />;
    }
  };

  return (
    <div className="user-dashboard">
      <Container fluid>
        <Row>
          {/* Sidebar Navigation */}
          <Col lg={2} md={3} className="dashboard-sidebar">
            <div className="sidebar-header">
              <div className="user-avatar">
                <i className="bi bi-person-circle"></i>
              </div>
              <h5>{user?.name}</h5>
              <p className="text-muted">{user?.email}</p>
            </div>

            <Nav className="flex-column dashboard-nav">
              <Nav.Link
                className={activeTab === 'profile' ? 'active' : ''}
                onClick={() => setActiveTab('profile')}
              >
                <i className="bi bi-person me-2"></i>
                Profile
              </Nav.Link>
              <Nav.Link
                className={activeTab === 'cart' ? 'active' : ''}
                onClick={() => setActiveTab('cart')}
              >
                <i className="bi bi-cart me-2"></i>
                Shopping Cart
              </Nav.Link>
              <Nav.Link
                className={activeTab === 'swaps' ? 'active' : ''}
                onClick={() => setActiveTab('swaps')}
              >
                <i className="bi bi-arrow-left-right me-2"></i>
                Swap Requests
              </Nav.Link>
              <Nav.Link
                className={activeTab === 'donations' ? 'active' : ''}
                onClick={() => setActiveTab('donations')}
              >
                <i className="bi bi-heart me-2"></i>
                Donations
              </Nav.Link>
              <Nav.Link
                className={activeTab === 'messages' ? 'active' : ''}
                onClick={() => setActiveTab('messages')}
              >
                <i className="bi bi-chat-dots me-2"></i>
                Messages
              </Nav.Link>
              <Nav.Link
                className={activeTab === 'history' ? 'active' : ''}
                onClick={() => setActiveTab('history')}
              >
                <i className="bi bi-clock-history me-2"></i>
                Purchase History
              </Nav.Link>
            </Nav>
          </Col>

          {/* Main Content Area */}
          <Col lg={10} md={9} className="dashboard-content">
            {renderContent()}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserDashboard;

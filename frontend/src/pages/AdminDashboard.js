import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminNGOManagement from './AdminNGOManagement';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import api from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') {
      window.location.href = '/';
      return;
    }
    fetchStats();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'items') {
      fetchItems();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stats');
      setStats(response.data.stats);
    } catch (error) {
      setError('Failed to fetch statistics');
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data.data);
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/items');
      setItems(response.data.data);
    } catch (error) {
      setError('Failed to fetch items');
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserRoleUpdate = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      await fetchUsers();
      alert('User role updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleUserDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      await fetchUsers();
      alert('User deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleItemDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await api.delete(`/admin/items/${itemId}`);
      await fetchItems();
      alert('Item deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete item');
    }
  };

  const renderOverview = () => (
    <div className="overview-section">
      <h3>Platform Statistics</h3>
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon users">👥</div>
            <div className="stat-content">
              <h4>Total Users</h4>
              <p className="stat-number">{stats.users.total_users}</p>
              <small>Regular: {stats.users.regular_users} | NGOs: {stats.users.ngo_users}</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon items">📦</div>
            <div className="stat-content">
              <h4>Total Items</h4>
              <p className="stat-number">{stats.items.total_items}</p>
              <small>Available: {stats.items.available_items}</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon transactions">💰</div>
            <div className="stat-content">
              <h4>Transactions</h4>
              <p className="stat-number">{stats.transactions.total_transactions}</p>
              <small>Completed: {stats.transactions.completed_transactions}</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue">💵</div>
            <div className="stat-content">
              <h4>Total Revenue</h4>
              <p className="stat-number">${stats.transactions.total_amount || 0}</p>
              <small>From completed sales</small>
            </div>
          </div>
        </div>
      )}

      <div className="category-breakdown">
        <h4>Items by Category</h4>
        {stats && (
          <div className="category-stats">
            <div className="category-item">
              <span>Clothes</span>
              <span>{stats.items.clothes_items}</span>
            </div>
            <div className="category-item">
              <span>Books</span>
              <span>{stats.items.books_items}</span>
            </div>
            <div className="category-item">
              <span>Ration</span>
              <span>{stats.items.ration_items}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="users-section">
      <h3>User Management</h3>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleUserRoleUpdate(user.id, e.target.value)}
                    className="role-select"
                  >
                    <option value="user">User</option>
                    <option value="ngo">NGO</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{user.phone || 'N/A'}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleUserDelete(user.id)}
                    className="delete-btn"
                    disabled={user.role === 'admin'}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderItems = () => (
    <div className="items-section">
      <h3>Item Management</h3>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Type</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>{item.listing_type}</td>
                <td>{item.owner_name}</td>
                <td>
                  <span className={`status-badge ${item.status}`}>
                    {item.status}
                  </span>
                </td>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => window.open(`/items/${item.id}`, '_blank')}
                    className="view-btn"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleItemDelete(item.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (user?.role !== 'admin') {
    return (
      <div className="admin-dashboard">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, items, and NGO verifications</p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`tab-btn ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          Items
        </button>
        <button
          className={`tab-btn ${activeTab === 'ngos' ? 'active' : ''}`}
          onClick={() => setActiveTab('ngos')}
        >
          NGO Verifications
        </button>
      </div>

      <div className="admin-content">
        {loading && <LoadingSpinner />}
        
        {!loading && (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'items' && renderItems()}
            {activeTab === 'ngos' && <AdminNGOManagement />}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
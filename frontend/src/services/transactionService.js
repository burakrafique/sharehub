import API from './api';

// Create a new transaction
export const createTransaction = async (transactionData) => {
  const response = await API.post('/transactions', transactionData);
  return response.data;
};

// Get all user transactions
export const getTransactions = async () => {
  const response = await API.get('/transactions');
  return response.data;
};

// Get user's transaction history
export const getUserTransactions = async () => {
  const response = await API.get('/transactions');
  return response.data;
};

// Get transaction by ID
export const getTransactionById = async (id) => {
  const response = await API.get(`/transactions/${id}`);
  return response.data;
};

// Update transaction status
export const updateTransactionStatus = async (id, status) => {
  const response = await API.put(`/transactions/${id}/status`, { status });
  return response.data;
};

// Cancel transaction
export const cancelTransaction = async (id) => {
  const response = await API.delete(`/transactions/${id}`);
  return response.data;
};

export default {
  createTransaction,
  getTransactions,
  getUserTransactions,
  getTransactionById,
  updateTransactionStatus,
  cancelTransaction
};

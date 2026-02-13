# Transaction Management System

## Overview
A comprehensive transaction management system for ShareHub backend that handles sales, donations, and swaps between users with complete tracking, notifications, and statistics.

## Files Created/Updated

### 1. Models
- **`models/Transaction.js`** - Enhanced transaction model with comprehensive methods

### 2. Controllers
- **`controllers/transactionController.js`** - Complete transaction management controller

### 3. Routes
- **`routes/transactionRoutes.js`** - RESTful API endpoints for transactions

## Database Schema

### Transaction Table Structure
```sql
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    seller_id INT NOT NULL,
    buyer_id INT NOT NULL,
    transaction_type ENUM('sale', 'donation', 'swap') NOT NULL,
    amount DECIMAL(10, 2) NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraints
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Transaction Types
1. **Sale**: `user_id` (seller) → `buyer_id`, `amount` = item price
2. **Donation**: `user_id` (donor) → `buyer_id` (recipient), `amount` = NULL
3. **Swap**: `user_id` (swapper1) ↔ `buyer_id` (swapper2), `amount` = NULL

## API Endpoints

### 1. Create Transaction
**POST** `/api/transactions`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "item_id": 123,
  "buyer_id": 456,           // Optional for sales/donations
  "swap_partner_id": 789,    // Required for swaps
  "transaction_type": "sale" // sale, donation, swap
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "id": 1,
    "item_id": 123,
    "seller_id": 456,
    "buyer_id": 789,
    "transaction_type": "sale",
    "amount": 1500.00,
    "status": "pending",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Get My Transactions
**GET** `/api/transactions`

**Query Parameters:**
- `role`: `all` | `buyer` | `seller` (default: `all`)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `transaction_type`: `sale` | `donation` | `swap`
- `status`: `pending` | `completed` | `cancelled`
- `date_from`: Start date (YYYY-MM-DD)
- `date_to`: End date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "pagination": {
      "totalCount": 25,
      "totalPages": 3,
      "currentPage": 1,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### 3. Get Transaction Statistics
**GET** `/api/transactions/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "sales": {
      "count": 15,
      "amount": 25000.00
    },
    "purchases": {
      "count": 8,
      "amount": 12000.00
    },
    "donations": {
      "given": 5,
      "received": 3
    },
    "swaps": {
      "count": 2
    },
    "summary": {
      "successful_transactions": 20,
      "pending_transactions": 3,
      "cancelled_transactions": 2,
      "transactions_last_30_days": 8
    }
  }
}
```

### 4. Get Transaction by ID
**GET** `/api/transactions/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "item_id": 123,
    "seller_id": 456,
    "buyer_id": 789,
    "transaction_type": "sale",
    "amount": 1500.00,
    "status": "pending",
    "created_at": "2024-01-15T10:30:00Z",
    "completed_at": null,
    "item_title": "Vintage Leather Jacket",
    "item_category": "clothes",
    "item_images": [...],
    "seller_name": "John Doe",
    "seller_email": "john@example.com",
    "buyer_name": "Jane Smith",
    "buyer_email": "jane@example.com"
  }
}
```

### 5. Update Transaction Status
**PATCH** `/api/transactions/:id/status`

**Body:**
```json
{
  "status": "completed" // pending, completed, cancelled
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction status updated successfully",
  "data": {
    "id": 1,
    "status": "completed",
    "completed_at": "2024-01-15T15:45:00Z",
    ...
  }
}
```

### 6. Cancel Transaction
**DELETE** `/api/transactions/:id`

**Response:**
```json
{
  "success": true,
  "message": "Transaction cancelled successfully",
  "data": {
    "id": 1,
    "status": "cancelled",
    ...
  }
}
```

### 7. Get Transaction History
**GET** `/api/transactions/history`

**Query Parameters:**
- `transaction_type`: Filter by type
- `status`: Filter by status
- `date_from`: Start date
- `date_to`: End date

### 8. Get All Transactions (Admin)
**GET** `/api/transactions/all`

**Headers:**
```
Authorization: Bearer <admin_token>
```

## Model Methods

### Transaction.createTransaction(transactionData)
Creates a new transaction record.

**Parameters:**
```javascript
{
  item_id: Number,
  seller_id: Number,
  buyer_id: Number,
  transaction_type: 'sale' | 'donation' | 'swap',
  amount: Number | null
}
```

### Transaction.findById(id)
Retrieves transaction with complete item and user details.

### Transaction.findByUser(userId, role, page, limit)
Gets user's transactions with role filtering and pagination.

**Parameters:**
- `userId`: User ID
- `role`: 'buyer' | 'seller' | 'all'
- `page`: Page number
- `limit`: Items per page

### Transaction.updateStatus(id, status, userId)
Updates transaction status with authorization check.

### Transaction.getTransactionHistory(userId, filters)
Gets complete transaction history with filtering.

### Transaction.getTransactionStats(userId)
Calculates comprehensive transaction statistics.

### Transaction.cancelTransaction(id, userId)
Cancels a pending transaction with authorization.

## Business Logic

### Transaction Creation Process
1. **Validation**: Check item availability and user authorization
2. **Type Matching**: Ensure transaction type matches item listing type
3. **User Verification**: Prevent self-transactions
4. **Record Creation**: Create transaction with pending status
5. **Item Update**: Set item status to pending
6. **Notifications**: Send notifications to both parties

### Status Updates
- **Pending → Completed**: 
  - Set `completed_at` timestamp
  - Update item status (sold/donated/swapped)
  - Send completion notifications
  
- **Pending → Cancelled**:
  - Revert item status to available
  - Send cancellation notifications
  
- **Completed → Cannot Change**: Completed transactions are final

### Item Status Mapping
- **Sale Completed**: Item status → `sold`
- **Donation Completed**: Item status → `donated`
- **Swap Completed**: Item status → `swapped`
- **Transaction Cancelled**: Item status → `available`

## Security Features

### Authorization
- Users can only view/modify transactions they're involved in
- Sellers and buyers have equal rights to update status
- Admin users can view all transactions

### Validation
- Transaction type must match item listing type
- Users cannot create transactions for their own items
- Only pending transactions can be cancelled
- Amount validation for sale transactions

### Data Integrity
- Foreign key constraints ensure referential integrity
- Cascade deletes maintain consistency
- Status transitions are controlled and logged

## Integration Points

### With Item Management
- Automatic item status updates based on transaction status
- Item availability checks before transaction creation
- Item details included in transaction responses

### With Notification System
- Transaction creation notifications
- Status update notifications
- Cancellation notifications
- Real-time updates for both parties

### With User Management
- User details included in transaction responses
- Authorization based on user roles
- Profile information for transaction parties

## Error Handling

### Common Error Responses
```json
{
  "success": false,
  "message": "Error description"
}
```

### Error Scenarios
- **404**: Transaction/Item not found
- **403**: Not authorized to access/modify transaction
- **400**: Invalid transaction type, status, or missing required fields
- **409**: Item not available or already in transaction

## Performance Optimizations

### Database Indexes
- Composite indexes on seller_id + status
- Indexes on buyer_id, item_id, transaction_type
- Date-based indexes for reporting queries

### Query Optimization
- JOIN optimization for related data
- Pagination to limit result sets
- Selective field loading based on use case

### Caching Strategy
- Transaction statistics caching
- User transaction counts caching
- Recent transactions caching

## Usage Examples

### Frontend Integration
```javascript
// Create a sale transaction
const response = await fetch('/api/transactions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    item_id: 123,
    buyer_id: 456,
    transaction_type: 'sale'
  })
});

// Get user's selling history
const sellingHistory = await fetch('/api/transactions?role=seller&page=1&limit=10');

// Update transaction to completed
const updateResponse = await fetch('/api/transactions/1/status', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: 'completed'
  })
});
```

### Statistics Dashboard
```javascript
// Get comprehensive stats for dashboard
const stats = await fetch('/api/transactions/stats', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Display earnings, transactions count, etc.
const { sales, purchases, donations, swaps } = stats.data;
```

## Testing Considerations

### Unit Tests
- Model method testing with mock data
- Controller logic testing
- Validation testing for all scenarios

### Integration Tests
- End-to-end transaction flow testing
- Database constraint testing
- Authorization testing

### Performance Tests
- Large dataset query performance
- Concurrent transaction creation
- Statistics calculation performance

## Future Enhancements

### Planned Features
- **Escrow System**: Hold payments until completion
- **Rating System**: Rate transaction parties
- **Dispute Resolution**: Handle transaction disputes
- **Bulk Operations**: Process multiple transactions
- **Analytics Dashboard**: Advanced reporting and insights

### Technical Improvements
- **Real-time Updates**: WebSocket integration
- **Audit Trail**: Complete transaction history logging
- **Advanced Filtering**: More sophisticated search options
- **Export Functionality**: CSV/PDF export of transaction data
- **API Rate Limiting**: Prevent abuse and ensure fair usage
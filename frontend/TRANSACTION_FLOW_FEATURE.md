# Transaction Flow Feature Documentation

## Overview

A comprehensive "Buy Now" / "Request Donation" / "Request Exchange" flow that allows users to initiate transactions directly from the item detail page with confirmation modal, automatic message sending, and transaction creation.

## Features Implemented

### 1. Transaction Service ✅

**Location:** `frontend/src/services/transactionService.js`

**API Methods:**
- `createTransaction(data)` - Create new transaction
- `getTransactions()` - Get all user transactions
- `getTransactionById(id)` - Get specific transaction
- `updateTransactionStatus(id, status)` - Update transaction status
- `cancelTransaction(id)` - Cancel/delete transaction

### 2. ItemDetail Enhancements ✅

**Location:** `frontend/src/pages/ItemDetail.js`

**New Features:**
- **Dynamic Action Button** - Changes based on listing type
- **Confirmation Modal** - Shows before creating transaction
- **Pre-filled Message** - Context-aware default message
- **Transaction Creation** - Creates transaction record
- **Automatic Messaging** - Sends message to seller
- **Redirect to Messages** - Opens conversation after confirmation
- **Status Check** - Only shows for available items
- **Loading States** - Spinner during processing
- **Error Handling** - User-friendly error messages

## User Flow

### Complete Transaction Flow

```
1. User views item detail page
   ↓
2. Clicks action button (Buy Now / Request Donation / Request Exchange)
   ↓
3. Modal opens with:
   - Item details
   - Price (if selling)
   - Pre-filled message
   - What happens next info
   ↓
4. User reviews/edits message
   ↓
5. User clicks "Confirm"
   ↓
6. System creates transaction
   ↓
7. System sends message to seller
   ↓
8. Success notification shown
   ↓
9. Redirects to messages page
   ↓
10. Conversation opens with seller
```

## Action Buttons by Listing Type

### 1. For Sale Items

**Button:** "🛒 Buy Now"
- **Color:** Green (success)
- **Action:** Initiates purchase transaction
- **Default Message:** 
  ```
  Hi! I'm interested in buying "[Item Title]" for Rs. [Price]. 
  Is it still available?
  ```

### 2. Donation Items

**Button:** "🤲 Request Donation"
- **Color:** Green (success)
- **Action:** Requests donation
- **Default Message:**
  ```
  Hi! I would like to request "[Item Title]" as a donation. 
  Is it still available?
  ```

### 3. Exchange Items

**Button:** "🔄 Request Exchange"
- **Color:** Green (success)
- **Action:** Proposes exchange
- **Default Message:**
  ```
  Hi! I'm interested in exchanging items with you for "[Item Title]". 
  Is it still available?
  ```

## Modal Components

### Modal Header
```
┌─────────────────────────────────┐
│ 🛒 Confirm Buy Now          ✕  │
└─────────────────────────────────┘
```

### Modal Body
```
┌─────────────────────────────────┐
│ Item Title                      │
│ Price: Rs. 5,000               │
│                                 │
│ ℹ️ What happens next?          │
│ • Transaction request created   │
│ • Message sent to seller        │
│ • Redirected to messages        │
│ • Seller notified              │
│                                 │
│ Message to Seller:              │
│ ┌─────────────────────────────┐│
│ │ Hi! I'm interested in...    ││
│ │                             ││
│ │                             ││
│ └─────────────────────────────┘│
│ Introduce yourself...           │
└─────────────────────────────────┘
```

### Modal Footer
```
┌─────────────────────────────────┐
│ [Cancel]    [🛒 Confirm Buy Now]│
└─────────────────────────────────┘
```

## Technical Implementation

### Transaction Data Structure

```javascript
const transactionData = {
  item_id: 123,              // Item being transacted
  seller_id: 456,            // Item owner
  buyer_id: 789,             // Current user
  amount: 5000,              // Price (0 for donate/exchange)
  status: 'pending',         // Initial status
  transaction_type: 'sell'   // sell, donate, or exchange
};
```

### Create Transaction Flow

```javascript
const handleConfirmTransaction = async () => {
  setProcessingTransaction(true);

  try {
    // 1. Create transaction
    const transactionResponse = await createTransaction({
      item_id: item.id,
      seller_id: item.user_id,
      buyer_id: user.id,
      amount: item.listing_type === 'sell' ? item.price : 0,
      status: 'pending',
      transaction_type: item.listing_type
    });

    // 2. Send message to seller
    if (transactionMessage.trim()) {
      await sendMessage(
        item.user_id,
        transactionMessage,
        item.id
      );
    }

    // 3. Show success
    alert('Request sent successfully!');

    // 4. Redirect to messages
    navigate(`/messages?user=${item.user_id}&item=${item.id}`);
  } catch (err) {
    setError('Failed to process request');
  } finally {
    setProcessingTransaction(false);
  }
};
```

### Dynamic Action Label

```javascript
const getActionLabel = () => {
  switch (item?.listing_type) {
    case 'sell':
      return 'Buy Now';
    case 'donate':
      return 'Request Donation';
    case 'exchange':
      return 'Request Exchange';
    default:
      return 'Request';
  }
};
```

### Dynamic Action Icon

```javascript
const getActionIcon = () => {
  switch (item?.listing_type) {
    case 'sell':
      return <FaShoppingCart className="me-2" />;
    case 'donate':
      return <FaHandHoldingHeart className="me-2" />;
    case 'exchange':
      return <FaExchangeAlt className="me-2" />;
    default:
      return null;
  }
};
```

## State Management

### Component State

```javascript
// Transaction modal state
const [showModal, setShowModal] = useState(false);
const [transactionMessage, setTransactionMessage] = useState('');
const [processingTransaction, setProcessingTransaction] = useState(false);
```

### Modal Visibility

```javascript
// Open modal
const handleInitiateTransaction = () => {
  if (!isAuthenticated()) {
    navigate('/login');
    return;
  }
  
  setTransactionMessage(getDefaultMessage());
  setShowModal(true);
};

// Close modal
setShowModal(false);
```

## API Integration

### Backend Endpoints

```
POST   /api/transactions              - Create transaction
GET    /api/transactions              - Get all transactions
GET    /api/transactions/:id          - Get specific transaction
PUT    /api/transactions/:id/status   - Update status
DELETE /api/transactions/:id          - Cancel transaction
```

### Request/Response

**Create Transaction:**
```javascript
POST /api/transactions
Headers: Authorization: Bearer <token>
Body: {
  item_id: 123,
  seller_id: 456,
  buyer_id: 789,
  amount: 5000,
  status: "pending",
  transaction_type: "sell"
}

Response: {
  success: true,
  message: "Transaction created successfully",
  data: {
    id: 1,
    item_id: 123,
    seller_id: 456,
    buyer_id: 789,
    amount: 5000,
    status: "pending",
    transaction_type: "sell",
    created_at: "2024-01-01T12:00:00Z"
  }
}
```

## Validation & Error Handling

### Client-Side Validation

1. **Authentication Check**
   ```javascript
   if (!isAuthenticated()) {
     navigate('/login');
     return;
   }
   ```

2. **Message Required**
   ```javascript
   disabled={!transactionMessage.trim()}
   ```

3. **Item Availability**
   ```javascript
   {item.status === 'available' && (
     // Show action button
   )}
   ```

4. **Owner Check**
   ```javascript
   {!isOwner && (
     // Show action button
   )}
   ```

### Error Handling

```javascript
try {
  await createTransaction(data);
  await sendMessage(message);
  // Success
} catch (err) {
  setError(err.response?.data?.message || 'Failed to process request');
}
```

### Error Messages

- "Failed to process request. Please try again."
- "This item is no longer available."
- "You must be logged in to perform this action."
- "Message cannot be empty."

## User Experience

### Success Flow

1. ✅ Transaction created
2. ✅ Message sent
3. ✅ Success alert shown
4. ✅ Redirected to messages
5. ✅ Conversation opened

### Error Flow

1. ❌ Error occurs
2. ❌ Error message displayed
3. ❌ Modal stays open
4. ❌ User can retry

### Loading States

```javascript
{processingTransaction ? (
  <>
    <Spinner animation="border" size="sm" />
    Processing...
  </>
) : (
  'Confirm Buy Now'
)}
```

## Button States

### Available Item (Non-Owner)

```
[🛒 Buy Now]           ← Primary action
[✉️ Contact Seller]    ← Secondary action
[❤️ Add to Favorites]  ← Tertiary action
```

### Unavailable Item (Non-Owner)

```
⚠️ This item is no longer available.
[✉️ Contact Seller]    ← Only contact option
[❤️ Add to Favorites]  ← Can still favorite
```

### Owner View

```
[✏️ Edit Item]         ← Edit action
[🗑️ Delete Item]       ← Delete action
```

## Notifications

### Seller Notifications

When a transaction is created:
1. **In-app notification** - "New transaction request for [Item]"
2. **Message notification** - "New message from [Buyer]"
3. **Email notification** (optional) - Transaction request email

### Buyer Notifications

After transaction creation:
1. **Success alert** - "Request sent successfully!"
2. **Redirect notification** - "Redirecting to messages..."

## Security Considerations

### 1. Authentication

- All actions require valid JWT token
- Unauthenticated users redirected to login
- Token validated on every API call

### 2. Authorization

- Users can only create transactions as buyers
- Cannot buy own items
- Backend validates user permissions

### 3. Data Validation

- Item ID validated
- Seller ID validated
- Amount validated (non-negative)
- Status validated (enum)
- Message sanitized

### 4. Rate Limiting

- Prevent spam transactions
- Limit requests per minute
- Implement on backend

## Performance Optimizations

### 1. Optimistic UI

```javascript
// Show success immediately
alert('Request sent successfully!');

// Then redirect
setTimeout(() => navigate('/messages'), 1000);
```

### 2. Async Operations

```javascript
// Create transaction and send message in parallel
await Promise.all([
  createTransaction(data),
  sendMessage(message)
]);
```

### 3. Modal Lazy Loading

```javascript
// Modal only renders when shown
{showModal && <Modal>...</Modal>}
```

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## Testing Checklist

### Manual Testing

- [x] Click Buy Now button
- [x] Click Request Donation button
- [x] Click Request Exchange button
- [x] Modal opens correctly
- [x] Default message populated
- [x] Edit message
- [x] Confirm transaction
- [x] Transaction created
- [x] Message sent
- [x] Redirect to messages
- [x] Error handling works
- [x] Loading states display
- [x] Cancel button works
- [x] Close modal (X button)
- [x] Unavailable item handling
- [x] Owner cannot buy own item
- [x] Unauthenticated redirect

### Edge Cases

- [x] Empty message (button disabled)
- [x] Very long message
- [x] Network timeout
- [x] Transaction creation fails
- [x] Message sending fails
- [x] Item deleted during transaction
- [x] Rapid button clicking
- [x] Browser back during process

## Future Enhancements

### Planned Features

- [ ] Payment integration (for sell items)
- [ ] Escrow system
- [ ] Transaction history page
- [ ] Transaction status tracking
- [ ] Buyer/seller ratings
- [ ] Transaction disputes
- [ ] Automatic item status update
- [ ] Transaction analytics
- [ ] Bulk transactions
- [ ] Transaction templates

### Performance Improvements

- [ ] WebSocket for real-time updates
- [ ] Transaction caching
- [ ] Optimistic transaction creation
- [ ] Background message sending
- [ ] Transaction queue system

## Troubleshooting

### Transaction not creating

1. Check authentication token
2. Verify item exists and is available
3. Check backend API is running
4. Look for console errors
5. Verify transaction data format

### Message not sending

1. Check message service
2. Verify seller ID is valid
3. Check message content
4. Look for API errors
5. Test message endpoint separately

### Redirect not working

1. Check navigate function
2. Verify messages route exists
3. Check URL parameters
4. Test navigation manually
5. Look for JavaScript errors

### Modal not opening

1. Check showModal state
2. Verify button onClick handler
3. Check Bootstrap Modal import
4. Look for CSS conflicts
5. Test modal independently

## Related Files

### Frontend

- `frontend/src/pages/ItemDetail.js` - Main implementation
- `frontend/src/services/transactionService.js` - API service
- `frontend/src/services/messageService.js` - Message sending
- `frontend/src/pages/Messages.js` - Redirect destination

### Backend

- `backend/controllers/transactionController.js` - Transaction logic
- `backend/routes/transactionRoutes.js` - API routes
- `backend/models/Transaction.js` - Database model
- `backend/controllers/messageController.js` - Message logic

### Database

- `transactions` table - Stores transaction records
- Columns: id, item_id, seller_id, buyer_id, amount, status, transaction_type, created_at

## Support

For issues or questions:
1. Check browser console for errors
2. Verify backend API is running
3. Check authentication status
4. Review this documentation
5. Test with different listing types

## License

Part of ShareHub project - Share, Sell, and Donate platform

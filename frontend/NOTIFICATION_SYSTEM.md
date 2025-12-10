# Notification System Documentation

## Overview

A comprehensive notification system with a bell icon in the navbar showing unread count, dropdown with recent notifications, and a dedicated notifications page.

## Features Implemented

### 1. NotificationBell Component ✅

**Location:** `frontend/src/components/NotificationBell.js`

**Features:**
- Bell icon in navbar with unread count badge
- Dropdown showing 10 most recent notifications
- Click notification to navigate to related content
- Mark individual notifications as read
- Mark all notifications as read
- Auto-polling every 30 seconds for new notifications
- Emoji icons for different notification types
- Relative time display (e.g., "5m ago")
- Loading states
- Empty state message
- "View All Notifications" link

**Visual:**
```
Navbar: [🔔 3]  ← Bell with badge
         ↓
    ┌─────────────────────────┐
    │ 🔔 Notifications [3] ✓✓│
    ├─────────────────────────┤
    │ 💬 New message          │
    │    John sent you...     │
    │    5m ago          [✓]  │
    ├─────────────────────────┤
    │ 💰 Transaction complete │
    │    Your item sold...    │
    │    1h ago          [✓]  │
    ├─────────────────────────┤
    │ View All Notifications →│
    └─────────────────────────┘
```

### 2. Notifications Page ✅

**Location:** `frontend/src/pages/Notifications.js`

**Features:**
- Full list of all notifications
- Filter by: All, Unread, Read
- Unread count badge in header
- Mark all as read button
- Mark individual as read
- Delete notifications
- Click to navigate to related content
- Emoji icons for notification types
- Full timestamp display
- Visual distinction for unread (blue border)
- Empty states for each filter
- Responsive design

**Route:** `/notifications` (Protected)

### 3. Notification Service ✅

**Location:** `frontend/src/services/notificationService.js`

**API Methods:**
- `getNotifications()` - Get all notifications
- `getUnreadCount()` - Get unread count
- `markAsRead(id)` - Mark single as read
- `markAllAsRead()` - Mark all as read
- `deleteNotification(id)` - Delete notification

### 4. Navbar Integration ✅

**Location:** `frontend/src/components/Navbar.js`

**Features:**
- NotificationBell component integrated
- Replaces old notification link
- Aligned with other nav items
- Responsive design

## Notification Types

### Supported Types

| Type | Icon | Description | Navigation |
|------|------|-------------|------------|
| `message` | 💬 | New message received | `/messages` |
| `transaction` | 💰 | Transaction update | `/transactions` |
| `favorite` | ❤️ | Item favorited | Item detail |
| `item` | 📦 | Item-related | Item detail |
| `system` | 🔔 | System notification | Custom link |
| `default` | 📢 | Other | Custom link |

### Notification Object Structure

```javascript
{
  id: 1,
  user_id: 123,
  type: "message",
  title: "New Message",
  message: "John sent you a message",
  link: "/messages",
  item_id: 456,
  is_read: false,
  created_at: "2024-01-01T12:00:00Z"
}
```

## User Experience Flow

### Receiving Notification

1. Backend creates notification
2. **Polling**: Frontend checks every 30 seconds
3. **Badge Update**: Unread count updates
4. **Bell Animation**: Badge pulses
5. User clicks bell icon
6. **Dropdown Opens**: Shows recent notifications
7. User sees new notification (blue background)

### Reading Notification

1. User clicks notification in dropdown
2. **Mark as Read**: API call sent
3. **UI Update**: Badge count decreases
4. **Navigation**: Redirects to related content
5. **Background Update**: Notification marked read

### Viewing All Notifications

1. User clicks "View All Notifications"
2. **Navigate**: Goes to `/notifications` page
3. **Full List**: Shows all notifications
4. **Filters**: Can filter by status
5. **Actions**: Mark as read or delete

## Technical Implementation

### Polling Mechanism

```javascript
useEffect(() => {
  fetchUnreadCount();
  
  // Poll every 30 seconds
  const interval = setInterval(() => {
    fetchUnreadCount();
  }, 30000);

  return () => clearInterval(interval);
}, []);
```

### Mark as Read

```javascript
const handleMarkAsRead = async (notificationId) => {
  try {
    await markAsRead(notificationId);
    
    // Update local state
    setNotifications(notifications.map(notif => 
      notif.id === notificationId 
        ? { ...notif, is_read: true } 
        : notif
    ));
    
    // Update count
    setUnreadCount(prev => Math.max(0, prev - 1));
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Navigation Logic

```javascript
const handleNotificationClick = async (notification) => {
  // Mark as read
  if (!notification.is_read) {
    await markAsRead(notification.id);
  }

  // Navigate based on type
  if (notification.link) {
    navigate(notification.link);
  } else if (notification.item_id) {
    navigate(`/items/${notification.item_id}`);
  } else if (notification.type === 'message') {
    navigate('/messages');
  }
};
```

### Time Formatting

```javascript
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return date.toLocaleDateString();
};
```

## State Management

### NotificationBell State

```javascript
const [notifications, setNotifications] = useState([]);
const [unreadCount, setUnreadCount] = useState(0);
const [loading, setLoading] = useState(false);
const [show, setShow] = useState(false);
```

### Notifications Page State

```javascript
const [notifications, setNotifications] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [filter, setFilter] = useState('all');
```

## API Integration

### Backend Endpoints

```
GET    /api/notifications              - Get all notifications
GET    /api/notifications/unread-count - Get unread count
PUT    /api/notifications/:id/read     - Mark as read
PUT    /api/notifications/mark-all-read - Mark all as read
DELETE /api/notifications/:id          - Delete notification
```

### Request/Response Examples

**Get Notifications:**
```javascript
GET /api/notifications
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  data: [
    {
      id: 1,
      type: "message",
      title: "New Message",
      message: "John sent you a message",
      is_read: false,
      created_at: "2024-01-01T12:00:00Z"
    }
  ]
}
```

**Get Unread Count:**
```javascript
GET /api/notifications/unread-count
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  unreadCount: 5
}
```

**Mark as Read:**
```javascript
PUT /api/notifications/1/read
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  message: "Notification marked as read"
}
```

## Styling

### CSS Classes

```css
.notification-bell-toggle        - Bell icon button
.notification-dropdown-menu      - Dropdown container
.notification-header             - Dropdown header
.notification-list               - Scrollable list
.notification-item               - Individual notification
.notification-item.unread        - Unread notification (blue)
.notification-footer             - Dropdown footer
```

### Animations

```css
/* Bell shake animation */
@keyframes bellShake {
  0%, 100% { transform: rotate(0deg); }
  10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg); }
  20%, 40%, 60%, 80% { transform: rotate(10deg); }
}

/* Badge pulse animation */
@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

### Responsive Design

- **Desktop**: Full dropdown (380px width)
- **Tablet**: Slightly narrower (320px)
- **Mobile**: Optimized touch targets

## Performance Optimizations

### 1. Polling Interval

```javascript
// 30 seconds - balance between real-time and server load
const POLLING_INTERVAL = 30000;
```

**Recommendations:**
- 15 seconds: More real-time, higher load
- 30 seconds: Good balance (recommended)
- 60 seconds: Less real-time, lower load

### 2. Lazy Loading

```javascript
// Only fetch notifications when dropdown opens
useEffect(() => {
  if (show) {
    fetchNotifications();
  }
}, [show]);
```

### 3. Limited Results

```javascript
// Show only 10 most recent in dropdown
setNotifications(response.data.slice(0, 10));
```

### 4. Optimistic Updates

```javascript
// Update UI immediately, revert on error
setUnreadCount(prev => Math.max(0, prev - 1));
```

## Security Considerations

### 1. Authentication

- All endpoints require valid JWT token
- User can only see their own notifications
- Backend validates user ownership

### 2. XSS Prevention

- Notification content sanitized
- No HTML rendering in messages
- Safe navigation handling

### 3. Rate Limiting

- Polling interval prevents spam
- Backend should implement rate limits
- Prevent notification flooding

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## Testing Checklist

### Manual Testing

- [x] Bell icon displays in navbar
- [x] Unread count badge shows correct number
- [x] Click bell opens dropdown
- [x] Dropdown shows recent notifications
- [x] Click notification navigates correctly
- [x] Mark as read works
- [x] Mark all as read works
- [x] Unread count updates
- [x] Polling fetches new notifications
- [x] View all notifications link works
- [x] Notifications page displays all
- [x] Filter buttons work
- [x] Delete notification works
- [x] Empty states display correctly
- [x] Loading states work
- [x] Responsive on mobile

### Edge Cases

- [x] No notifications (empty state)
- [x] All notifications read
- [x] Very long notification text
- [x] Rapid clicking
- [x] Network timeout
- [x] Invalid notification ID
- [x] Deleted notification
- [x] Concurrent updates

## Future Enhancements

### Planned Features

- [ ] WebSocket for real-time notifications
- [ ] Push notifications (browser API)
- [ ] Notification preferences/settings
- [ ] Notification categories
- [ ] Notification sound
- [ ] Notification grouping
- [ ] Notification search
- [ ] Notification archive
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Notification templates
- [ ] Rich notifications (images, actions)

### Performance Improvements

- [ ] WebSocket instead of polling
- [ ] Service worker for background sync
- [ ] IndexedDB for offline storage
- [ ] Virtual scrolling for large lists
- [ ] Pagination for notifications page
- [ ] Notification caching

## Troubleshooting

### Badge not updating

1. Check polling is running
2. Verify API endpoint works
3. Check authentication token
4. Look for console errors
5. Check network tab

### Dropdown not opening

1. Check Bootstrap is loaded
2. Verify component is mounted
3. Check for JavaScript errors
4. Test click handler
5. Check z-index conflicts

### Notifications not loading

1. Verify API is running
2. Check authentication
3. Look for CORS errors
4. Check response format
5. Verify data structure

### Navigation not working

1. Check notification has link/item_id
2. Verify navigation logic
3. Check route exists
4. Test with different types
5. Check browser console

## Related Files

### Frontend

- `frontend/src/components/NotificationBell.js` - Bell component
- `frontend/src/components/NotificationBell.css` - Styles
- `frontend/src/pages/Notifications.js` - Full page
- `frontend/src/services/notificationService.js` - API service
- `frontend/src/components/Navbar.js` - Integration
- `frontend/src/App.js` - Route configuration

### Backend

- `backend/controllers/notificationController.js` - Logic
- `backend/routes/notificationRoutes.js` - Routes
- `backend/models/Notification.js` - Database model

### Database

- `notifications` table
- Columns: id, user_id, type, title, message, link, item_id, is_read, created_at

## Support

For issues or questions:
1. Check browser console for errors
2. Verify backend API is running
3. Check authentication status
4. Review this documentation
5. Check network tab for failed requests

## License

Part of ShareHub project - Share, Sell, and Donate platform

# Messages Component - Real-time Messaging System

A comprehensive real-time messaging component with polling, notifications, and unread message tracking.

## Features

✅ **Real-time Polling** - Fetches new messages every 5 seconds  
✅ **Toast Notifications** - In-app notifications for new messages  
✅ **Desktop Notifications** - Browser notifications (with permission)  
✅ **Audio Alerts** - Subtle sound on new message  
✅ **Unread Count** - Badge showing unread message count  
✅ **Document Title Update** - Shows unread count in browser tab  
✅ **Auto-scroll** - Automatically scrolls to latest message  
✅ **Mark as Read** - Automatically marks messages as read when viewed  
✅ **Conversation List** - Shows all conversations with preview  
✅ **Real-time Updates** - Updates without page refresh  

## How It Works

### 1. Polling Mechanism

```javascript
useEffect(() => {
  fetchConversations();
  
  // Poll every 5 seconds
  const interval = setInterval(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.other_user_id, selectedConversation.item_id, true);
    }
    fetchConversations(true);
  }, 5000);

  // Cleanup on unmount
  return () => {
    clearInterval(interval);
    document.title = originalTitle.current;
  };
}, [selectedConversation]);
```

**Key Points:**
- Polls every 5 seconds (5000ms)
- Only polls active conversation messages
- Always polls conversation list
- Cleans up interval on component unmount
- Restores original document title on unmount

### 2. New Message Detection

The component detects new messages in two ways:

#### A. In Active Conversation
```javascript
if (isPolling && messages.length > 0 && newMessages.length > messages.length) {
  const latestMessage = newMessages[newMessages.length - 1];
  
  // Only notify if from other user
  if (latestMessage.sender_id !== user.id) {
    showNotification(...);
    playNotificationSound();
  }
}
```

#### B. In Conversation List
```javascript
if (isPolling && conversations.length > 0) {
  const oldUnreadCount = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);
  
  if (unreadCount > oldUnreadCount) {
    // New message in another conversation
    showNotification(newConv);
    playNotificationSound();
  }
}
```

### 3. Notification System

#### Toast Notifications (In-App)
- Appears in top-right corner
- Shows sender name, message preview, and item context
- Auto-hides after 5 seconds
- Can be manually dismissed

#### Desktop Notifications
- Requires user permission
- Shows even when tab is not active
- Includes sender name and message preview
- Uses browser's native notification system

#### Audio Alerts
- Plays subtle notification sound
- Only plays for new messages from others
- Gracefully handles audio playback errors

### 4. Unread Count Tracking

#### Total Unread Count
```javascript
const unreadCount = conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
setTotalUnreadCount(unreadCount);
```

#### Document Title Update
```javascript
useEffect(() => {
  if (totalUnreadCount > 0) {
    document.title = `(${totalUnreadCount}) ${originalTitle.current}`;
  } else {
    document.title = originalTitle.current;
  }
}, [totalUnreadCount]);
```

### 5. Auto Mark as Read

When viewing a conversation:
```javascript
const unreadIds = newMessages
  .filter(msg => msg.receiver_id === user.id && !msg.is_read)
  .map(msg => msg.id);

if (unreadIds.length > 0) {
  await markAsRead(unreadIds);
  fetchConversations(); // Refresh to update counts
}
```

## User Interface

### Conversation List (Left Panel)
- Shows all conversations
- Displays last message preview
- Shows unread count badge
- Highlights selected conversation
- Shows timestamp of last message

### Chat Window (Right Panel)
- Shows conversation header with user name and item context
- Displays all messages in chronological order
- Differentiates sent/received messages with colors
- Auto-scrolls to latest message
- Message input at bottom

### Notification Components
- Toast notification in top-right
- Bell icon button to enable desktop notifications
- Unread count badge in header

## Notification Permission

### Request Permission
```javascript
const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
};
```

### Check Permission Status
- `granted` - Notifications will show
- `denied` - Notifications blocked
- `default` - Not yet requested

### Enable Notifications
1. Click the bell icon in the Messages header
2. Browser will prompt for permission
3. Click "Allow" to enable desktop notifications

## Performance Considerations

### Polling Interval
- **5 seconds** - Good balance between real-time and server load
- Can be adjusted based on needs:
  - 3 seconds - More real-time, higher load
  - 10 seconds - Less real-time, lower load

### Optimization Tips
1. **Conditional Polling**: Only polls when component is mounted
2. **Smart Updates**: Only shows notifications for new messages
3. **Cleanup**: Clears interval on unmount
4. **Efficient Queries**: Backend should use indexed queries

### Memory Management
- Clears interval on unmount
- Removes event listeners
- Resets state appropriately

## API Endpoints Used

### Get Conversations
```javascript
GET /api/messages/conversations
Response: [
  {
    other_user_id: 123,
    other_user_name: "John Doe",
    item_id: 456,
    item_title: "Item Name",
    last_message: "Hello!",
    last_message_time: "2024-01-01T12:00:00Z",
    unread_count: 2
  }
]
```

### Get Conversation Messages
```javascript
GET /api/messages/conversation/:userId?itemId=456
Response: [
  {
    id: 1,
    sender_id: 123,
    receiver_id: 456,
    message_text: "Hello!",
    is_read: false,
    created_at: "2024-01-01T12:00:00Z"
  }
]
```

### Send Message
```javascript
POST /api/messages
Body: {
  receiver_id: 123,
  message_text: "Hello!",
  item_id: 456
}
```

### Mark as Read
```javascript
PUT /api/messages/read
Body: {
  message_ids: [1, 2, 3]
}
```

## Browser Compatibility

### Polling
- ✅ All modern browsers
- Uses standard `setInterval`

### Desktop Notifications
- ✅ Chrome 22+
- ✅ Firefox 22+
- ✅ Safari 6+
- ✅ Edge 14+
- ❌ IE (not supported)

### Audio Playback
- ✅ All modern browsers
- Gracefully degrades if audio fails

## Troubleshooting

### Notifications Not Showing

**Desktop Notifications:**
1. Check browser permission status
2. Click bell icon to request permission
3. Check browser notification settings
4. Ensure site is not muted

**Toast Notifications:**
1. Should always work (no permission needed)
2. Check browser console for errors
3. Verify component is mounted

### Polling Not Working

1. Check browser console for errors
2. Verify backend API is running
3. Check network tab for failed requests
4. Ensure authentication token is valid

### Messages Not Updating

1. Check polling interval is running
2. Verify API responses are successful
3. Check for JavaScript errors
4. Ensure conversation is selected

### Audio Not Playing

1. Some browsers block autoplay
2. User interaction may be required first
3. Check browser audio settings
4. Audio is optional - won't break functionality

## Customization

### Change Polling Interval
```javascript
const POLLING_INTERVAL = 5000; // Change to desired milliseconds

const interval = setInterval(() => {
  // polling logic
}, POLLING_INTERVAL);
```

### Disable Audio Notifications
```javascript
// Comment out or remove:
playNotificationSound();
```

### Customize Notification Duration
```javascript
<Toast 
  autohide
  delay={5000} // Change to desired milliseconds
>
```

### Change Notification Position
```javascript
<ToastContainer 
  position="top-end" // Options: top-start, top-center, top-end, etc.
  className="p-3"
>
```

## Security Considerations

1. **Authentication**: All API calls require valid JWT token
2. **Authorization**: Users can only see their own conversations
3. **XSS Prevention**: Messages are sanitized before display
4. **Rate Limiting**: Backend should implement rate limiting
5. **Input Validation**: Message text is validated before sending

## Future Enhancements

Potential improvements:
- WebSocket for true real-time messaging
- Typing indicators
- Read receipts
- Message reactions
- File attachments
- Voice messages
- Message search
- Conversation archiving
- Block/report users
- Message encryption

## Related Components

- `messageService.js` - API service for messages
- `AuthContext.js` - User authentication
- `Navbar.js` - Shows unread message count

## Testing

### Manual Testing Checklist
- [ ] Send message to another user
- [ ] Receive message from another user
- [ ] Check toast notification appears
- [ ] Check desktop notification (if enabled)
- [ ] Verify audio plays
- [ ] Check unread count updates
- [ ] Verify document title updates
- [ ] Test mark as read functionality
- [ ] Check polling continues in background
- [ ] Verify cleanup on unmount

### Test Scenarios
1. **New Message in Active Conversation**
   - Open conversation
   - Have another user send message
   - Should see toast, hear sound, message appears

2. **New Message in Different Conversation**
   - Open conversation A
   - Receive message in conversation B
   - Should see toast, unread badge updates

3. **Multiple New Messages**
   - Receive several messages quickly
   - Should handle gracefully without spam

4. **Permission Denied**
   - Deny notification permission
   - Toast notifications should still work

## Performance Metrics

- **Polling Overhead**: ~1-2 KB per request
- **Memory Usage**: Minimal (cleans up properly)
- **CPU Usage**: Negligible
- **Network**: 12 requests per minute (5s interval)

## Best Practices

1. **Always clean up intervals** on component unmount
2. **Check permissions** before showing desktop notifications
3. **Handle errors gracefully** in polling functions
4. **Don't spam notifications** - check for actual new messages
5. **Restore document title** on unmount
6. **Use refs** for values that don't need re-renders
7. **Optimize re-renders** with proper dependency arrays

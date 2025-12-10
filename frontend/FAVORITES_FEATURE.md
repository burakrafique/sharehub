# Favorites Feature Documentation

## Overview

The Favorites feature allows users to save items they're interested in for easy access later. Users can add/remove items from favorites with a single click, and view all their favorited items in one place.

## Features Implemented

### 1. Favorite Button in ItemCard ✅

**Location:** `frontend/src/components/ItemCard.js`

**Features:**
- Heart icon button in top-right corner of item card
- Filled red heart when favorited
- Outline heart when not favorited
- Click to toggle favorite status
- Optimistic UI updates (instant feedback)
- Loading spinner during API call
- Tooltip on hover
- Prevents card click when clicking favorite button

**Visual States:**
```
Not Favorited: ♡ (outline heart)
Favorited:     ♥ (filled red heart)
Loading:       ⟳ (spinner)
```

**Code Example:**
```jsx
<ItemCard 
  item={item} 
  onFavoriteToggle={(itemId, isFavorited) => {
    console.log(`Item ${itemId} favorited: ${isFavorited}`);
  }}
/>
```

### 2. Favorite Button in ItemDetail ✅

**Location:** `frontend/src/pages/ItemDetail.js`

**Features:**
- Large favorite button below "Contact Seller"
- Shows "Add to Favorites" or "Remove from Favorites"
- Red button when favorited, outline when not
- Loading state with spinner
- Optimistic UI updates
- Only visible to non-owners
- Redirects to login if not authenticated

**Visual:**
```
Not Favorited:
┌─────────────────────────────┐
│ ♡ Add to Favorites          │
└─────────────────────────────┘

Favorited:
┌─────────────────────────────┐
│ ♥ Remove from Favorites     │
└─────────────────────────────┘
```

### 3. Favorites Page ✅

**Location:** `frontend/src/pages/Favorites.js`

**Features:**
- Displays all favorited items in grid layout
- Shows count of favorited items
- Empty state with call-to-action
- Remove items by clicking heart icon
- Responsive grid (1-4 columns based on screen size)
- Loading state
- Error handling

**Route:** `/favorites` (Protected - requires authentication)

### 4. Favorite Service ✅

**Location:** `frontend/src/services/favoriteService.js`

**API Methods:**
- `getFavorites()` - Get all user's favorites
- `addFavorite(itemId)` - Add item to favorites
- `removeFavorite(itemId)` - Remove item from favorites
- `isFavorited(itemId)` - Check if item is favorited
- `toggleFavorite(itemId, isFavorited)` - Toggle favorite status

## User Experience Flow

### Adding to Favorites

1. User views an item (card or detail page)
2. User clicks heart icon
3. **Optimistic update**: Heart fills immediately (red)
4. **API call**: Request sent to backend
5. **Success**: State persists
6. **Error**: Heart reverts to outline, error shown

### Removing from Favorites

1. User clicks filled heart icon
2. **Optimistic update**: Heart becomes outline immediately
3. **API call**: Request sent to backend
4. **Success**: State persists
5. **Error**: Heart reverts to filled, error shown

### Viewing Favorites

1. User clicks "Favorites" in navbar
2. Page loads with spinner
3. Favorites fetched from API
4. Grid displays all favorited items
5. User can click heart to remove items
6. Removed items disappear from list immediately

## Technical Implementation

### Optimistic UI Updates

The feature uses optimistic UI updates for instant feedback:

```javascript
const handleFavoriteToggle = async () => {
  // 1. Save previous state
  const previousState = isFavorited;
  
  // 2. Update UI immediately
  setIsFavorited(!isFavorited);
  setLoading(true);

  try {
    // 3. Make API call
    await toggleFavorite(itemId, isFavorited);
    
    // 4. Success - state already updated
  } catch (error) {
    // 5. Error - revert to previous state
    setIsFavorited(previousState);
    showError('Failed to update favorite');
  } finally {
    setLoading(false);
  }
};
```

### State Management

**ItemCard:**
```javascript
const [isFavorited, setIsFavorited] = useState(item.is_favorited || false);
const [isLoading, setIsLoading] = useState(false);
```

**ItemDetail:**
```javascript
const [isFavorited, setIsFavorited] = useState(false);
const [favoriteLoading, setFavoriteLoading] = useState(false);
```

**Favorites Page:**
```javascript
const [favorites, setFavorites] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
```

### API Integration

**Backend Endpoints:**
```
GET    /api/favorites              - Get all favorites
POST   /api/favorites              - Add favorite
DELETE /api/favorites/:itemId      - Remove favorite
GET    /api/favorites/check/:itemId - Check if favorited
```

**Request/Response:**
```javascript
// Add Favorite
POST /api/favorites
Body: { item_id: 123 }
Response: { success: true, message: "Added to favorites" }

// Remove Favorite
DELETE /api/favorites/123
Response: { success: true, message: "Removed from favorites" }

// Get Favorites
GET /api/favorites
Response: {
  success: true,
  data: [
    {
      id: 123,
      title: "Item Title",
      description: "...",
      price: 1000,
      is_favorited: true,
      ...
    }
  ]
}
```

## Component Props

### ItemCard

```typescript
interface ItemCardProps {
  item: {
    id: number;
    title: string;
    description: string;
    price?: number;
    category: string;
    listing_type: string;
    item_condition: string;
    address: string;
    is_favorited?: boolean;
    images?: Array<{url: string}>;
  };
  onFavoriteToggle?: (itemId: number, isFavorited: boolean) => void;
}
```

### Favorites Page

No props - standalone page component

## Authentication

### Required
- User must be logged in to favorite items
- Unauthenticated users redirected to login page
- JWT token sent with all API requests

### Behavior
```javascript
if (!isAuthenticated()) {
  navigate('/login');
  return;
}
```

## Error Handling

### Network Errors
- Shows error message to user
- Reverts optimistic UI update
- Logs error to console
- Allows retry

### API Errors
- 401 Unauthorized: Redirect to login
- 404 Not Found: Item doesn't exist
- 500 Server Error: Show generic error message

### Example
```javascript
try {
  await toggleFavorite(itemId, isFavorited);
} catch (error) {
  if (error.response?.status === 401) {
    navigate('/login');
  } else {
    setError('Failed to update favorite. Please try again.');
  }
  setIsFavorited(previousState); // Revert
}
```

## Performance Optimizations

### 1. Optimistic Updates
- Instant UI feedback
- No waiting for API response
- Better perceived performance

### 2. Debouncing (Optional)
```javascript
// Prevent rapid clicking
const debouncedToggle = debounce(toggleFavorite, 300);
```

### 3. Caching
- Favorites list cached in state
- Only refetch when necessary
- Reduces API calls

### 4. Lazy Loading
- Favorites page loads on demand
- Not loaded until user navigates to it

## Styling

### Colors
- **Favorited**: Red (#dc3545)
- **Not Favorited**: Gray outline
- **Hover**: Slight scale effect

### Animations
```css
.favorite-button {
  transition: transform 0.2s;
}

.favorite-button:hover {
  transform: scale(1.1);
}
```

### Responsive Design
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## Testing Checklist

### Manual Testing
- [x] Click heart on item card
- [x] Click heart on item detail page
- [x] View favorites page
- [x] Remove item from favorites
- [x] Add multiple items to favorites
- [x] Test with no favorites (empty state)
- [x] Test while not logged in (redirect)
- [x] Test network error handling
- [x] Test optimistic UI updates
- [x] Test loading states
- [x] Test on mobile devices

### Edge Cases
- [x] Rapid clicking (prevent double-toggle)
- [x] Network timeout
- [x] Item deleted while favorited
- [x] Concurrent favorites from different devices
- [x] Browser back/forward navigation
- [x] Page refresh

## Future Enhancements

### Planned Features
- [ ] Favorite collections/folders
- [ ] Share favorites list
- [ ] Favorite notifications (price drops, etc.)
- [ ] Favorite statistics
- [ ] Export favorites
- [ ] Favorite notes/tags
- [ ] Sort/filter favorites
- [ ] Bulk actions (remove multiple)

### Performance Improvements
- [ ] Implement virtual scrolling for large lists
- [ ] Add pagination to favorites page
- [ ] Cache favorites in localStorage
- [ ] Implement WebSocket for real-time updates
- [ ] Add service worker for offline support

## Troubleshooting

### Heart icon not changing
1. Check browser console for errors
2. Verify API endpoint is accessible
3. Check authentication token is valid
4. Ensure item ID is correct

### Favorites not persisting
1. Check backend database connection
2. Verify API is saving to database
3. Check for duplicate entries
4. Ensure user ID is correct

### Page not loading
1. Check authentication status
2. Verify route is protected
3. Check API response format
4. Look for JavaScript errors

### Optimistic update not reverting
1. Check error handling logic
2. Verify previousState is saved
3. Ensure catch block is executed
4. Check state update timing

## Related Files

### Frontend
- `frontend/src/services/favoriteService.js` - API service
- `frontend/src/components/ItemCard.js` - Card with favorite button
- `frontend/src/pages/ItemDetail.js` - Detail page with favorite button
- `frontend/src/pages/Favorites.js` - Favorites list page
- `frontend/src/App.js` - Route configuration

### Backend
- `backend/controllers/favoriteController.js` - Business logic
- `backend/routes/favoriteRoutes.js` - API routes
- `backend/models/Favorite.js` - Database model
- `backend/middleware/authMiddleware.js` - Authentication

### Database
- `favorites` table - Stores user favorites
- Columns: id, user_id, item_id, created_at

## Security Considerations

### Authentication
- All endpoints require valid JWT token
- Token validated on every request
- Expired tokens rejected

### Authorization
- Users can only manage their own favorites
- Backend validates user ownership
- No access to other users' favorites

### Data Validation
- Item ID validated (must exist)
- User ID validated (must be authenticated)
- Duplicate favorites prevented

### Rate Limiting
- Prevent spam favoriting
- Limit requests per minute
- Implement on backend

## API Documentation

### Get All Favorites
```
GET /api/favorites
Headers: Authorization: Bearer <token>
Response: {
  success: true,
  data: [Item]
}
```

### Add Favorite
```
POST /api/favorites
Headers: Authorization: Bearer <token>
Body: { item_id: number }
Response: {
  success: true,
  message: "Added to favorites"
}
```

### Remove Favorite
```
DELETE /api/favorites/:itemId
Headers: Authorization: Bearer <token>
Response: {
  success: true,
  message: "Removed from favorites"
}
```

### Check if Favorited
```
GET /api/favorites/check/:itemId
Headers: Authorization: Bearer <token>
Response: {
  success: true,
  is_favorited: boolean
}
```

## Support

For issues or questions:
1. Check browser console for errors
2. Verify backend API is running
3. Check authentication status
4. Review this documentation
5. Check related files for implementation details

## License

Part of ShareHub project - Share, Sell, and Donate platform

# Items Browsing and Search Feature

## Overview
A comprehensive items browsing and search page for ShareHub frontend with advanced filtering, pagination, and responsive design.

## Files Created/Updated

### 1. Pages
- **`pages/ItemsList.js`** - Main items browsing page with search, filters, and pagination
- **`pages/ItemsList.css`** - Comprehensive styling for the items list page
- **`pages/ItemsList.test.js`** - Basic test file for the component

### 2. Components Updated
- **`components/SearchBar.js`** - Simplified search bar with real-time search
- **`components/FilterSidebar.js`** - Advanced filtering sidebar with mobile support
- **`components/Pagination.js`** - Enhanced pagination with item count display

### 3. Services Updated
- **`services/itemService.js`** - Enhanced API methods with better error handling

## Features Implemented

### ItemsList Page (`pages/ItemsList.js`)
**Layout:**
- SearchBar at top for quick item search
- FilterSidebar on left (desktop) or collapsible overlay (mobile)
- Responsive items grid in main area (1-4 columns based on screen size)
- Pagination at bottom with item count display

**Features:**
- ✅ Display items in responsive grid
- ✅ Loading skeleton while fetching data
- ✅ Empty state with "No items found" message
- ✅ Fetch items on mount and when filters change
- ✅ Handle URL query params for filters (shareable URLs)
- ✅ Real-time search with debouncing (500ms)
- ✅ Error handling with retry functionality

**State Management:**
- `items`: array of items
- `loading`: boolean for loading state
- `error`: error message if any
- `filters`: object containing all filter values
- `pagination`: object with page, limit, totalPages, totalItems
- `sortBy` and `order`: sorting configuration

**API Integration:**
- GET /api/items with comprehensive query params
- Automatic URL params update when filters change
- Debounced search input to reduce API calls

### SearchBar Component (`components/SearchBar.js`)
**Features:**
- Clean, focused search input with icon
- Real-time search as user types
- Clear button when search has text
- Responsive design with proper styling

### FilterSidebar Component (`components/FilterSidebar.js`)
**Filters Available:**
1. **Category**: Clothes, Books, Ration (dropdown)
2. **Listing Type**: Sell, Donate, Swap (radio buttons with color-coded badges)
3. **Condition**: New, Like New, Good, Fair (dropdown)
4. **Price Range**: Min and max inputs (only shown for non-donate items)

**Features:**
- Active filter count badge in header
- Clear all filters functionality
- Mobile-responsive with overlay design
- Sticky positioning on desktop
- Real-time filter application

### Pagination Component (`components/Pagination.js`)
**Features:**
- Previous/Next buttons with icons
- Page numbers with ellipsis for many pages
- Jump to first/last page buttons
- Current page highlighting
- "Showing X-Y of Z items" display
- Fully accessible with ARIA labels

### ItemService Updates (`services/itemService.js`)
**Enhanced Methods:**
- `getAllItems()`: Supports pagination, filtering, and sorting
- `searchItems()`: Advanced search with all filter options
- `getNearbyItems()`: Location-based search with filters
- All methods now return consistent response format with error handling

## Styling Features (`pages/ItemsList.css`)

### Responsive Design
- Mobile-first approach
- Collapsible filter sidebar on mobile
- Responsive grid (1-4 columns)
- Touch-friendly interface elements

### Visual Enhancements
- Loading skeleton animations
- Smooth transitions and hover effects
- Color-coded listing type badges
- Clean, modern card design
- Proper spacing and typography

### Mobile Optimizations
- Overlay filter sidebar
- Touch-friendly buttons
- Optimized spacing for mobile
- Responsive typography

## URL Parameters Support
The page supports shareable URLs with these parameters:
- `search`: Search query
- `category`: Selected category
- `listing_type`: Selected listing type
- `condition`: Selected condition
- `min_price`: Minimum price filter
- `max_price`: Maximum price filter
- `page`: Current page number
- `sort`: Sort field
- `order`: Sort order (ASC/DESC)

## Usage Examples

### Basic Usage
```jsx
import ItemsList from './pages/ItemsList';

function App() {
  return <ItemsList />;
}
```

### With URL Parameters
```
/items?category=clothes&listing_type=sell&search=shirt&page=2
```

## Performance Optimizations
- Debounced search (500ms delay)
- Efficient re-renders with useCallback
- Loading skeletons for better UX
- Lazy loading for images
- Optimized API calls

## Accessibility Features
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast design
- Focus management

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes

## Future Enhancements
- Location-based filtering with radius slider
- Saved searches functionality
- Advanced sorting options
- Infinite scroll option
- Export search results
- Social sharing of searches
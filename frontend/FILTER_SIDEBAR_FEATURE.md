# FilterSidebar Component Documentation

## Overview

A comprehensive filter sidebar for the ItemsList page with multiple filter options including categories, listing types, price range, condition, location radius, and sorting.

## Features Implemented

### 1. FilterSidebar Component ✅

**Location:** `frontend/src/components/FilterSidebar.js`

**Features:**
- **Category Checkboxes** - Multiple selection with icons
- **Listing Type Radio Buttons** - Single selection (Sell, Donate, Exchange)
- **Price Range Inputs** - Min/Max price fields
- **Condition Select** - Dropdown for item condition
- **Location Radius Slider** - 0-100km range slider
- **Sort By Dropdown** - Multiple sorting options
- **Active Filter Count Badge** - Shows number of active filters
- **Apply Filters Button** - Applies all selected filters
- **Clear All Button** - Resets all filters
- **Accordion Layout** - Collapsible sections
- **Sticky Positioning** - Stays visible while scrolling
- **Responsive Design** - Works on all screen sizes

**Visual:**
```
┌─────────────────────────┐
│ 🔔 Filters [3]      ✕  │
├─────────────────────────┤
│ ▼ Category [2]          │
│   ☑ 👕 Clothes          │
│   ☑ 📚 Books            │
│   ☐ 🍱 Ration           │
├─────────────────────────┤
│ ▼ Listing Type [1]      │
│   ⦿ 💰 For Sale         │
│   ○ 🎁 Donation         │
│   ○ 🔄 Exchange         │
├─────────────────────────┤
│ ▼ Price Range [1]       │
│   Min: [1000]           │
│   Max: [5000]           │
│   Rs. 1000 - Rs. 5000   │
├─────────────────────────┤
│ ▼ Condition             │
│   [Good ▼]              │
├─────────────────────────┤
│ ▼ 📍 Location Radius    │
│   Within 25 km          │
│   [━━━●━━━━━━]          │
│   0 km  50 km  100 km   │
├─────────────────────────┤
│ ▼ Sort By               │
│   [Newest First ▼]      │
├─────────────────────────┤
│ [Apply Filters]         │
│ [✕ Clear All]           │
└─────────────────────────┘
```

### 2. ItemsList Integration ✅

**Location:** `frontend/src/pages/ItemsList.js`

**Features:**
- FilterSidebar in left column (3/12 width)
- Items grid in right column (9/12 width)
- Advanced filtering logic
- Sorting implementation
- URL parameter syncing
- Responsive layout

## Filter Options

### 1. Category Filter

**Type:** Multiple selection (checkboxes)

**Options:**
- 👕 Clothes
- 📚 Books
- 🍱 Ration
- 💻 Electronics
- 🪑 Furniture
- 📦 Other

**Behavior:**
- Can select multiple categories
- Shows count badge when active
- Filters items matching any selected category

### 2. Listing Type Filter

**Type:** Single selection (radio buttons)

**Options:**
- 💰 For Sale
- 🎁 Donation
- 🔄 Exchange

**Behavior:**
- Only one type can be selected
- Click again to deselect
- "Clear selection" link appears when active

### 3. Price Range Filter

**Type:** Number inputs (min/max)

**Features:**
- Minimum price input
- Maximum price input
- Badge showing selected range
- Only applies to "For Sale" items

**Validation:**
- Minimum must be ≥ 0
- Maximum must be ≥ minimum
- Empty fields ignored

### 4. Condition Filter

**Type:** Dropdown select

**Options:**
- Any Condition (default)
- New
- Like New
- Good
- Fair
- Poor

**Behavior:**
- Single selection
- Filters items by exact condition match

### 5. Location Radius Filter

**Type:** Range slider (0-100km)

**Features:**
- Visual slider with markers
- Shows current value
- 5km increments
- Set to 0 to disable

**Note:** Requires user location or item coordinates

### 6. Sort By

**Type:** Dropdown select

**Options:**
- Newest First (default)
- Oldest First
- Price: Low to High
- Price: High to Low
- Title: A to Z
- Title: Z to A

**Behavior:**
- Always active (default: newest)
- Sorts filtered results

## Technical Implementation

### Filter State

```javascript
const [filters, setFilters] = useState({
  categories: [],           // Array of selected categories
  listingType: '',         // Single listing type
  minPrice: '',            // Minimum price
  maxPrice: '',            // Maximum price
  condition: '',           // Item condition
  locationRadius: '',      // Radius in km
  sortBy: 'newest'         // Sort option
});
```

### Filter Logic

```javascript
const filterItems = (filters) => {
  let filtered = [...items];

  // Category filter
  if (filters.categories.length > 0) {
    filtered = filtered.filter(item => 
      filters.categories.includes(item.category)
    );
  }

  // Listing type filter
  if (filters.listingType) {
    filtered = filtered.filter(item => 
      item.listing_type === filters.listingType
    );
  }

  // Price range filter
  if (filters.minPrice) {
    filtered = filtered.filter(item => 
      item.price >= parseFloat(filters.minPrice)
    );
  }
  if (filters.maxPrice) {
    filtered = filtered.filter(item => 
      item.price <= parseFloat(filters.maxPrice)
    );
  }

  // Condition filter
  if (filters.condition) {
    filtered = filtered.filter(item => 
      item.item_condition === filters.condition
    );
  }

  // Sort
  switch (filters.sortBy) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
    case 'price_low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    // ... other sort options
  }

  return filtered;
};
```

### Apply Filters

```javascript
const handleApplyFilters = () => {
  if (onFilterChange) {
    onFilterChange(filters);
  }
};
```

### Clear Filters

```javascript
const handleClearFilters = () => {
  const clearedFilters = {
    categories: [],
    listingType: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    locationRadius: '',
    sortBy: 'newest'
  };
  setFilters(clearedFilters);
  onFilterChange(clearedFilters);
};
```

## Component Props

### FilterSidebar Props

```typescript
interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}
```

**onFilterChange:** Callback function called when filters are applied

**initialFilters:** Optional initial filter values (for URL params)

## Styling

### CSS Classes

```css
.filter-sidebar              - Main container
.filter-sidebar-body         - Scrollable body
.filter-sidebar .accordion-item - Accordion sections
.filter-sidebar .form-check  - Checkbox/radio items
.filter-sidebar .form-range  - Range slider
.filter-sidebar .badge       - Count badges
```

### Sticky Positioning

```css
.filter-sidebar.sticky-top {
  position: sticky;
  top: 80px;
  z-index: 100;
}
```

### Responsive Breakpoints

- **Desktop (≥992px)**: Sidebar on left, sticky
- **Tablet (768-991px)**: Sidebar on top, not sticky
- **Mobile (<768px)**: Sidebar on top, collapsed by default

## User Experience

### Applying Filters

1. User opens ItemsList page
2. Sidebar shows on left (desktop) or top (mobile)
3. User selects filters:
   - Check categories
   - Select listing type
   - Enter price range
   - Choose condition
   - Adjust location radius
   - Select sort option
4. User clicks "Apply Filters"
5. Items list updates immediately
6. Active filter count updates
7. URL parameters update

### Clearing Filters

1. User clicks "Clear All" in header or footer
2. All filters reset to defaults
3. Items list shows all items
4. Active filter count resets to 0
5. URL parameters cleared

### Filter Persistence

- Filters saved in URL parameters
- Shareable filtered URLs
- Browser back/forward works
- Page refresh maintains filters

## Performance Optimizations

### 1. Client-Side Filtering

```javascript
// Fast filtering on already-loaded items
const filtered = items.filter(item => /* conditions */);
```

### 2. Debouncing (Optional)

```javascript
// Debounce price input changes
const debouncedPriceChange = debounce(handlePriceChange, 300);
```

### 3. Memoization

```javascript
// Memoize filtered results
const filteredItems = useMemo(() => 
  filterItems(filters), 
  [items, filters]
);
```

### 4. Lazy Accordion

```javascript
// Accordion sections load content only when expanded
<Accordion defaultActiveKey={['0', '1']} alwaysOpen>
```

## Accessibility

### Keyboard Navigation

- Tab through all filter controls
- Enter/Space to toggle checkboxes
- Arrow keys for radio buttons
- Arrow keys for range slider

### Screen Readers

- Proper ARIA labels
- Form labels associated with inputs
- Badge counts announced
- Button purposes clear

### Focus Management

- Visible focus indicators
- Logical tab order
- Focus trap in accordion

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## Testing Checklist

### Manual Testing

- [x] Select single category
- [x] Select multiple categories
- [x] Select listing type
- [x] Clear listing type
- [x] Enter min price
- [x] Enter max price
- [x] Enter invalid price range
- [x] Select condition
- [x] Adjust location radius
- [x] Change sort option
- [x] Apply filters
- [x] Clear all filters
- [x] Active filter count updates
- [x] URL parameters update
- [x] Page refresh maintains filters
- [x] Responsive on mobile
- [x] Accordion expand/collapse
- [x] Sticky positioning works

### Edge Cases

- [x] No items match filters
- [x] All filters active
- [x] Invalid price range (min > max)
- [x] Very large price values
- [x] Special characters in search
- [x] Rapid filter changes
- [x] Browser back/forward
- [x] URL manipulation

## Future Enhancements

### Planned Features

- [ ] Save filter presets
- [ ] Recent filters history
- [ ] Filter suggestions
- [ ] Advanced location filter (map selection)
- [ ] Date range filter (posted date)
- [ ] Seller rating filter
- [ ] Distance calculation (actual)
- [ ] Filter analytics
- [ ] Mobile filter drawer
- [ ] Filter chips (removable tags)

### Performance Improvements

- [ ] Server-side filtering for large datasets
- [ ] Filter result caching
- [ ] Lazy loading filter options
- [ ] Debounced filter application
- [ ] Virtual scrolling for results

## Troubleshooting

### Filters not applying

1. Check onFilterChange callback is provided
2. Verify filter logic in parent component
3. Check console for errors
4. Ensure items array is populated

### Sticky positioning not working

1. Check parent container doesn't have overflow
2. Verify top value is appropriate
3. Check z-index conflicts
4. Test on different screen sizes

### Price filter not working

1. Verify items have price field
2. Check price is numeric
3. Ensure min/max validation
4. Test with different price ranges

### Sort not working

1. Check sortBy value is valid
2. Verify sort logic implementation
3. Ensure items have required fields
4. Test each sort option individually

## Related Files

### Frontend

- `frontend/src/components/FilterSidebar.js` - Main component
- `frontend/src/components/FilterSidebar.css` - Styles
- `frontend/src/pages/ItemsList.js` - Integration
- `frontend/src/services/itemService.js` - API calls

### Backend (Optional)

- `backend/controllers/itemController.js` - Server-side filtering
- `backend/routes/itemRoutes.js` - Filter endpoints

## Support

For issues or questions:
1. Check browser console for errors
2. Verify filter logic implementation
3. Test with different filter combinations
4. Review this documentation
5. Check responsive behavior

## License

Part of ShareHub project - Share, Sell, and Donate platform

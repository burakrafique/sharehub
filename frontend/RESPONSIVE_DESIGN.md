# ShareHub - Responsive Design Guide

## Mobile-First Approach

All ShareHub components are built with responsive design using Bootstrap's grid system and utility classes.

## Responsive Breakpoints

Bootstrap breakpoints used:
- **xs**: < 576px (Mobile phones)
- **sm**: ≥ 576px (Small tablets)
- **md**: ≥ 768px (Tablets)
- **lg**: ≥ 992px (Desktops)
- **xl**: ≥ 1200px (Large desktops)

## Component Responsiveness

### ✅ Navbar (`components/Navbar.js`)
- Collapses to hamburger menu on mobile
- Full navigation on desktop
- Dropdown menus work on all sizes
```jsx
<BootstrapNavbar expand="lg">
  <BootstrapNavbar.Toggle />
  <BootstrapNavbar.Collapse>
```

### ✅ Item Grid (ItemCard usage)
Recommended grid layout:
```jsx
<Row>
  <Col xs={12} sm={6} md={4} lg={3}>
    <ItemCard item={item} />
  </Col>
</Row>
```
- **Mobile (xs)**: 1 column (full width)
- **Small (sm)**: 2 columns
- **Medium (md)**: 3 columns
- **Large (lg)**: 4 columns

### ✅ Forms (Login, Register, CreateItem)
- Full width on mobile: `<Col md={6} lg={5}>`
- Centered on desktop
- Buttons full width on mobile: `className="w-100"`
- Two-column fields stack on mobile:
```jsx
<Row>
  <Col md={6}> {/* Stacks on mobile */}
    <Form.Group>...</Form.Group>
  </Col>
</Row>
```

### ✅ Dashboard (`pages/Dashboard.js`)
- Stats cards: `<Col md={3} sm={6}>`
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 4 columns
- Quick actions: Same responsive grid
- Recent items sidebar: `<Col lg={7}>` and `<Col lg={5}>`
  - Stacks vertically on mobile

### ✅ Messages (`pages/Messages.js`)
- Conversations list: `<Col md={4}>`
- Chat window: `<Col md={8}>`
- Stacks vertically on mobile
- Full-height layout on desktop

### ✅ Profile (`pages/Profile.js`)
- Sidebar: `<Col lg={3}>`
- Content: `<Col lg={9}>`
- Stacks on mobile, side-by-side on desktop

### ✅ ItemDetail (`pages/ItemDetail.js`)
- Image gallery: `<Col lg={7}>`
- Details sidebar: `<Col lg={5}>`
- Stacks on mobile

### ✅ SearchBar (`components/SearchBar.js`)
- Filters in responsive grid
- Full width on mobile
- Multi-column on desktop

### ✅ Home Page (`pages/Home.js`)
- Hero section: `<Col lg={6}>`
- Categories: `<Col md={4}>` (3 columns on tablet+)
- Features: `<Col md={4}>` (3 columns on tablet+)

## Responsive Utilities

### Container Padding
```jsx
<Container className="py-4 px-3">
```
- Adds padding on all sides
- Prevents content from touching edges on mobile

### Button Groups
```jsx
<div className="d-grid gap-2 d-md-flex">
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</div>
```
- Stacked on mobile (`d-grid`)
- Horizontal on desktop (`d-md-flex`)

### Text Alignment
```jsx
<div className="text-center text-lg-start">
```
- Centered on mobile
- Left-aligned on large screens

### Spacing
```jsx
<div className="mb-3 mb-md-4">
```
- Smaller margin on mobile
- Larger margin on desktop

## Testing Responsive Design

### Browser DevTools
1. Open Chrome DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Test these devices:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - iPad Pro (1024px)
   - Desktop (1920px)

### Key Areas to Test
- [ ] Navbar collapses properly
- [ ] Forms are readable and usable
- [ ] Item cards display correctly
- [ ] Images scale properly
- [ ] Buttons are accessible
- [ ] Text doesn't overflow
- [ ] Modals fit on screen
- [ ] Tables scroll horizontally if needed

## Mobile-Specific Considerations

### Touch Targets
- Minimum 44x44px for buttons
- Adequate spacing between clickable elements
- Large enough form inputs

### Performance
- Lazy load images
- Optimize image sizes
- Minimize bundle size
- Use React.lazy for code splitting

### Gestures
- Swipe support for carousels
- Pull-to-refresh (optional)
- Touch-friendly dropdowns

## Common Responsive Patterns

### Hide on Mobile
```jsx
<div className="d-none d-md-block">
  {/* Hidden on mobile, visible on tablet+ */}
</div>
```

### Show Only on Mobile
```jsx
<div className="d-block d-md-none">
  {/* Visible on mobile, hidden on tablet+ */}
</div>
```

### Responsive Images
```jsx
<img 
  src={image} 
  className="img-fluid" 
  alt="Description"
/>
```

### Responsive Tables
```jsx
<div className="table-responsive">
  <Table>...</Table>
</div>
```

## Accessibility

- All interactive elements keyboard accessible
- Proper ARIA labels
- Sufficient color contrast
- Screen reader friendly
- Focus indicators visible

## Best Practices

1. **Mobile First**: Design for mobile, enhance for desktop
2. **Touch Friendly**: Large tap targets (min 44px)
3. **Performance**: Optimize images and code
4. **Testing**: Test on real devices when possible
5. **Consistency**: Use Bootstrap classes consistently

## Quick Checklist

- [x] Navbar collapses on mobile
- [x] Item grids responsive
- [x] Forms full width on mobile
- [x] Buttons accessible on mobile
- [x] Images scale properly
- [x] Text readable on small screens
- [x] No horizontal scrolling
- [x] Touch-friendly spacing

All ShareHub components are mobile-friendly and responsive! 📱✨

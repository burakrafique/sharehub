# LocationPicker Component

A comprehensive Google Maps-based location picker component for React with address search, current location detection, and reverse geocoding.

## Features

✅ **Interactive Map** - Click anywhere to select location  
✅ **Draggable Marker** - Drag marker to adjust position  
✅ **Address Search** - Search for locations by address or place name  
✅ **Current Location** - Get user's GPS location with one click  
✅ **Reverse Geocoding** - Automatically converts coordinates to addresses  
✅ **Real-time Updates** - Instant callback on location changes  
✅ **Responsive Design** - Works on all screen sizes  
✅ **Error Handling** - Graceful error messages and fallbacks  

## Quick Start

```jsx
import LocationPicker from '../components/LocationPicker';

function MyComponent() {
  const handleLocationSelect = (location) => {
    console.log('Selected:', location);
    // location = { lat: 31.5204, lng: 74.3587, address: "..." }
  };

  return (
    <LocationPicker
      onLocationSelect={handleLocationSelect}
      height="400px"
    />
  );
}
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `onLocationSelect` | function | - | Yes | Callback function called when location is selected. Receives `{ lat, lng, address }` |
| `initialLat` | number | 31.5204 | No | Initial latitude (Lahore, Pakistan by default) |
| `initialLng` | number | 74.3587 | No | Initial longitude |
| `height` | string | '400px' | No | Map container height (CSS value) |
| `showSearch` | boolean | true | No | Show/hide address search bar |
| `showCurrentLocation` | boolean | true | No | Show/hide "Use My Location" button |

## Location Object

The `onLocationSelect` callback receives an object with:

```javascript
{
  lat: 31.5204,           // Latitude (number)
  lng: 74.3587,           // Longitude (number)
  address: "Street..."    // Formatted address (string, may be empty)
}
```

## Usage Examples

### Basic Usage

```jsx
<LocationPicker
  onLocationSelect={(location) => {
    console.log(location.lat, location.lng, location.address);
  }}
/>
```

### With Form Integration

```jsx
const [formData, setFormData] = useState({
  latitude: '',
  longitude: '',
  address: ''
});

<LocationPicker
  onLocationSelect={(location) => {
    setFormData({
      ...formData,
      latitude: location.lat.toString(),
      longitude: location.lng.toString(),
      address: location.address
    });
  }}
  initialLat={formData.latitude ? parseFloat(formData.latitude) : undefined}
  initialLng={formData.longitude ? parseFloat(formData.longitude) : undefined}
/>
```

### Custom Configuration

```jsx
<LocationPicker
  onLocationSelect={handleLocation}
  initialLat={40.7128}
  initialLng={-74.0060}
  height="500px"
  showSearch={true}
  showCurrentLocation={true}
/>
```

### Simple Picker (No Search)

```jsx
<LocationPicker
  onLocationSelect={handleLocation}
  height="300px"
  showSearch={false}
  showCurrentLocation={true}
/>
```

## User Interactions

### 1. Click on Map
- Click anywhere on the map to select that location
- Marker will move to clicked position
- Address will be automatically fetched

### 2. Drag Marker
- Click and hold the marker
- Drag to desired location
- Release to select
- Address updates automatically

### 3. Search Address
- Type address or place name in search box
- Press Enter or click Search button
- Map centers on found location
- Marker moves to selected place

### 4. Use Current Location
- Click "Use My Location" button
- Browser will request location permission
- Map centers on user's GPS location
- Marker moves to current position

## Setup Requirements

### 1. Google Maps API Key

Get an API key from [Google Cloud Console](https://console.cloud.google.com/):

1. Create a project
2. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Create credentials (API Key)

### 2. Environment Variable

Add to `frontend/.env`:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 3. HTML Script Tag

Already added to `public/index.html`:

```html
<script 
  src="https://maps.googleapis.com/maps/api/js?key=%REACT_APP_GOOGLE_MAPS_API_KEY%&libraries=places"
  async
  defer
></script>
```

## Error Handling

The component handles various error scenarios:

### API Not Loaded
```
"Google Maps API not loaded. Please check your API key configuration."
```
**Solution:** Add API key to .env and script to index.html

### Location Permission Denied
```
"Location permission denied. Please enable location access."
```
**Solution:** User must grant location permission in browser

### Location Not Found
```
"Location not found. Please try a different search."
```
**Solution:** Try a more specific search query

### Geocoding Failed
- Falls back to showing coordinates only
- Address field will be empty
- User can manually enter address

## Browser Compatibility

- ✅ Chrome 50+
- ✅ Firefox 45+
- ✅ Safari 10+
- ✅ Edge 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips

1. **Lazy Loading**: Map loads only when component mounts
2. **Debouncing**: Consider debouncing the `onLocationSelect` callback if making API calls
3. **Memoization**: Wrap component in `React.memo()` if parent re-renders frequently

## Accessibility

- Keyboard navigation supported
- Screen reader friendly
- ARIA labels on interactive elements
- Focus management

## Troubleshooting

### Map shows gray area
- Check API key is valid
- Verify APIs are enabled in Google Cloud Console
- Check browser console for errors

### Search not working
- Ensure Places API is enabled
- Check `libraries=places` in script URL
- Verify API key has Places API access

### Current location not working
- User must grant location permission
- HTTPS required for geolocation (except localhost)
- Check browser supports geolocation

### Address not showing
- Geocoding API must be enabled
- Some locations may not have addresses
- User can manually enter address

## API Usage & Costs

Google Maps offers $200 free credit per month:
- Maps JavaScript API: 28,000 loads/month free
- Geocoding API: 40,000 requests/month free
- Places API: Varies by request type

Monitor usage in Google Cloud Console.

## Security

⚠️ **Never commit API keys to version control**

- Use environment variables
- Add `.env` to `.gitignore`
- Restrict API key in Google Cloud Console
- Set HTTP referrer restrictions
- Limit to specific APIs

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Google Maps API setup
3. Review example files
4. Check Google Maps API documentation

## Related Components

- `LocationMap.js` - Display-only map component
- `CreateItem.js` - Uses LocationPicker for item creation

## License

Part of ShareHub project

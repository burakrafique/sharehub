# Google Maps API Setup Guide

This guide will help you set up Google Maps API for the LocationPicker component.

## Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Go to "Credentials" and create an API key
5. (Optional) Restrict your API key:
   - Application restrictions: HTTP referrers
   - API restrictions: Select the APIs listed above

## Step 2: Add API Key to Environment

1. Open or create `.env` file in the `frontend` directory
2. Add your API key:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

3. Restart your development server

## Step 3: Add Google Maps Script to HTML

Open `public/index.html` and add this script tag in the `<head>` section:

```html
<script 
  src="https://maps.googleapis.com/maps/api/js?key=%REACT_APP_GOOGLE_MAPS_API_KEY%&libraries=places"
  async
  defer
></script>
```

**Note:** The `%REACT_APP_GOOGLE_MAPS_API_KEY%` will be replaced with your actual API key during build.

Alternatively, you can hardcode the key (not recommended for production):

```html
<script 
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=places"
  async
  defer
></script>
```

## Step 4: Verify Setup

1. Start your development server: `npm start`
2. Navigate to the Create Item page
3. You should see the map with location picker functionality

## LocationPicker Component Features

### Basic Usage

```jsx
import LocationPicker from '../components/LocationPicker';

<LocationPicker
  onLocationSelect={(location) => {
    console.log('Selected:', location);
    // location = { lat, lng, address }
  }}
  initialLat={31.5204}
  initialLng={74.3587}
  height="400px"
  showSearch={true}
  showCurrentLocation={true}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onLocationSelect` | function | - | Callback when location is selected. Receives `{ lat, lng, address }` |
| `initialLat` | number | 31.5204 | Initial latitude |
| `initialLng` | number | 74.3587 | Initial longitude |
| `height` | string | '400px' | Map height |
| `showSearch` | boolean | true | Show address search bar |
| `showCurrentLocation` | boolean | true | Show "Use My Location" button |

### Features

1. **Click to Select**: Click anywhere on the map to select a location
2. **Drag Marker**: Drag the marker to adjust the location
3. **Search Address**: Search for locations by address or place name
4. **Current Location**: Get user's current GPS location
5. **Reverse Geocoding**: Automatically converts coordinates to addresses
6. **Address Display**: Shows selected coordinates and formatted address

## Troubleshooting

### Map Not Loading

- Check if API key is correctly set in `.env`
- Verify the script tag is in `public/index.html`
- Check browser console for errors
- Ensure APIs are enabled in Google Cloud Console

### "This page can't load Google Maps correctly"

- Your API key might be invalid or restricted
- Check API key restrictions in Google Cloud Console
- Ensure billing is enabled (Google requires it even for free tier)

### Location Permission Denied

- User must grant location permission in browser
- This is required for "Use My Location" feature
- The feature will show an error if permission is denied

## API Usage Limits

Google Maps offers a free tier with the following limits:
- $200 free credit per month
- Maps JavaScript API: 28,000 loads per month free
- Geocoding API: 40,000 requests per month free
- Places API: Varies by request type

Monitor your usage in Google Cloud Console.

## Security Best Practices

1. **Never commit API keys to version control**
   - Add `.env` to `.gitignore`
   - Use environment variables

2. **Restrict your API key**
   - Set HTTP referrer restrictions
   - Limit to specific APIs
   - Set usage quotas

3. **For production**
   - Use different API keys for dev/prod
   - Implement server-side API key management
   - Monitor usage and set alerts

## Additional Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Geocoding API Documentation](https://developers.google.com/maps/documentation/geocoding)

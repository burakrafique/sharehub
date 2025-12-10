# Google Maps Integration Testing Guide

## 🧪 Testing Checklist

After implementing Google Maps integration, follow these steps to verify everything works correctly:

### **1. Basic Setup Verification**

#### ✅ Check Environment Variables
```bash
# In frontend/.env file, verify:
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyAhBaH-eptW6gL8kJMedj_RFyOPWJtMz1k
REACT_APP_API_URL=http://localhost:5000/api
```

#### ✅ Check HTML Script Tag
```html
<!-- In frontend/public/index.html, verify: -->
<script 
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAhBaH-eptW6gL8kJMedj_RFyOPWJtMz1k&libraries=places"
  async
  defer
></script>
```

#### ✅ Restart Development Server
```bash
# IMPORTANT: Must restart after adding environment variables
npm start
```

### **2. Browser Console Testing**

#### ✅ Open Developer Tools
1. Press `F12` or `Ctrl+Shift+I`
2. Go to **Console** tab
3. Type: `window.google`
4. **Expected Result**: Should show Google Maps object
5. **If undefined**: Script not loaded properly

#### ✅ Check for Errors
Look for these common errors in console:
- ❌ `Google is not defined` → API key not loaded, restart server
- ❌ `RefererNotAllowedMapError` → Add localhost to API restrictions
- ❌ `RequestDeniedError` → API key invalid or billing not enabled

### **3. CreateItem Page Testing**

#### ✅ Navigate to Create Item
1. Go to `/create-item` or click "Create Listing"
2. Scroll to Location section
3. **Expected**: Map should load within 2-3 seconds

#### ✅ Map Loading States
- **Loading**: Should show spinner with "Loading Google Maps..."
- **Loaded**: Interactive map centered on Lahore, Pakistan
- **Error**: Should show error message if failed

#### ✅ Search Box Functionality
1. Click in search box
2. Type: "Johar Town, Lahore"
3. **Expected**: Autocomplete suggestions appear
4. Select a suggestion
5. **Expected**: Map centers on location, marker moves

#### ✅ Map Click Interaction
1. Click anywhere on the map
2. **Expected**: Red marker moves to clicked location
3. **Expected**: Address updates below map
4. **Expected**: Coordinates display updates

#### ✅ Marker Dragging
1. Click and drag the red marker
2. **Expected**: Marker moves smoothly
3. **Expected**: Address updates when drag ends
4. **Expected**: Coordinates update

#### ✅ "Use My Location" Button
1. Click "Use My Location" button
2. **Expected**: Browser asks for location permission
3. Allow permission
4. **Expected**: Map centers on your location
5. **Expected**: Marker moves to your position

#### ✅ Location Confirmation Display
After selecting any location, verify:
- ✅ Green alert box appears
- ✅ Shows "Selected Location: [Address]"
- ✅ Shows coordinates in format: "📍 Coordinates: 31.5204, 74.3587"

### **4. Form Integration Testing**

#### ✅ Location Data Persistence
1. Select a location on map
2. Fill other form fields (title, description, etc.)
3. **Expected**: Location data remains selected
4. Submit form
5. **Expected**: Location data included in submission

#### ✅ Initial Location (Edit Mode)
1. Edit an existing item with location
2. **Expected**: Map loads with marker at saved location
3. **Expected**: Correct address displayed

## 🐛 Common Issues & Solutions

### **Issue: Map Shows Grey/Blank**
**Cause**: Billing not enabled or API restrictions
**Solution**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable billing (free tier available)
3. Enable Maps JavaScript API and Places API

### **Issue: "Google is not defined"**
**Cause**: Script not loaded or server not restarted
**Solution**:
1. Check script tag in `index.html`
2. Restart development server: `npm start`
3. Clear browser cache

### **Issue: "RefererNotAllowedMapError"**
**Cause**: API key restrictions too strict
**Solution**:
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Edit API key
3. Add `localhost:3000` to HTTP referrers

### **Issue: Search Box Not Working**
**Cause**: Places API not enabled
**Solution**:
1. Go to Google Cloud Console
2. Enable "Places API"
3. Ensure `&libraries=places` in script URL

### **Issue: Geolocation Not Working**
**Cause**: HTTPS required or permission denied
**Solution**:
1. Use HTTPS in production
2. Check browser location permissions
3. Test in different browser

## 🔧 Debug Commands

### **Check Google Maps Object**
```javascript
// In browser console:
console.log(window.google);
console.log(window.google.maps);
console.log(window.google.maps.places);
```

### **Test API Key**
```javascript
// In browser console:
fetch(`https://maps.googleapis.com/maps/api/js?key=AIzaSyAhBaH-eptW6gL8kJMedj_RFyOPWJtMz1k`)
  .then(response => console.log('API Key Status:', response.status));
```

### **Check Environment Variables**
```javascript
// In browser console:
console.log('API Key:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
```

## ✅ Success Criteria

Your Google Maps integration is working correctly if:

1. ✅ Map loads without errors
2. ✅ Search box provides autocomplete
3. ✅ Clicking map moves marker
4. ✅ Dragging marker works smoothly
5. ✅ "Use My Location" gets GPS position
6. ✅ Selected location shows address and coordinates
7. ✅ Form submission includes location data
8. ✅ No console errors related to Google Maps

## 📞 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Verify API key and billing in Google Cloud Console
3. Test in incognito mode to rule out browser cache
4. Check network tab for failed API requests

**Google Cloud Console**: https://console.cloud.google.com/
**Maps JavaScript API Docs**: https://developers.google.com/maps/documentation/javascript/
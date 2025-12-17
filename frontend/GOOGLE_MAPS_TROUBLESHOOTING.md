# 🗺️ Google Maps API Troubleshooting Guide

## 🔍 Common Issues and Solutions

### 1. **API Key Issues**

#### Problem: "Google Maps API key is missing"
**Solution:**
```bash
# Check if .env file exists in frontend folder
ls frontend/.env

# If missing, create it:
echo "REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE" > frontend/.env

# Restart development server
npm start
```

#### Problem: "API key invalid" or "REQUEST_DENIED"
**Solutions:**
1. **Check API Key Format:**
   - Should start with `AIza`
   - Should be 39 characters long
   - No spaces or special characters

2. **Enable Required APIs:**
   Go to [Google Cloud Console](https://console.cloud.google.com/) and enable:
   - Maps JavaScript API
   - Places API
   - Geocoding API

3. **Check API Restrictions:**
   - Remove all restrictions temporarily for testing
   - Add `localhost:3000` to HTTP referrer restrictions
   - Add your domain to restrictions for production

### 2. **Loading Issues**

#### Problem: "Google Maps API failed to load"
**Solutions:**
1. **Check Internet Connection**
2. **Disable Ad Blockers** (they often block Google APIs)
3. **Try Different Browser**
4. **Check Browser Console** for specific errors

#### Problem: Map shows but is gray/blank
**Solutions:**
1. **Billing Account:** Ensure billing is enabled in Google Cloud Console
2. **API Quotas:** Check if you've exceeded daily limits
3. **Browser Cache:** Clear browser cache and cookies

### 3. **Development Environment Issues**

#### Problem: Works in production but not development
**Solutions:**
1. **HTTPS Requirement:** Some features require HTTPS
   ```bash
   # Start with HTTPS (if needed)
   HTTPS=true npm start
   ```

2. **Localhost Restrictions:** Add `localhost:3000` to API restrictions

#### Problem: Environment variable not loading
**Solutions:**
1. **Restart Development Server** after adding .env
2. **Check Variable Name:** Must start with `REACT_APP_`
3. **No Spaces:** `REACT_APP_GOOGLE_MAPS_API_KEY=key` (no spaces around =)

## 🛠️ Diagnostic Tools

### 1. **Use Built-in Diagnostics**
Visit: `http://localhost:3000/google-maps-test`

### 2. **Browser Console Commands**
```javascript
// Check if Google Maps is loaded
console.log('Google:', !!window.google);
console.log('Maps:', !!(window.google && window.google.maps));
console.log('Places:', !!(window.google && window.google.maps && window.google.maps.places));

// Check API key
console.log('API Key:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

// Run full diagnostics
import { diagnoseGoogleMaps } from './src/utils/googleMapsLoader';
diagnoseGoogleMaps();
```

### 3. **Network Tab Inspection**
1. Open Developer Tools (F12)
2. Go to Network tab
3. Reload page
4. Look for Google Maps API requests
5. Check for 403, 400, or other error codes

## 🔧 Step-by-Step Setup

### 1. **Get Google Maps API Key**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials → API Key
5. Copy the API key

### 2. **Configure Project**
```bash
# Navigate to frontend folder
cd frontend

# Create .env file
echo "REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY" > .env

# Restart development server
npm start
```

### 3. **Test Configuration**
1. Visit: `http://localhost:3000/google-maps-test`
2. Check all status indicators are green
3. Test map functionality

## 🚨 Emergency Fallback

If Google Maps continues to fail, the app will automatically show a manual location entry form where users can:
- Enter address manually
- Input coordinates directly
- Use browser geolocation

## 📞 Getting Help

### Check These First:
1. ✅ API key is correct and in .env file
2. ✅ Required APIs are enabled in Google Cloud Console
3. ✅ Billing is enabled (required for Google Maps)
4. ✅ No ad blockers interfering
5. ✅ Development server restarted after .env changes

### Common Error Messages:

| Error | Cause | Solution |
|-------|-------|----------|
| `REQUEST_DENIED` | API key invalid/restricted | Check API key and restrictions |
| `OVER_QUERY_LIMIT` | Exceeded daily quota | Wait or increase quota |
| `INVALID_REQUEST` | Missing required parameters | Check API call parameters |
| `ZERO_RESULTS` | No results for geocoding | Try different address |
| `UNKNOWN_ERROR` | Server error | Retry later |

### Still Need Help?
1. Check browser console for specific errors
2. Run diagnostics: `/google-maps-test`
3. Verify API key in Google Cloud Console
4. Test with a fresh API key
5. Try different browser/incognito mode

## 🎯 Production Checklist

Before deploying:
- [ ] API key restrictions configured for production domain
- [ ] Billing account active
- [ ] Daily quotas sufficient for expected traffic
- [ ] HTTPS enabled (required for geolocation)
- [ ] Error handling implemented
- [ ] Fallback location picker working
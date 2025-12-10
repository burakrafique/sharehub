# Frontend-Backend Connection Guide

## Configuration

### API Service (`frontend/src/services/api.js`)
- **Base URL**: `http://localhost:5000/api`
- **Request Interceptor**: Automatically adds JWT token from localStorage
- **Response Interceptor**: Handles 401 errors and redirects to login

## Testing Connection

### 1. Start Backend Server
```bash
cd backend
node server.js
```
Backend should run on: `http://localhost:5000`

### 2. Start Frontend Server
```bash
cd frontend
npm start
```
Frontend should run on: `http://localhost:3000`

### 3. Test Connection

#### Option A: Visit API Test Page
Navigate to: `http://localhost:3000/api-test`

This page will automatically test:
- Backend health check
- API documentation endpoint
- Stats endpoint
- Items endpoint

#### Option B: Check Browser Console
Visit the home page and check the browser console for:
- ✅ Backend connected: (if successful)
- ❌ Backend connection failed: (if failed)

#### Option C: Manual API Test
Open browser console and run:
```javascript
fetch('http://localhost:5000/')
  .then(res => res.json())
  .then(data => console.log('Backend:', data))
  .catch(err => console.error('Error:', err));
```

## Common Issues

### CORS Errors
If you see CORS errors, ensure backend has:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Connection Refused
- Make sure backend is running on port 5000
- Check if another process is using port 5000
- Verify firewall settings

### 401 Unauthorized
- Token might be expired
- Clear localStorage and login again
- Check if JWT_SECRET matches in backend

## API Endpoints

### Public Endpoints
- `GET /` - Health check
- `GET /api/docs` - API documentation
- `GET /api/stats` - Platform statistics
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get item details

### Protected Endpoints (require token)
- `POST /api/items` - Create item
- `GET /api/messages` - Get messages
- `GET /api/users/my-items` - Get user's items
- `GET /api/notifications` - Get notifications

## Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sharehub
JWT_SECRET=your_secret_key
```

### Frontend (optional .env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Health Check Utilities

### `frontend/src/utils/healthCheck.js`
```javascript
import { checkBackendHealth, checkAPIHealth } from '../utils/healthCheck';

// Check backend
const result = await checkBackendHealth();
console.log(result);

// Check API
const apiResult = await checkAPIHealth();
console.log(apiResult);
```

## Troubleshooting

1. **Backend not starting**
   - Check if MySQL is running
   - Verify database exists
   - Check .env configuration

2. **Frontend can't connect**
   - Verify backend is running
   - Check baseURL in api.js
   - Look for CORS errors in console

3. **Authentication issues**
   - Clear localStorage
   - Re-login
   - Check token in Application tab (DevTools)

## Success Indicators

✅ Home page loads without errors
✅ API test page shows all tests passing
✅ Console shows "Backend connected"
✅ Can register/login successfully
✅ Can view items list
✅ Dashboard loads user data

## Next Steps

1. Test user registration
2. Test login
3. Test creating an item
4. Test messaging
5. Test all CRUD operations

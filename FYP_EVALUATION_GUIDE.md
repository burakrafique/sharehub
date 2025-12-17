# ShareHub - FYP Evaluation Guide

## 🎯 Project Overview
ShareHub is a comprehensive marketplace platform for sharing, selling, and donating items. Built with React.js frontend and Node.js backend with MySQL database.

## 🚀 Quick Setup for Evaluation

### 1. Prerequisites
- Node.js (v14 or higher)
- MySQL/MariaDB
- Git

### 2. Database Setup
```sql
-- Create database
CREATE DATABASE sharehub;
USE sharehub;

-- Run the schema
SOURCE database/schema.sql;
```

### 3. Install Dependencies
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 4. Environment Configuration

**Backend (.env):**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sharehub
JWT_SECRET=your_jwt_secret_key_here
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyAhBaH-eptW6gL8kJMedj_RFyOPWJtMz1k
```

### 5. Add Demo Data
```bash
# Run this in the root directory
node setup-demo-data.js
```

### 6. Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

## 📱 Key Features Implemented

### ✅ Core Functionality
- [x] User Registration & Authentication
- [x] Item Listing (Sell/Donate/Exchange)
- [x] Category-based Browsing (Clothes, Books, Ration)
- [x] Search & Filter System
- [x] Location-based Services with Google Maps
- [x] Image Upload & Management
- [x] Real-time Messaging System
- [x] Transaction Management
- [x] User Dashboard
- [x] Favorites System
- [x] Notification System

### ✅ Premium Features
- [x] Premium Item Listings
- [x] Featured Items Section
- [x] Advanced Search Filters
- [x] Location Picker with Google Maps
- [x] Responsive Design
- [x] Admin Panel

### ✅ Technical Implementation
- [x] RESTful API Design
- [x] JWT Authentication
- [x] File Upload Handling
- [x] Database Relationships
- [x] Error Handling
- [x] Input Validation
- [x] Security Middleware

## 🗂️ Database Schema

### Tables Implemented:
1. **users** - User accounts and profiles
2. **items** - All listed items with premium flag
3. **item_images** - Multiple images per item
4. **transactions** - Purchase/donation records
5. **messages** - User communication
6. **favorites** - User bookmarks
7. **notifications** - System notifications
8. **ngo_verifications** - NGO verification system

## 🎨 UI/UX Features

### Home Page:
- Hero slider with call-to-actions
- Quick search functionality
- Featured items showcase
- Premium items section (NEW)
- Category browsing cards
- Statistics banner (resized)
- Responsive design

### Item Management:
- Create item with location picker
- Multiple image upload
- Category selection
- Condition specification
- Price setting for sales

### User Experience:
- Clean, modern interface
- Mobile-responsive design
- Loading states
- Error handling
- Success feedback

## 🔧 API Endpoints

### Items:
- `GET /api/items` - Get all items
- `GET /api/items/featured` - Get featured items (NEW)
- `GET /api/items/premium` - Get premium items (NEW)
- `POST /api/items` - Create new item
- `GET /api/items/:id` - Get item details
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Authentication:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Additional:
- Messages, Transactions, Favorites, Notifications

## 📊 Demo Data Included

### Items by Category:
- **Clothes**: 5 items (2 premium, 3 regular)
- **Books**: 5 items (2 premium, 3 regular)  
- **Ration**: 5 items (2 premium, 3 regular)

### Listing Types:
- **For Sale**: High-quality items with competitive prices
- **For Donation**: Free items for those in need
- **Premium**: Verified, high-quality items with special badges

## 🎯 Evaluation Points

### 1. Functionality (40%)
- ✅ All core features working
- ✅ Database operations functional
- ✅ User authentication system
- ✅ File upload system
- ✅ Search and filtering

### 2. User Interface (25%)
- ✅ Modern, responsive design
- ✅ Intuitive navigation
- ✅ Professional appearance
- ✅ Mobile compatibility

### 3. Technical Implementation (25%)
- ✅ Clean code structure
- ✅ RESTful API design
- ✅ Database normalization
- ✅ Security measures
- ✅ Error handling

### 4. Innovation (10%)
- ✅ Google Maps integration
- ✅ Premium items system
- ✅ Real-time messaging
- ✅ Advanced search filters

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Error**
   ```bash
   # Make sure MySQL is running
   # Check database credentials in .env
   ```

2. **Google Maps Not Loading**
   ```bash
   # API key is already provided in .env
   # Make sure internet connection is available
   ```

3. **Images Not Uploading**
   ```bash
   # Check uploads folder permissions
   mkdir backend/uploads/items
   ```

## 📝 Evaluation Checklist

- [ ] Database schema created successfully
- [ ] Demo data populated (15 items across 3 categories)
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 3000
- [ ] User registration/login working
- [ ] Item creation with images working
- [ ] Search and filtering functional
- [ ] Google Maps location picker working
- [ ] Featured items displaying on homepage
- [ ] Premium items section showing
- [ ] Responsive design on mobile
- [ ] All categories have items

## 🎉 Success Indicators

When everything is working correctly, you should see:

1. **Homepage**: Featured items and premium items sections populated
2. **Categories**: Each category (Clothes, Books, Ration) has multiple items
3. **Search**: Functional search with filters
4. **Maps**: Location picker working in item creation
5. **Images**: Items displaying with proper images
6. **Navigation**: Smooth navigation between pages

## 📞 Support

If you encounter any issues during evaluation:
1. Check the console for error messages
2. Verify database connection
3. Ensure all dependencies are installed
4. Check that both servers are running

**Good luck with your FYP evaluation! 🚀**
# 🏪 ShareHub - Community Marketplace

A modern web application for sharing, selling, and donating items in your community. Built with React.js frontend and Node.js backend.

## 👥 **Team**
- **Haroon Usman** - Full Stack Developer
- **Muhammad Buraq** - Full Stack Developer

## 🌟 **Features**

### 🛍️ **Core Functionality**
- **Share Items**: List items for sale, donation, or exchange
- **Browse & Search**: Find items by category, location, and filters
- **Real-time Chat**: Direct messaging between users
- **Location Integration**: Google Maps for precise location selection
- **User Profiles**: Manage your listings and account

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- WhatsApp-like chat interface
- Smooth animations and transitions
- Professional dashboard and admin panel

### 🔐 **Security & Authentication**
- JWT-based authentication
- Secure file uploads
- Input validation and sanitization
- Protected routes and middleware

## 🛠️ **Tech Stack**

### **Frontend**
- **React.js** - UI Framework
- **React Router** - Navigation
- **Bootstrap 5** - CSS Framework
- **Axios** - HTTP Client
- **Google Maps API** - Location Services

### **Backend**
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MySQL** - Database
- **JWT** - Authentication
- **Multer** - File Uploads
- **bcrypt** - Password Hashing

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Git

### **1. Clone Repository**
```bash
git clone https://github.com/YOUR_USERNAME/sharehub.git
cd sharehub
```

### **2. Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Setup database
mysql -u root -p < ../database/schema.sql
mysql -u root -p < ../database/seed.sql

# Start backend server
npm start
```

### **3. Frontend Setup**
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Add your Google Maps API key

# Start frontend server
npm start
```

### **4. Access Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔧 **Environment Variables**

### **Backend (.env)**
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sharehub

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=5000
NODE_ENV=development
```

### **Frontend (.env)**
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BACKEND_URL=http://localhost:5000

# Google Maps API Key
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 📁 **Project Structure**

```
sharehub/
├── backend/                 # Node.js Backend
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── uploads/            # File uploads
│   └── server.js           # Main server file
├── frontend/               # React Frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   └── utils/          # Utility functions
├── database/               # Database files
│   ├── schema.sql          # Database structure
│   └── seed.sql            # Sample data
└── README.md
```

## 🗺️ **Google Maps Setup**

1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Maps JavaScript API** and **Places API**
3. Add API key to `frontend/.env`
4. For production, add your domain to API restrictions

## 📱 **Key Features Guide**

### **User Authentication**
- Register/Login with email and password
- JWT token-based sessions
- Protected routes for authenticated users

### **Item Management**
- Create listings with images and location
- Edit and delete your items
- Browse items by category and location

### **Messaging System**
- Real-time chat between users
- Message history and read receipts
- Item-specific conversations

### **Location Services**
- Interactive Google Maps integration
- Address autocomplete and search
- GPS location detection

## 🧪 **Testing**

### **Backend Testing**
```bash
cd backend
npm test
```

### **Frontend Testing**
```bash
cd frontend
npm test
```

### **Google Maps Testing**
Navigate to `/google-maps-test` to verify Maps integration.

## 🚀 **Deployment**

### **Backend Deployment (Heroku)**
```bash
# Install Heroku CLI
heroku create sharehub-backend
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_secret
# Add database config
git push heroku main
```

### **Frontend Deployment (Netlify/Vercel)**
```bash
npm run build
# Deploy build folder to your hosting service
```

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📋 **Development Guidelines**

### **Code Style**
- Use ES6+ features
- Follow React best practices
- Use meaningful variable names
- Add comments for complex logic

### **Git Workflow**
- Create feature branches for new features
- Write descriptive commit messages
- Test before pushing
- Review code before merging

## 🐛 **Troubleshooting**

### **Common Issues**

**Backend won't start:**
- Check database connection
- Verify environment variables
- Ensure MySQL is running

**Frontend won't start:**
- Run `npm install` in frontend directory
- Check for port conflicts
- Verify API URL in .env

**Google Maps not loading:**
- Check API key in .env
- Verify API is enabled in Google Cloud
- Restart development server

## 📞 **Support**

For issues and questions:
1. Check existing GitHub issues
2. Create new issue with detailed description
3. Include error logs and screenshots

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- React.js community for excellent documentation
- Bootstrap team for the UI framework
- Google Maps API for location services
- All contributors and testers

---

**Happy Coding! 🚀**
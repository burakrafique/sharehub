# 🚀 ShareHub Setup Guide for Collaborators

## 📋 **Quick Setup Checklist**

### **1. Prerequisites Installation**
- [ ] Install [Node.js](https://nodejs.org/) (v16+)
- [ ] Install [MySQL](https://dev.mysql.com/downloads/) (v8.0+)
- [ ] Install [Git](https://git-scm.com/)
- [ ] Get [Google Maps API Key](https://console.cloud.google.com/)

### **2. Project Setup**
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sharehub.git
cd sharehub

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials

# Setup database
mysql -u root -p
CREATE DATABASE sharehub;
USE sharehub;
SOURCE ../database/schema.sql;
SOURCE ../database/seed.sql;
EXIT;

# Setup frontend
cd ../frontend
npm install
cp .env.example .env
# Add your Google Maps API key to .env

# Start both servers
cd ../backend && npm start &
cd ../frontend && npm start
```

### **3. Environment Configuration**

#### **Backend .env**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sharehub
JWT_SECRET=your_secret_key_here
PORT=5000
```

#### **Frontend .env**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### **4. Verification**
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Database connected (no errors in backend console)
- [ ] Google Maps loading in Create Item page

## 🔧 **Development Workflow**

### **Before Starting Work**
```bash
git pull origin main
cd backend && npm install
cd ../frontend && npm install
```

### **Creating New Features**
```bash
git checkout -b feature/your-feature-name
# Make your changes
git add .
git commit -m "Add: your feature description"
git push origin feature/your-feature-name
# Create Pull Request on GitHub
```

### **Testing Your Changes**
```bash
# Test backend
cd backend && npm test

# Test frontend
cd frontend && npm test

# Manual testing checklist
- [ ] Registration/Login works
- [ ] Item creation works
- [ ] Google Maps loads
- [ ] Chat functionality works
- [ ] No console errors
```

## 🆘 **Common Issues & Solutions**

### **Database Connection Error**
```bash
# Check MySQL is running
sudo service mysql start  # Linux
brew services start mysql  # Mac

# Reset database
mysql -u root -p
DROP DATABASE sharehub;
CREATE DATABASE sharehub;
USE sharehub;
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```

### **Google Maps Not Loading**
1. Check API key in `frontend/.env`
2. Enable Maps JavaScript API and Places API
3. Restart frontend server: `npm start`

### **Port Already in Use**
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5000
npx kill-port 5000
```

### **Node Modules Issues**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📞 **Getting Help**

1. **Check existing issues**: Look at GitHub issues first
2. **Ask in team chat**: Quick questions for team members
3. **Create GitHub issue**: For bugs or feature requests
4. **Documentation**: Check README.md and feature docs

## 🎯 **Development Tips**

- **Use meaningful commit messages**
- **Test before pushing**
- **Keep features small and focused**
- **Update documentation when needed**
- **Ask for code reviews**

Happy coding! 🚀
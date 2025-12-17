<<<<<<< HEAD
# 🚀 GitHub Setup Instructions

## 📋 **Step-by-Step GitHub Setup**

### **1. Create GitHub Repository**
1. Go to [GitHub.com](https://github.com) and login
2. Click **"New Repository"** (green button)
3. Fill in details:
   - **Repository name**: `sharehub`
   - **Description**: `Community marketplace for sharing, selling, and donating items`
   - **Visibility**: Public (so friends can collaborate)
   - **Don't check** "Initialize with README" (we already have one)
4. Click **"Create Repository"**

### **2. Connect Your Local Project**

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/sharehub.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### **3. Verify Upload**
- Go to your GitHub repository page
- You should see all your project files
- README.md should display the project description

### **4. Invite Collaborators**

1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. Click **"Collaborators"** in left sidebar
4. Click **"Add people"**
5. Enter your friends' GitHub usernames or emails
6. Select **"Write"** permission level
7. Click **"Add [username] to this repository"**

### **5. Share Repository with Friends**

Send your friends this information:

**Repository URL**: `https://github.com/YOUR_USERNAME/sharehub`

**Setup Instructions for Friends**:
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sharehub.git
cd sharehub

# Follow setup instructions in setup.md
```

## 🔧 **Collaboration Workflow**

### **For You (Repository Owner)**
```bash
# When you make changes
git add .
git commit -m "Describe your changes"
git push origin main
```

### **For Your Friends (Collaborators)**
```bash
# Before starting work
git pull origin main

# After making changes
git add .
git commit -m "Describe changes"
git push origin main
```

### **Using Branches (Recommended)**
```bash
# Create feature branch
git checkout -b feature/new-feature-name

# Make changes, then commit
git add .
git commit -m "Add new feature"

# Push branch
git push origin feature/new-feature-name

# Create Pull Request on GitHub
# After review, merge to main
```

## 🛡️ **Important Security Notes**

### **Environment Variables (.env files)**
- ✅ `.env` files are in `.gitignore` (won't be uploaded)
- ✅ API keys and passwords stay private
- ✅ Friends need to create their own `.env` files

### **What Friends Need to Setup**
1. **Database**: Create MySQL database locally
2. **Environment Variables**: Copy `.env.example` to `.env` and fill in their values
3. **Google Maps API**: Get their own API key
4. **Dependencies**: Run `npm install` in both frontend and backend

## 📞 **Troubleshooting**

### **"Permission denied" error**
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/YOUR_USERNAME/sharehub.git
```

### **"Repository not found" error**
- Check repository name spelling
- Ensure repository is public
- Verify GitHub username in URL

### **Large file errors**
- Check if any files are over 100MB
- Remove large files from git history if needed

### **Merge conflicts**
```bash
# Pull latest changes first
git pull origin main

# Resolve conflicts in files
# Then commit the resolution
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

## 🎯 **Best Practices**

1. **Commit Often**: Small, frequent commits are better
2. **Descriptive Messages**: Write clear commit messages
3. **Pull Before Push**: Always pull latest changes first
4. **Use Branches**: Create branches for new features
5. **Code Reviews**: Review each other's code before merging

## 📋 **Quick Commands Reference**

```bash
# Check status
git status

# See commit history
git log --oneline

# Create and switch to new branch
git checkout -b branch-name

# Switch between branches
git checkout main
git checkout feature-branch

# See all branches
git branch -a

# Delete branch
git branch -d branch-name
```

=======
# 🚀 GitHub Setup Instructions

## 📋 **Step-by-Step GitHub Setup**

### **1. Create GitHub Repository**
1. Go to [GitHub.com](https://github.com) and login
2. Click **"New Repository"** (green button)
3. Fill in details:
   - **Repository name**: `sharehub`
   - **Description**: `Community marketplace for sharing, selling, and donating items`
   - **Visibility**: Public (so friends can collaborate)
   - **Don't check** "Initialize with README" (we already have one)
4. Click **"Create Repository"**

### **2. Connect Your Local Project**

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/sharehub.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### **3. Verify Upload**
- Go to your GitHub repository page
- You should see all your project files
- README.md should display the project description

### **4. Invite Collaborators**

1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. Click **"Collaborators"** in left sidebar
4. Click **"Add people"**
5. Enter your friends' GitHub usernames or emails
6. Select **"Write"** permission level
7. Click **"Add [username] to this repository"**

### **5. Share Repository with Friends**

Send your friends this information:

**Repository URL**: `https://github.com/YOUR_USERNAME/sharehub`

**Setup Instructions for Friends**:
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sharehub.git
cd sharehub

# Follow setup instructions in setup.md
```

## 🔧 **Collaboration Workflow**

### **For You (Repository Owner)**
```bash
# When you make changes
git add .
git commit -m "Describe your changes"
git push origin main
```

### **For Your Friends (Collaborators)**
```bash
# Before starting work
git pull origin main

# After making changes
git add .
git commit -m "Describe changes"
git push origin main
```

### **Using Branches (Recommended)**
```bash
# Create feature branch
git checkout -b feature/new-feature-name

# Make changes, then commit
git add .
git commit -m "Add new feature"

# Push branch
git push origin feature/new-feature-name

# Create Pull Request on GitHub
# After review, merge to main
```

## 🛡️ **Important Security Notes**

### **Environment Variables (.env files)**
- ✅ `.env` files are in `.gitignore` (won't be uploaded)
- ✅ API keys and passwords stay private
- ✅ Friends need to create their own `.env` files

### **What Friends Need to Setup**
1. **Database**: Create MySQL database locally
2. **Environment Variables**: Copy `.env.example` to `.env` and fill in their values
3. **Google Maps API**: Get their own API key
4. **Dependencies**: Run `npm install` in both frontend and backend

## 📞 **Troubleshooting**

### **"Permission denied" error**
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/YOUR_USERNAME/sharehub.git
```

### **"Repository not found" error**
- Check repository name spelling
- Ensure repository is public
- Verify GitHub username in URL

### **Large file errors**
- Check if any files are over 100MB
- Remove large files from git history if needed

### **Merge conflicts**
```bash
# Pull latest changes first
git pull origin main

# Resolve conflicts in files
# Then commit the resolution
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

## 🎯 **Best Practices**

1. **Commit Often**: Small, frequent commits are better
2. **Descriptive Messages**: Write clear commit messages
3. **Pull Before Push**: Always pull latest changes first
4. **Use Branches**: Create branches for new features
5. **Code Reviews**: Review each other's code before merging

## 📋 **Quick Commands Reference**

```bash
# Check status
git status

# See commit history
git log --oneline

# Create and switch to new branch
git checkout -b branch-name

# Switch between branches
git checkout main
git checkout feature-branch

# See all branches
git branch -a

# Delete branch
git branch -d branch-name
```

>>>>>>> 6fe8e3fe198022fcbfc3a47885f3681502d32351
Happy collaborating! 🚀
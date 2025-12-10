# ShareHub Backend API

**Application Tier - Node.js Backend Server**

ShareHub is a 3-tier web platform for selling, donating, and swapping items (clothes, books, ration). This is the **Application Tier** (backend) that handles business logic, API endpoints, and database interactions.

---

## 📁 Project Structure

```
backend/
├── config/           # Configuration files (database, etc.)
├── controllers/      # Request handlers (business logic)
├── models/           # Database models and queries
├── routes/           # API route definitions
├── middleware/       # Custom middleware (auth, validation, etc.)
├── uploads/          # User-uploaded files
│   └── items/        # Item images
├── .env.example      # Environment variables template
├── .gitignore        # Git ignore rules
├── package.json      # Project dependencies and scripts
├── server.js         # Main server entry point
└── README.md         # This file
```

### Folder Explanations:

- **config/**: Contains configuration files like database connection settings
- **controllers/**: Contains controller functions that handle HTTP requests and responses
- **models/**: Contains database models and SQL query functions
- **routes/**: Defines API endpoints and maps them to controller functions
- **middleware/**: Custom middleware functions (authentication, error handling, validation)
- **uploads/**: Stores user-uploaded files (images, documents)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher recommended)
- **npm** (comes with Node.js)
- **MySQL** database server
- **Git** (for version control)

### Step 1: Install Dependencies

Open your terminal in the `backend` folder and run:

```bash
npm install
```

This will install all required packages listed in `package.json`.

### Step 2: Setup Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   On Windows PowerShell:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Open the `.env` file and fill in your actual values:
   - **DB_HOST**: Your MySQL host (usually `localhost`)
   - **DB_USER**: Your MySQL username (usually `root`)
   - **DB_PASSWORD**: Your MySQL password
   - **DB_NAME**: Database name (should be `sharehub`)
   - **DB_PORT**: MySQL port (usually `3306`)
   - **JWT_SECRET**: A strong random string for JWT token signing
   - **JWT_EXPIRE**: Token expiration time (e.g., `7d` for 7 days)
   - **PORT**: Server port (e.g., `5000`)
   - **NODE_ENV**: `development` or `production`
   - **MAX_FILE_SIZE**: Maximum upload size in bytes
   - **UPLOAD_PATH**: Path for uploaded files

### Step 3: Setup Database

1. Make sure MySQL is running
2. Run the database schema file:
   ```bash
   mysql -u root -p < ../database/schema.sql
   ```
3. (Optional) Load sample data:
   ```bash
   mysql -u root -p sharehub < ../database/seed.sql
   ```

### Step 4: Run the Server

#### Development Mode (with auto-reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: `5000`).

---

## 📦 Required npm Packages

### Production Dependencies:

| Package | Purpose |
|---------|---------|
| **express** | Web framework for Node.js - handles HTTP requests and routing |
| **mysql2** | MySQL database driver - connects to and queries MySQL database |
| **dotenv** | Loads environment variables from `.env` file |
| **cors** | Enables Cross-Origin Resource Sharing - allows frontend to access API |
| **bcryptjs** | Password hashing library - securely stores user passwords |
| **jsonwebtoken** | Creates and verifies JWT tokens for user authentication |
| **multer** | Handles file uploads (images, documents) |
| **express-validator** | Validates and sanitizes user input data |

### Development Dependencies:

| Package | Purpose |
|---------|---------|
| **nodemon** | Automatically restarts server when code changes (dev mode only) |

---

## 🔧 Available Scripts

- **`npm start`**: Runs the server in production mode
- **`npm run dev`**: Runs the server in development mode with auto-reload (nodemon)

---

## 📝 Environment Variables

All environment variables are defined in `.env` file. See `.env.example` for the complete list and descriptions.

**Important**: Never commit `.env` to version control! It contains sensitive information.

---

## 🗄️ Database

The database schema is defined in `../database/schema.sql`. Make sure to:

1. Create the database before running the server
2. Update database credentials in `.env` file
3. Run migrations/schema when setting up the project

---

## 🛠️ Development Tips

1. **Use `npm run dev`** during development for automatic server restarts
2. **Check console logs** for errors and debugging information
3. **Test API endpoints** using tools like Postman or Thunder Client
4. **Follow RESTful conventions** for API endpoint naming
5. **Validate all user input** before processing
6. **Use environment variables** for all configuration values

---

## 📚 API Documentation

API endpoints will be documented as they are implemented. Common endpoints include:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `GET /api/items/:id` - Get item by ID
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `POST /api/messages` - Send message
- `GET /api/messages` - Get user messages
- `POST /api/transactions` - Create transaction

---

## 👥 Authors

- **Haroon Usman**
- **Muhammad Buraq**

---

## 📄 License

ISC

---

## 🆘 Troubleshooting

### Common Issues:

1. **Database connection error**: Check MySQL is running and credentials in `.env` are correct
2. **Port already in use**: Change `PORT` in `.env` or stop the process using that port
3. **Module not found**: Run `npm install` to install dependencies
4. **JWT errors**: Make sure `JWT_SECRET` is set in `.env`

---

## 🔐 Security Notes

- Always use HTTPS in production
- Never expose sensitive data in API responses
- Validate and sanitize all user input
- Use strong JWT secrets
- Implement rate limiting for API endpoints
- Store uploaded files securely (consider cloud storage in production)

---

**Happy Coding! 🚀**


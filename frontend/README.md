# ShareHub Frontend

React-based frontend for the ShareHub platform - a community marketplace for sharing, selling, and donating items.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on http://localhost:5000

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_BACKEND_URL=http://localhost:5000
```

## Running the Application

### Development Mode
```bash
npm start
```
Runs on: http://localhost:3000

### Production Build
```bash
npm run build
```

### Run Tests
```bash
npm test
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | http://localhost:5000/api |
| `REACT_APP_BACKEND_URL` | Backend base URL | http://localhost:5000 |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Google Maps API key | - |

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navbar.js
│   │   ├── ItemCard.js
│   │   ├── SearchBar.js
│   │   └── LocationMap.js
│   ├── pages/          # Page components
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── CreateItem.js
│   │   ├── ItemDetail.js
│   │   ├── Messages.js
│   │   └── Profile.js
│   ├── services/       # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── itemService.js
│   │   └── messageService.js
│   ├── context/        # React Context
│   │   └── AuthContext.js
│   ├── utils/          # Utility functions
│   │   └── healthCheck.js
│   ├── config/         # Configuration
│   │   └── config.js
│   ├── App.js          # Main app component
│   └── index.js        # Entry point
├── .env                # Environment variables
├── .env.example        # Environment template
└── package.json        # Dependencies
```

## Features

- ✅ User Authentication (Register/Login)
- ✅ Item Management (Create/Edit/Delete)
- ✅ Advanced Search & Filters
- ✅ Real-time Messaging
- ✅ Favorites/Bookmarks
- ✅ Notifications
- ✅ User Profile Management
- ✅ Transaction History
- ✅ Location-based Search
- ✅ Image Upload
- ✅ Responsive Design

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## API Integration

The frontend communicates with the backend API at `http://localhost:5000/api`.

### Testing API Connection

Visit: http://localhost:3000/api-test

This page will test:
- Backend health
- API documentation
- Stats endpoint
- Items endpoint

## Dependencies

### Core
- React 19.2.0
- React Router DOM 7.10.0
- Axios 1.13.2

### UI
- Bootstrap 5.3.8
- React Bootstrap 2.10.10
- React Icons 5.5.0

### State Management
- React Context API

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### CORS Errors
Make sure backend CORS is configured to allow `http://localhost:3000`

### API Connection Failed
1. Check if backend is running on port 5000
2. Verify `.env` file has correct API URL
3. Check browser console for errors

### Authentication Issues
1. Clear localStorage
2. Re-login
3. Check if token is being sent in headers

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

## Support

For issues and questions, please contact the development team.

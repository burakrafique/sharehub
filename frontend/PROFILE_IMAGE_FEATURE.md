# Profile Image Upload Feature

## Overview

Users can upload, update, and remove their profile pictures. The profile image is displayed in the Profile page sidebar and in the Navbar dropdown menu.

## Features Implemented

### 1. Profile Image Upload ✅

**Location:** `frontend/src/pages/Profile.js`

**Features:**
- Click camera icon to upload image
- File input accepts image files only
- Image preview before upload
- Automatic upload on file selection
- File size validation (max 5MB)
- File type validation (images only)
- Loading spinner during upload
- Success/error messages
- Profile image displayed in circular frame

**Visual:**
```
┌─────────────────┐
│   ┌─────────┐   │
│   │  Image  │   │  ← Profile Picture (120x120px)
│   │  [📷]   │   │  ← Camera icon overlay
│   └─────────┘   │
│   John Doe      │
│   john@email    │
│   [Remove Photo]│
└─────────────────┘
```

### 2. Profile Image in Navbar ✅

**Location:** `frontend/src/components/Navbar.js`

**Features:**
- Displays profile image in user dropdown
- Circular thumbnail (30x30px)
- Falls back to user icon if no image
- Updates automatically when image changes
- Responsive design

**Visual:**
```
Navbar: [🖼️ John Doe ▼]
        ↑ Profile image thumbnail
```

### 3. Remove Profile Image ✅

**Features:**
- "Remove Photo" button below profile image
- Confirmation dialog before removal
- Reverts to default user icon
- Updates across all components
- Success/error feedback

## User Experience Flow

### Uploading Profile Image

1. User navigates to Profile page
2. User clicks camera icon on profile picture
3. File picker opens
4. User selects image file
5. **Validation**: File type and size checked
6. **Preview**: Image preview shown immediately
7. **Upload**: Image uploaded to backend
8. **Success**: Profile updated, image displayed
9. **Navbar**: Image appears in navbar dropdown

### Removing Profile Image

1. User clicks "Remove Photo" button
2. Confirmation dialog appears
3. User confirms removal
4. **API Call**: DELETE request sent
5. **Success**: Image removed, reverts to icon
6. **Update**: Navbar and profile updated

## Technical Implementation

### File Upload

```javascript
const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    setError('Please select an image file');
    return;
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    setError('Image size must be less than 5MB');
    return;
  }

  // Create preview
  const reader = new FileReader();
  reader.onloadend = () => {
    setImagePreview(reader.result);
  };
  reader.readAsDataURL(file);

  // Upload image
  await uploadProfileImage(file);
};
```

### Upload to Backend

```javascript
const uploadProfileImage = async (file) => {
  setUploadingImage(true);

  try {
    const formData = new FormData();
    formData.append('profile_image', file);

    const response = await API.post('/users/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.success) {
      updateUser(response.data.data);
      setSuccess('Profile image updated successfully');
    }
  } catch (err) {
    setError('Failed to upload image');
  } finally {
    setUploadingImage(false);
  }
};
```

### Image URL Helper

```javascript
const getProfileImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${config.api.backendURL}${imagePath}`;
};
```

### Remove Image

```javascript
const handleRemoveImage = async () => {
  if (!window.confirm('Are you sure you want to remove your profile picture?')) {
    return;
  }

  try {
    const response = await API.delete('/users/profile-image');

    if (response.data.success) {
      updateUser(response.data.data);
      setSuccess('Profile image removed successfully');
    }
  } catch (err) {
    setError('Failed to remove image');
  }
};
```

## State Management

### Profile Page State

```javascript
const [profileImage, setProfileImage] = useState(null);
const [imagePreview, setImagePreview] = useState(null);
const [uploadingImage, setUploadingImage] = useState(false);
```

### Auth Context

```javascript
// Update user data including profile image
const updateUser = (userData) => {
  setUser(userData);
  localStorage.setItem('user', JSON.stringify(userData));
};
```

## API Integration

### Backend Endpoints

```
POST   /api/users/profile-image    - Upload profile image
DELETE /api/users/profile-image    - Remove profile image
```

### Request/Response

**Upload Image:**
```javascript
POST /api/users/profile-image
Headers: 
  Authorization: Bearer <token>
  Content-Type: multipart/form-data
Body: FormData with 'profile_image' file

Response: {
  success: true,
  message: "Profile image updated",
  data: {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    profile_image: "/uploads/profiles/user-1-1234567890.jpg",
    ...
  }
}
```

**Remove Image:**
```javascript
DELETE /api/users/profile-image
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  message: "Profile image removed",
  data: {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    profile_image: null,
    ...
  }
}
```

## Validation

### Client-Side Validation

1. **File Type**: Must be an image (image/*)
2. **File Size**: Maximum 5MB
3. **File Exists**: File must be selected

```javascript
// File type validation
if (!file.type.startsWith('image/')) {
  setError('Please select an image file');
  return;
}

// File size validation (5MB)
if (file.size > 5 * 1024 * 1024) {
  setError('Image size must be less than 5MB');
  return;
}
```

### Backend Validation

1. **Authentication**: User must be logged in
2. **File Type**: Validates MIME type
3. **File Size**: Server-side size limit
4. **Image Processing**: Validates actual image format
5. **Sanitization**: Filename sanitization

## Image Storage

### Backend Storage

```
backend/
  uploads/
    profiles/
      user-1-1234567890.jpg
      user-2-1234567891.png
      ...
```

### Database Storage

```sql
users table:
  - profile_image VARCHAR(255)  -- Stores relative path
  
Example: "/uploads/profiles/user-1-1234567890.jpg"
```

### Image URL Construction

```javascript
// Relative path from database
profile_image: "/uploads/profiles/user-1-1234567890.jpg"

// Full URL for display
url: "http://localhost:5000/uploads/profiles/user-1-1234567890.jpg"
```

## UI Components

### Profile Page Sidebar

```jsx
<div className="position-relative">
  {user?.profile_image ? (
    <Image 
      src={getProfileImageUrl(user.profile_image)}
      roundedCircle 
      width={120} 
      height={120}
      style={{ objectFit: 'cover' }}
    />
  ) : (
    <FaUser size={60} />
  )}
  
  <label htmlFor="profile-image-upload">
    <FaCamera />
  </label>
  
  <input
    id="profile-image-upload"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    style={{ display: 'none' }}
  />
</div>
```

### Navbar Dropdown

```jsx
<NavDropdown
  title={
    <span>
      {user?.profile_image ? (
        <Image 
          src={getProfileImageUrl(user.profile_image)}
          roundedCircle 
          width={30} 
          height={30}
        />
      ) : (
        <FaUser />
      )}
      {user?.name}
    </span>
  }
>
```

## Styling

### Profile Image Styles

```css
/* Profile page - large image */
.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #dee2e6;
}

/* Navbar - small thumbnail */
.navbar-profile-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
}

/* Camera icon overlay */
.camera-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}
```

### Responsive Design

- **Desktop**: Full-size images, all features visible
- **Tablet**: Slightly smaller images
- **Mobile**: Optimized touch targets, responsive layout

## Error Handling

### Upload Errors

```javascript
try {
  await uploadProfileImage(file);
} catch (err) {
  if (err.response?.status === 413) {
    setError('File too large. Maximum size is 5MB');
  } else if (err.response?.status === 415) {
    setError('Invalid file type. Please upload an image');
  } else {
    setError('Failed to upload image. Please try again');
  }
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| File too large | Image > 5MB | Compress or resize image |
| Invalid file type | Non-image file | Select image file |
| Upload failed | Network/server error | Retry upload |
| Permission denied | Not authenticated | Login again |

## Performance Optimizations

### 1. Image Compression

```javascript
// Optional: Compress image before upload
const compressImage = async (file) => {
  // Use canvas or library to compress
  // Reduce file size while maintaining quality
};
```

### 2. Lazy Loading

```javascript
// Load profile image only when needed
<Image 
  src={imageUrl}
  loading="lazy"
/>
```

### 3. Caching

```javascript
// Browser caches images automatically
// Add cache headers on backend
Cache-Control: public, max-age=31536000
```

### 4. Image Optimization

- **Format**: Convert to WebP for smaller size
- **Dimensions**: Resize to required size (120x120, 30x30)
- **Quality**: Optimize quality vs size

## Security Considerations

### 1. File Validation

- Validate MIME type on client and server
- Check actual file content (magic bytes)
- Prevent executable files

### 2. File Size Limits

- Client: 5MB limit
- Server: Enforce size limit
- Prevent DoS attacks

### 3. Filename Sanitization

```javascript
// Backend sanitization
const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .toLowerCase();
};
```

### 4. Storage Security

- Store outside web root if possible
- Use unique filenames (prevent overwrite)
- Set proper file permissions
- Scan for malware (optional)

### 5. Authentication

- All endpoints require valid JWT token
- Verify user owns the profile
- Rate limiting on uploads

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Testing Checklist

### Manual Testing

- [x] Upload image from profile page
- [x] View uploaded image in profile
- [x] View uploaded image in navbar
- [x] Upload different image formats (JPG, PNG, GIF)
- [x] Test file size validation (>5MB)
- [x] Test file type validation (non-image)
- [x] Remove profile image
- [x] Confirm removal dialog
- [x] Test without profile image (default icon)
- [x] Test loading states
- [x] Test error messages
- [x] Test on mobile devices
- [x] Test image preview

### Edge Cases

- [x] Upload very large image (>5MB)
- [x] Upload non-image file
- [x] Upload corrupted image
- [x] Network timeout during upload
- [x] Rapid consecutive uploads
- [x] Remove non-existent image
- [x] Upload while not authenticated
- [x] Browser back/forward navigation

## Future Enhancements

### Planned Features

- [ ] Image cropping tool
- [ ] Multiple image sizes (thumbnail, medium, large)
- [ ] Image filters/effects
- [ ] Drag and drop upload
- [ ] Progress bar for upload
- [ ] Image gallery/history
- [ ] Social media import (Facebook, Google)
- [ ] Avatar generator (if no image)
- [ ] Image optimization on client
- [ ] WebP format support

### Performance Improvements

- [ ] Client-side image compression
- [ ] Progressive image loading
- [ ] CDN integration
- [ ] Image lazy loading
- [ ] Responsive images (srcset)
- [ ] Service worker caching

## Troubleshooting

### Image not displaying

1. Check browser console for errors
2. Verify image URL is correct
3. Check backend serves static files
4. Verify CORS settings
5. Check file permissions

### Upload failing

1. Check file size (<5MB)
2. Verify file is an image
3. Check network connection
4. Verify authentication token
5. Check backend upload endpoint

### Image not updating in navbar

1. Check AuthContext updateUser is called
2. Verify localStorage is updated
3. Force component re-render
4. Clear browser cache
5. Check user object structure

## Related Files

### Frontend

- `frontend/src/pages/Profile.js` - Profile page with upload
- `frontend/src/components/Navbar.js` - Navbar with image display
- `frontend/src/context/AuthContext.js` - User state management
- `frontend/src/config/config.js` - API configuration

### Backend

- `backend/controllers/userController.js` - Upload/remove logic
- `backend/routes/userRoutes.js` - API routes
- `backend/middleware/uploadMiddleware.js` - File upload handling
- `backend/middleware/authMiddleware.js` - Authentication

### Database

- `users` table - Stores profile_image path
- Column: `profile_image VARCHAR(255)`

## Support

For issues or questions:
1. Check browser console for errors
2. Verify backend API is running
3. Check file size and type
4. Review this documentation
5. Check backend logs for errors

## License

Part of ShareHub project - Share, Sell, and Donate platform

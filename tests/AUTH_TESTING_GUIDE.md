# ShareHub Authentication Testing Guide

This guide walks you through testing the ShareHub authentication API from scratch. It covers browser-based tests, Postman, and the Thunder Client VS Code extension. All examples assume your backend runs locally on `http://localhost:5000`.

---

## 1. Manual Testing Tools

### Browser (basic quick tests)
* Use for simple GET requests (e.g., health checks, profile once you have a token via query params or temporary tooling).
* Not ideal for POST/PUT with JSON bodies—use Postman or Thunder Client instead.

### Postman (recommended)
1. Download from [https://www.postman.com/downloads/](https://www.postman.com/downloads/).
2. Install and sign in (free account is fine).
3. Create a new **Request**.
4. Set HTTP Method, URL, Headers, Body, and click **Send**.

### Thunder Client (VS Code Extension)
1. Open VS Code → Extensions (`Ctrl+Shift+X`).
2. Search for **Thunder Client** → Install.
3. Open the **Thunder Client** icon in the sidebar.
4. Create a new request (similar fields to Postman).

You can use the same request details below in any of the tools.

---

## 2. Test Cases by Endpoint

### A. `POST /api/auth/register`
- **URL**: `http://localhost:5000/api/auth/register`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
- **Body (raw JSON)**:
  ```json
  {
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "0300-1234567",
    "role": "user",
    "address": "Test Address, Lahore",
    "latitude": 31.5204,
    "longitude": 74.3587
  }
  ```
- **Expected Response**: `201 Created`
  - JSON containing `success: true`, `token`, and `user` object (without password).
- **Extra Test**: Send the same request again → should return `400` with message indicating the user (email) already exists.

### B. `POST /api/auth/login`
- **URL**: `http://localhost:5000/api/auth/login`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
- **Body**:
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Expected Response**: `200 OK`
  - JSON containing `success: true`, `token`, and `user`.
- **Extra Test**: Change the password to something incorrect → should return `401` with message `"Invalid credentials"`.

### C. `GET /api/auth/profile`
- **URL**: `http://localhost:5000/api/auth/profile`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <paste_token_here>` (token copied from register/login response)
- **Expected Response**: `200 OK`
  - JSON containing `success: true` and the user data (no password).
- **Extra Tests**:
  - Remove the `Authorization` header → expect `401` with message `"No token, authorization denied"`.
  - Use a random/expired token → expect `401` with `"Token is not valid"`.

---

## 3. Postman / Thunder Client Tips

### Setting Headers in Postman
1. In your request tab, click the **Headers** tab.
2. Add key `Content-Type` with value `application/json`.
3. For protected routes, add key `Authorization` with value `Bearer <your_token>`.
4. Example layout you should see:
   ```
   | KEY           | VALUE                     |
   |---------------|---------------------------|
   | Content-Type  | application/json          |
   | Authorization | Bearer eyJhbGciOi...xyz   |
   ```
   > ✅ If you see both headers listed as above, you're ready to send the request.

### Setting Headers in Thunder Client
1. Open request → **Headers** tab.
2. Add the same keys/values as above.
3. Thunder Client shows headers as rows; ensure both `Content-Type` and `Authorization` display green checkmarks before sending.

### Copying the JWT Token
1. After a successful register/login call, go to the response body.
2. In Postman, click the **body** tab → hover over the token value → click the clipboard icon (looks like overlapping rectangles) to copy.
3. You can also click the three dots next to the response → **Copy Response** → paste into a text editor and extract the token.
4. Keep it handy (Notepad or clipboard manager).

### Using the Token in Subsequent Requests
1. For the profile route, paste the token into the `Authorization` header.
2. Format must be exactly: `Bearer <token>` (with one space).
3. Example header row for Postman/Thunder:
   ```
   Authorization : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Optional browser test: open Developer Tools → Network tab → manually set the header using fetch in console:
   ```js
   fetch('http://localhost:5000/api/auth/profile', {
     headers: { Authorization: 'Bearer YOUR_TOKEN_HERE' }
   }).then(r => r.json()).then(console.log);
   ```

---

## 4. Common Errors & Solutions

| Error Message | Cause | Solution |
|---------------|-------|----------|
| `Cannot POST /api/auth/register` | Server not running or wrong URL | Ensure backend is running (`npm run dev` or `npm start`). Double-check port (`5000`) and route path. |
| `ER_DUP_ENTRY` | Email already exists in DB | Use a different email or delete the existing record in the database. |
| `Invalid credentials` (login) | Wrong email or password | Verify you registered the user and typed the correct password. |
| `No token, authorization denied` | Missing `Authorization` header | Add header `Authorization: Bearer <token>` for protected routes. |
| `Token is not valid` | Token expired, malformed, or not signed with current secret | Re-login to get a fresh token, ensure `.env` `JWT_SECRET` matches server, confirm token format. |

---

## 5. Database Verification (phpMyAdmin or similar MySQL client)

1. Open **phpMyAdmin** (or any MySQL client) connected to your ShareHub database.
2. Navigate to the `users` table.
3. After registering a new user via API:
   - Click **Browse** to see the new row.
   - Confirm the `email`, `name`, `phone`, etc. match your request.
4. Verify the password column (`password_hash`) contains a hashed value:
   - It should look like `$2a$10$...` or similar (bcrypt hash).
   - This confirms hashing worked and plain text is not stored.
5. Optional: Run SQL query to check specific email:
   ```sql
   SELECT id, name, email, phone, role, password_hash
   FROM users
   WHERE email = 'test@example.com';
   ```
6. Deleting test users:
   ```sql
   DELETE FROM users WHERE email = 'test@example.com';
   ```
   (Only do this in a development database.)

---

## 6. Quick Browser Check (optional)

1. Visit `http://localhost:5000/` in your browser.
2. You should see the health-check JSON response confirming the backend is running.
3. Browser-only testing is limited—use Postman/Thunder for POST requests.

---

## 7. Testing Checklist

- [ ] Backend running locally (`npm run dev`).
- [ ] `.env` configured with database/JWT settings.
- [ ] Postman or Thunder Client installed.
- [ ] Register user → `201` response with token.
- [ ] Login user → `200` response with token.
- [ ] Profile route with token → `200` response.
- [ ] Profile route without token → `401`.
- [ ] Profile route with invalid token → `401`.
- [ ] Duplicate registration → `400`.
- [ ] Database shows new user with hashed password.

Once all boxes are ticked, your ShareHub authentication flow is verified end-to-end! 🚀


# Authentication Implementation Guide

## Overview

Pollman uses OAuth 2.0 for authentication with **Google** (no email/password). JWT tokens are issued after successful OAuth callback and used to protect dashboard routes.

---

## Key Features

✅ **Google OAuth** - No password management  
✅ **JWT Tokens** - 1-day expiry with automatic logout  
✅ **Session Management** - Express-session for smooth user experience  
✅ **Protected Routes** - Auth middleware on all dashboard endpoints  
✅ **Automatic User Creation** - First OAuth creates user record

---

## Architecture

### Authentication Flow

```
1. Frontend → GET /api/auth/google
      ↓
2. User grants permission on Google
      ↓
3. Google → Callback URL with auth code
      ↓
4. Server exchanges code for user profile
      ↓
5. Server creates/updates user in MongoDB
      ↓
6. Server generates JWT tokens
      ↓
7. Server redirects to frontend with tokens
      ↓
8. Frontend stores tokens and makes authenticated requests
```

---

## Setup Instructions

### 1. Get OAuth Credentials

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable **Google+ API**
4. Create **OAuth 2.0 Client ID** (Web application)
5. Add authorized redirect URI:

- `http://localhost:3300/api/auth/google/callback` (dev)
- `https://yourapi.com/api/auth/google/callback` (prod)

6. Copy **Client ID** and **Client Secret** to `.env`

### 2. Configure .env

```bash
# OAuth
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
BACKEND_URL=http://localhost:3300
CLIENT_URL=http://localhost:5173
JWT_SECRET=openssl_rand_hex_32
```

### 3. Start Server

```bash
npm run server:dev
```

---

## API Endpoints

### Authentication

#### GET /api/auth/google

Redirects user to Google login page.

**Response:** Redirects to Google OAuth consent screen

---

#### GET /api/auth/google/callback

OAuth callback - handled automatically by Passport.

**Query Params:**

- `code` (auto) - OAuth authorization code
- `state` (auto) - CSRF token

**Response:** Redirects to frontend with tokens:

```
http://localhost:5173/auth/success?accessToken=...&refreshToken=...&user={...}
```

---

#### POST /api/auth/logout

Clears session and logs out user.

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### GET /api/auth/me

Returns current authenticated user.

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://...",
    "googleId": "...",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## Frontend Integration

### Step 1: OAuth Redirect Buttons

```jsx
// Login Page
const handleGoogleLogin = () => {
  window.location.href = `http://localhost:3300/api/auth/google`;
};
```

### Step 2: Capture Tokens from URL

```jsx
// src/pages/auth/AuthSuccess.jsx
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const accessToken = params.get("accessToken");
  const refreshToken = params.get("refreshToken");
  const user = JSON.parse(params.get("user"));

  if (accessToken) {
    // Store in localStorage or context
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));

    // Redirect to dashboard
    navigate("/dashboard");
  }
}, []);
```

### Step 3: Attach Tokens to Requests

```jsx
// API utility
const api = axios.create({
  baseURL: "http://localhost:3300/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Step 4: Protected Routes

```jsx
// Protect dashboard routes
function PrivateRoute({ children }) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/auth/login" />;
  }

  return children;
}

// Usage
<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <DashboardHome />
    </PrivateRoute>
  }
/>;
```

---

## JWT Token Details

### Token Structure

```
Header: { alg: "HS256", typ: "JWT" }
Payload: { userId: "mongoid", iat: 1234567890, exp: 1234654290 }
Signature: HMACSHA256(secret)
```

### Expiry & Auto-Logout

- **Access Token Expiry:** 1 day (24 hours)
- **Auto Logout:** When token expires, user must re-authenticate
- **Refresh Token:** 7 days (for future refresh implementation)

### Manual Logout

User can logout by:

1. Clicking logout button → `POST /api/auth/logout`
2. Clearing localStorage tokens
3. Redirecting to login page

---

## Security Best Practices

✅ **HTTPS Only** - Use HTTPS in production (not localhost)  
✅ **HttpOnly Cookies** - Never expose JWT in JavaScript (use cookies)  
✅ **CORS** - Whitelist only trusted frontend origins  
✅ **Secure Redirect** - Validate redirect URLs to prevent open redirects  
✅ **Rate Limiting** - Add rate limits on auth endpoints  
✅ **Secret Rotation** - Rotate JWT_SECRET periodically

### Production Checklist

- [ ] Use HTTPS for OAuth callbacksSetHTTPS in env
- [ ] Store tokens in HttpOnly cookies (not localStorage)
- [ ] Add rate limiting on auth endpoints
- [ ] Enable CORS origin validation
- [ ] Use strong JWT_SECRET
- [ ] Set secure session cookies
- [ ] Implement refresh token rotation
- [ ] Add audit logging for auth events

---

## Troubleshooting

### OAuth Callback Fails

**Issue:** "Invalid redirect URI"

**Solution:**

- Verify callback URL matches exactly in OAuth provider settings
- Check BACKEND_URL in .env
- Ensure OAuth app is not rate-limited

### JWT Token Rejected

**Issue:** "Invalid or expired token"

**Solution:**

- Check JWT_SECRET matches between sessions
- Verify token format: `Bearer <token>`
- Check token expiry: `exp` claim in payload

### User Not Created

**Issue:** User exists in OAuth but not in MongoDB

**Solution:**

- Check MONGODB_URI connection
- Verify User model schema
- Check MongoDB indexes

### Session Lost After Logout

**Issue:** Still logged in after logout

**Solution:**

- Clear localStorage: `localStorage.clear()`
- Clear cookies: Check browser DevTools
- Check session middleware config

---

## Future Enhancements

- [ ] Implement refresh token rotation
- [ ] Add email verification (if switching to email-based auth)
- [ ] Social account linking (connect multiple OAuth providers)
- [ ] Two-factor authentication (2FA)
- [ ] Session management UI (view active sessions)
- [ ] IP-based suspicious login detection

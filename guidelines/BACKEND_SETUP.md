# Backend Setup & OAuth Testing Guide

## Quick Start

### Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- Google OAuth credentials
- GitHub OAuth credentials

---

## MongoDB Setup

### Option A: Local MongoDB (Fastest for Dev)

#### macOS/Linux

```bash
# Install MongoDB
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Create database
mongosh
> use pollman
> db.collections()
```

#### Windows

```cmd
# Download from https://www.mongodb.com/try/download/community
# Install and start MongoDB service
# Default: mongodb://localhost:27017/pollman
```

#### Update .env

```bash
MONGODB_URI=mongodb://localhost:27017/pollman
```

---

### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Go to **Security** → **Network Access**
4. Add IP address:
   - **Development:** Add your current IP (check: https://ifconfig.me)
   - **Production:** Use `0.0.0.0/0` only if necessary, or whitelist API server IPs
5. Create database user in **Database Access**
6. Copy connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/pollman?retryWrites=true&w=majority
   ```
7. Update .env:
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pollman?retryWrites=true&w=majority
   ```

---

## OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable **Google+ API**
4. Create **OAuth 2.0 Client ID**:
   - Type: Web application
   - Name: Pollman
   - **Authorized redirect URIs:**
     ```
     http://localhost:5000/api/auth/google/callback
     https://yourdomain.com/api/auth/google/callback (production)
     ```
5. Copy credentials to `.env`:
   ```bash
   GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxx
   ```

### GitHub OAuth

1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. **New OAuth App**:
   - Application name: Pollman
   - Homepage URL: `http://localhost:5173` (or domain)
   - Authorization callback URL: `http://localhost:5000/api/auth/github/callback`
3. Copy credentials to `.env`:
   ```bash
   GITHUB_CLIENT_ID=Ov23li4xxx
   GITHUB_CLIENT_SECRET=xxx
   ```

---

## Backend Server

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run server:dev
```

**Expected output:**

```
✅ MongoDB connected successfully
✅ Server listening on http://localhost:5000
```

### Start Production Server

```bash
npm run server:start
```

---

## Testing OAuth Flow

### 1. Test Backend Is Running

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**

     http://localhost:3300/api/auth/google/callback

{
"success": true,
"data": {
"status": "ok",
"uptime": 123.45,
"timestamp": "2024-01-15T10:30:00Z"
}
}

```

### 2. Test Google OAuth Login (Manual)

   - Authorization callback URL: `http://localhost:3300/api/auth/github/callback`
Open in browser:
http://localhost:5000/api/auth/google
```

**Expected flow:**

- Browser redirects to Google login
- User grants permissions
- Browser redirects to: `http://localhost:5173/auth/success?accessToken=...&refreshToken=...&user=...`

✅ Server listening on http://localhost:3300

````bash
# Get current user
curl -H "Authorization: Bearer <accessToken>" \
  http://localhost:5000/api/auth/me
 curl http://localhost:3300/api/health

**Expected Response:**

```json
{
 http://localhost:3300/api/auth/google
  "data": {
    "_id": "user_id",
    "email": "user@gmail.com",
    "name": "John Doe",
    "avatar": "https://...",
    "googleId": "...",
  http://localhost:3300/api/auth/me
  }
}
````

### 4. Test Logout

http://localhost:3300/api/logout

```bash
curl -X POST -H "Authorization: Bearer <accessToken>" \
```

**Expected Response:**

```json
 PORT=3300
  "success": true,
 BACKEND_URL=http://localhost:3300
}
```

---

## Troubleshooting

### MongoDB Connection Failed

**Error:** `Could not connect to any servers in your MongoDB Atlas cluster`

**Solutions:**

- Check IP is whitelisted in Atlas → Security → Network Access
- Verify MongoDB URI in `.env`
- Test connection locally: `mongosh "mongodb+srv://..."`

### OAuth Redirect Failed

**Error:** `Invalid redirect URI` or `Redirect URI doesn't match`

**Solutions:**

- Check callback URL exactly matches in OAuth provider settings
- Verify `BACKEND_URL=http://localhost:5000` in `.env`
- Ensure OAuth app URLs don't have trailing slashes
- Clear browser cache and cookies

### Passport Strategy Not Found

**Error:** `Cannot find module 'passport-google-oauth20'`

**Solution:**

```bash
npm install passport-google-oauth20 passport-github2
```

### JWT Token Rejected

**Error:** `Invalid or expired token`

**Solutions:**

- Check `JWT_SECRET` matches in `.env`
- Token format: `Authorization: Bearer <token>`
- Check token expiry (1 day from issue time)
- Try refreshing token

---

## Protected Routes

Add auth middleware to protect routes:

```js
import { authMiddleware } from "../middleware/auth.js";

router.get(
  "/polls",
  authMiddleware, // ← Checks JWT token
  getPollList,
);
```

---

## Environment Variables Checklist

```bash
# Server
NODE_ENV=development
PORT=5000
BACKEND_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/pollman
# OR
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pollman

# Auth
JWT_SECRET=your_secret_here

# OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
GITHUB_CLIENT_ID=Ov23li4xxx
GITHUB_CLIENT_SECRET=xxx
```

---

## Production Deployment

### Pre-deployment Checklist

- [ ] MongoDB Atlas cluster created with strong password
- [ ] IP whitelisted (or use 0.0.0.0/0 with caution)
- [ ] OAuth redirect URIs updated to production domain
- [ ] `NODE_ENV=production` in .env
- [ ] Strong `JWT_SECRET` generated: `openssl rand -hex 32`
- [ ] `BACKEND_URL` set to production API domain
- [ ] `CLIENT_URL` set to production frontend domain

### Deploy Backend

#### Heroku Example

```bash
heroku create pollman-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=$(openssl rand -hex 32)
git push heroku main
```

#### Docker Example

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY server ./server
COPY .env.production .env

EXPOSE 5000

CMD ["node", "server/src/server.js"]
```

```bash
docker build -t pollman-api .
docker run -p 5000:5000 --env-file .env.production pollman-api
```

---

## Next Steps

1. ✅ Setup MongoDB (local or Atlas)
2. ✅ Configure OAuth credentials
3. ✅ Start backend: `npm run server:dev`
4. ✅ Test endpoints above
5. 👉 Connect frontend to backend APIs
6. 👉 Build poll creation/response endpoints
7. 👉 Add Socket.io real-time updates

See [AUTH.md](./AUTH.md) for complete OAuth API documentation.

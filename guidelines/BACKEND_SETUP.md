# Backend Setup & OAuth Testing Guide

## Quick Start

### Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- Google OAuth credentials
- GitHub OAuth credentials

---

## MongoDB Setup

# Backend Setup & OAuth Testing Guide

This document shows how to set up the backend, configure OAuth, and test the local development server.

## Quick Start

Prerequisites:

- Node.js 16+
- MongoDB (local or Atlas)
- Google and GitHub OAuth credentials

## OAuth Setup

### Google OAuth

1. Go to Google Cloud Console and create an OAuth 2.0 Client ID (Web application).
2. Add the Authorized redirect URI for development:

```
http://localhost:3300/api/auth/google/callback
```

### GitHub OAuth

When creating a GitHub OAuth App, set the Authorization callback URL to:

```
http://localhost:3300/api/auth/github/callback
```

Copy the generated client IDs/secrets into your `.env` (or use `.env.example`).

## Start Backend

Install dependencies and start the dev server:

```bash
npm install
npm run server:dev
```

Expected output:

```
✅ MongoDB connected successfully
✅ Server listening on http://localhost:3300
```

## Test OAuth Flow

1. Verify the health endpoint:

```bash
curl http://localhost:3300/api/health
```

2. Trigger Google login manually (opens Google consent in browser):

```
http://localhost:3300/api/auth/google
```

3. After successful login the server redirects to the frontend with tokens, e.g.:

```
http://localhost:5173/auth/success?accessToken=...&refreshToken=...&user=...
```

4. Test authenticated endpoints (replace <token> with a real JWT):

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3300/api/auth/me
curl -X POST -H "Authorization: Bearer <token>" http://localhost:3300/api/logout
```

## Environment variables (examples)

```
NODE_ENV=development
PORT=3300
BACKEND_URL=http://localhost:3300
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/pollman
JWT_SECRET=openssl_rand_hex_32
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=yyy
GITHUB_CLIENT_ID=aaa
GITHUB_CLIENT_SECRET=bbb
```

## Troubleshooting

- If you see `Invalid redirect URI` from Google/GitHub, double-check the redirect URL in the provider matches `BACKEND_URL + /api/auth/<provider>/callback` exactly.
- Ensure `BACKEND_URL` in your `.env` is `http://localhost:3300` for development.
- Check MongoDB connectivity and credentials in `MONGODB_URI`.

## Production Notes

- Use HTTPS and set the production `BACKEND_URL` to your real domain.
- Keep `JWT_SECRET` secure and rotate periodically.

COPY server ./server
COPY .env.production .env

EXPOSE 5000

CMD ["node", "server/src/server.js"]

````

```bash
docker build -t pollman-api .
docker run -p 5000:5000 --env-file .env.production pollman-api
````

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

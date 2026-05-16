# PollMan

<div align="center">

![PollMan Logo](./content/logo.png)

**A Modern Full-Stack Real-Time Poll and Survey Platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-84.9%25-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-14.2%25-F7DF1E?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-010101?logo=socket.io)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Create, share, and analyze polls in real-time with live analytics and interactive dashboards.**

[Features](#-features) • [Demo](#-demo) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [Contributing](#-contributing)

</div>

---

## 🎯 Overview

**PollMan** is a comprehensive polling and survey platform designed for modern organizations and individuals. Create engaging polls, gather real-time responses, and gain actionable insights through beautiful interactive dashboards.

Whether you're conducting market research, gathering feedback, running elections, or just having fun with friends, PollMan makes it simple and engaging. Our platform leverages **OAuth authentication**, **MongoDB** for scalable data storage, **Socket.IO** for real-time updates, and **Recharts** for stunning visualizations.

---

## ✨ Features

### 📊 Core Polling Features
- **Create Custom Polls**: Design single-choice polls with multiple customizable options
- **Real-Time Results**: Watch responses come in live with instant updates via WebSocket
- **Live Analytics**: Visualize poll data with beautiful, interactive charts and graphs
- **Public Sharing**: Generate shareable links to reach a wider audience
- **Poll Publishing**: Publish polls to explore trending polls and discover insights
- **Anonymous Polling**: Support for anonymous responses with IP tracking to prevent duplicates
- **Poll Status Management**: Track active, expired, and archived polls

### 🎨 User Experience
- **Interactive Dashboards**: Comprehensive dashboard for managing all your polls
- **Live Voting**: Responsive interface for smooth poll participation
- **Analytics Visualization**: Advanced charting with Recharts for insightful data representation
- **Settings Management**: Customizable poll settings and user preferences
- **Modern UI**: Beautiful, responsive design using Material-UI, Radix UI, and Tailwind CSS
- **Responsive Design**: Mobile-first approach with full mobile support

### 🔧 Technical Capabilities
- **Real-Time Communication**: WebSocket support via Socket.IO for instant updates
- **Secure Authentication**: OAuth 2.0 integration with Google and automatic user creation
- **JWT-Based Sessions**: Secure token-based authentication with automatic logout after 24 hours
- **Type Safety**: Full TypeScript implementation for reliability
- **Scalable Architecture**: Node.js backend with MongoDB for enterprise-grade performance
- **Production-Ready**: Environment-based configuration for dev, staging, and production

---

## 📸 Demo

### Landing Page
![Landing Page](./content/landingpage.png)

### Dashboard
![Dashboard](./content/dashboardpage.png)

### Poll Analytics
![Poll Analytics](./content/pollanalytics.png)

### Live Results
![Live Results](./content/liveresultspage.png)

### Poll Questions
![Poll Questions](./content/pollquestions.png)

### Settings
![Settings](./content/settingspage.png)

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI library for building interactive components
- **TypeScript** - Type-safe JavaScript for robust development
- **Vite** - Next-generation build tool for fast development
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Material-UI (MUI) 7.3** - Enterprise-grade components
- **Radix UI** - Accessible, unstyled component primitives for customization
- **Recharts 2.15** - Composable charting library built with React
- **Socket.IO Client 4.8** - Real-time communication client
- **React Router 7.13** - Client-side routing
- **React Hook Form 7.55** - Performant form handling
- **React DnD** - Drag and drop support for polls
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notifications library

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 5.2** - Lightweight web application framework
- **Socket.IO 4.8** - Real-time bidirectional communication
- **MongoDB** - NoSQL database for scalable data storage
- **Mongoose 9.6** - MongoDB ODM for schema validation
- **JWT (jsonwebtoken 9.0)** - Secure authentication tokens
- **Passport.js 0.7** - OAuth authentication middleware
- **bcryptjs 3.0** - Password hashing and verification
- **Morgan 1.10** - HTTP request logger
- **CORS 2.8** - Cross-origin resource sharing
- **Express Session 1.19** - Session management

### Development Tools
- **TypeScript 6.0** - Static type checking
- **Nodemon 3.1** - Auto-restart development server
- **Concurrently 9.2** - Run multiple npm scripts simultaneously
- **PostCSS & Tailwind Vite** - CSS processing and Tailwind integration
- **ESLint & Prettier** - Code linting and formatting (recommended)

---

## 📁 Project Structure

```
PollMan/
├── client/                          # React frontend application
│   ├── app/
│   │   ├── components/             # Reusable React components
│   │   │   ├── ui/                # UI primitive components (buttons, forms, etc.)
│   │   │   ├── Poll/              # Poll-related components
│   │   │   ├── Layout/            # Layout wrappers and navigation
│   │   │   └── Forms/             # Reusable form components
│   │   ├── pages/                 # Page-level components
│   │   │   ├── LandingPage/       # Home page
│   │   │   ├── Dashboard/         # User dashboard
│   │   │   ├── PollDetail/        # Individual poll view
│   │   │   ├── PollAnalytics/     # Analytics dashboard
│   │   │   ├── CreatePoll/        # Poll creation
│   │   │   ├── Auth/              # Authentication pages
│   │   │   └── Settings/          # User settings
│   │   ├── context/               # React Context for state management
│   │   │   ├── AuthContext.tsx    # Authentication state
│   │   │   ├── PollContext.tsx    # Poll state management
│   │   │   └── SocketContext.tsx  # WebSocket state
│   │   ├── services/              # API and external service calls
│   │   │   ├── api.ts             # Axios instance with interceptors
│   │   │   ├── pollService.ts     # Poll API calls
│   │   │   ├── authService.ts     # Authentication API calls
│   │   │   └── socketService.ts   # WebSocket event handlers
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useAuth.ts         # Authentication hook
│   │   │   ├── usePolls.ts        # Poll management hook
│   │   │   └── useSocket.ts       # WebSocket hook
│   │   ├── lib/                   # Utility libraries and helpers
│   │   │   ├── utils.ts           # General utilities
│   │   │   ├── constants.ts       # App constants
│   │   │   └── validators.ts      # Form validators
│   │   ├── layouts/               # Layout components
│   │   │   ├── AppLayout.tsx      # Main app layout
│   │   │   └── AuthLayout.tsx     # Auth page layout
│   │   ├── routes.tsx             # React Router configuration
│   │   ├── App.tsx                # Main App component
│   │   └── utils.ts               # Utility functions
│   ├── styles/
│   │   └── global.css             # Global styles
│   ├── main.tsx                   # Entry point
│   ├── index.html                 # HTML template
│   ├── vite.config.ts             # Vite configuration
│   └── tsconfig.json              # TypeScript configuration
│
├── server/                          # Express backend application
│   ├── src/
│   │   ├── app.js                 # Express app setup
│   │   ├── server.js              # Server entry point
│   │   ├── config/                # Configuration files
│   │   │   ├── database.js        # MongoDB connection
│   │   │   ├── passport.js        # Passport OAuth setup
│   │   │   └── constants.js       # Server constants
│   │   ├── controllers/           # Request handlers
│   │   │   ├── authController.js  # Auth endpoints
│   │   │   ├── pollController.js  # Poll endpoints
│   │   │   ├── questionController.js # Question endpoints
│   │   │   └── responseController.js # Response endpoints
│   │   ├── models/                # MongoDB Mongoose models
│   │   │   ├── User.js            # User schema
│   │   │   ├── Poll.js            # Poll schema
│   │   │   ├── Question.js        # Question schema
│   │   │   ├── Response.js        # Response schema
│   │   │   └── PollAccessLog.js   # Access log schema
│   │   ├── routes/                # API endpoints
│   │   │   ├── authRoutes.js      # /api/auth/* endpoints
│   │   │   ├── pollRoutes.js      # /api/polls/* endpoints
│   │   │   ├── questionRoutes.js  # /api/questions/* endpoints
│   │   │   └── responseRoutes.js  # /api/responses/* endpoints
│   │   ├── middleware/            # Express middleware
│   │   │   ├── auth.js            # JWT verification middleware
│   │   │   ├── errorHandler.js    # Global error handler
│   │   │   └── validation.js      # Input validation middleware
│   │   ├── socket/                # Socket.IO handlers
│   │   │   ├── pollSocket.js      # Poll real-time events
│   │   │   ├── responseSocket.js  # Response real-time events
│   │   │   └── handlers.js        # Common socket handlers
│   │   ├── services/              # Business logic
│   │   │   ├── pollService.js     # Poll business logic
│   │   │   ├── responseService.js # Response processing
│   │   │   └── analyticsService.js # Analytics calculations
│   │   └── validators/            # Input validation schemas
│   │       ├── pollValidator.js   # Poll validation rules
│   │       └── responseValidator.js # Response validation rules
│   ├── AUTH.md                    # Authentication implementation guide
│   └── SCHEMA.md                  # MongoDB schema documentation
│
├── guidelines/                      # Development documentation
│   ├── Guidelines.md              # General coding guidelines
│   ├── BACKEND_SETUP.md           # Backend setup instructions
│   ├── POLL_SETUP.md              # Poll feature setup
│   ├── POLL_APIs.md               # Detailed API documentation
│   ├── POLL_APIS_COMPLETE.md      # Complete API reference
│   ├── OAUTH_COMPLETE.md          # OAuth implementation details
│   └── ATTRIBUTIONS.md            # Third-party attributions
│
├── content/                         # Images and media
│   ├── logo.png
│   ├── landingpage.png
│   ├── dashboardpage.png
│   ├── pollanalytics.png
│   ├── liveresultspage.png
│   ├── pollquestions.png
│   └── settingspage.png
│
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── package.json                     # Dependencies and scripts
├── package-lock.json                # Locked dependencies
├── postcss.config.mjs               # PostCSS configuration
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── UPDATE_ROUTES.sh                 # Script to update API routes
├── LICENSE                          # MIT License
└── README.md                        # This file
```

---

## 🔐 Authentication

PollMan uses **OAuth 2.0 with Google** for secure authentication:

### Key Features
- **Google OAuth** - No password management, seamless login
- **JWT Tokens** - 24-hour expiry with automatic logout
- **Session Management** - Express-session for smooth user experience
- **Protected Routes** - Auth middleware on all dashboard endpoints
- **Automatic User Creation** - First OAuth login creates user record in MongoDB

### Authentication Flow
```
1. User clicks "Sign in with Google"
   ↓
2. Frontend redirects to GET /api/auth/google
   ↓
3. User grants permission on Google's consent screen
   ↓
4. Google calls callback: GET /api/auth/google/callback
   ↓
5. Server creates/updates user in MongoDB
   ↓
6. Server generates JWT tokens (accessToken, refreshToken)
   ↓
7. Frontend stores tokens and makes authenticated requests
   ↓
8. All dashboard requests include Authorization header
```

### Setup Instructions

See `server/AUTH.md` for detailed OAuth setup and integration guide.

---

## 🌐 Real-Time Features

PollMan leverages **Socket.IO** for real-time, bidirectional communication:

- **Live Poll Updates**: See new responses instantly as they come in
- **Real-Time Analytics**: Charts update automatically as votes are submitted
- **Broadcast Events**: All participants see poll activities instantly
- **Connection Management**: Automatic reconnection and fallback mechanisms
- **Scalable Events**: Supports multiple concurrent users without performance degradation

### Socket Events
```javascript
// Client emits
poll:respond          // Submit answer to poll
poll:join             // Join real-time updates for poll
poll:leave            // Leave real-time updates

// Server emits
poll:updated          // Poll data changed
response:new          // New response received
analytics:updated     // Analytics recalculated
connection:established // WebSocket connected
```

---

## 📊 Analytics & Visualizations

Powered by **Recharts**, PollMan provides:

- **Interactive Charts**: Bar charts, pie charts, line graphs for poll results
- **Live Data Updates**: Real-time chart rendering as responses come in
- **Response Metrics**: Total responses, completion percentage, response timeline
- **Trend Analysis**: Track response patterns over time
- **Downloadable Reports**: Export poll results (coming soon)

---

## 🎨 UI/UX Design

### Component Libraries
- **Material-UI (MUI) 7.3**: Enterprise-grade pre-built components
- **Radix UI**: Accessible, unstyled primitives for custom styling
- **Tailwind CSS 4.1**: Rapid, utility-first CSS framework

### Design Features
- **Dark/Light Mode Support**: Theme switching capability
- **Responsive Breakpoints**: Mobile, tablet, desktop optimized
- **Touch-Friendly Interfaces**: Optimized for mobile and tablet users
- **Accessibility (a11y)**: WCAG compliance for screen readers and keyboard navigation
- **Consistent Spacing**: 8px-based spacing system
- **Micro-interactions**: Smooth animations and transitions

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v16 or higher
- **npm** or **yarn** package manager
- **MongoDB** (Atlas or local instance)
- **Git**
- Google OAuth 2.0 credentials

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/lalit999999/PollMan.git
cd PollMan
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pollman?retryWrites=true&w=majority

# Server Configuration
PORT=3000
NODE_ENV=development
BACKEND_URL=http://localhost:3000

# Client Configuration
VITE_API_URL=http://localhost:3000

# OAuth (Google)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173

# JWT
JWT_SECRET=your_random_jwt_secret_key_min_32_chars
JWT_REFRESH_SECRET=your_random_refresh_secret_key_min_32_chars
JWT_EXPIRY=24h
```

### Running the Application

#### Development Mode (Recommended)
Runs both frontend (Vite) and backend (Express) concurrently:
```bash
npm run dev
```

This command will start:
- **Frontend**: Vite dev server at `http://localhost:5173`
- **Backend**: Express server at `http://localhost:3000`

#### Production Mode
```bash
npm run build
npm start
```

#### Individual Components

**Frontend only:**
```bash
npm run client:dev
```

**Backend only:**
```bash
npm run server:dev
```

**Backend production:**
```bash
npm run server:start
```

### Accessing the Application

Once running:
- Open browser to `http://localhost:5173`
- Click "Sign in with Google"
- Complete OAuth flow
- Start creating polls!

---

## 📖 API Documentation

### Authentication Endpoints
- `GET /api/auth/google` - Initiate Google OAuth login
- `GET /api/auth/google/callback` - OAuth callback (automatic)
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

See `server/AUTH.md` for complete authentication documentation.

### Poll Endpoints
- `GET /api/polls` - List all user's polls
- `GET /api/polls/:pollId` - Get single poll details
- `POST /api/polls` - Create new poll
- `PUT /api/polls/:pollId` - Update poll
- `DELETE /api/polls/:pollId` - Delete poll
- `POST /api/polls/:pollId/publish` - Publish poll

### Question Endpoints
- `GET /api/polls/:pollId/questions` - Get poll questions
- `POST /api/polls/:pollId/questions` - Add question to poll
- `PUT /api/questions/:questionId` - Update question
- `DELETE /api/questions/:questionId` - Delete question

### Response Endpoints
- `GET /api/polls/:pollId/responses` - Get poll responses
- `POST /api/polls/:pollId/respond` - Submit response to poll
- `GET /api/polls/:pollId/analytics` - Get poll analytics

See `guidelines/POLL_APIs_COMPLETE.md` for complete API reference.

---

## 📊 Database Schema

PollMan uses MongoDB with the following main collections:

### Collections
1. **Users** - User profiles from Google OAuth
2. **Polls** - Poll documents with metadata
3. **Questions** - Poll questions (embedded in polls)
4. **Responses** - User responses to polls
5. **PollAccessLog** - Activity logging (auto-deletes after 90 days)

### Key Relationships
```
User (1) ──→ (Many) Polls
Poll (1) ──→ (Many) Questions
Poll (1) ──→ (Many) Responses
Question (1) ──→ (Many) Response Answers
User (1) ──→ (Many) Responses (authenticated responses)
```

See `server/SCHEMA.md` for detailed schema documentation.

---

## 🧪 Testing

*(Coming soon)*

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 1. Fork the repository
```bash
git clone https://github.com/yourusername/PollMan.git
cd PollMan
```

### 2. Create a feature branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make your changes
- Follow the existing code style
- Write meaningful commit messages
- Keep commits atomic and focused
- Add tests for new features
- Update documentation as needed

### 4. Test your changes
```bash
npm run dev
```

### 5. Push to your fork
```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request
- Describe your changes clearly
- Link any related issues
- Request review from maintainers
- Ensure all tests pass

### Code Style Guidelines
- Use **TypeScript** for type safety
- Follow **ESLint** configuration
- Use **Prettier** for code formatting
- Write descriptive variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused

---

## 📋 Roadmap

### Current Features ✅
- ✅ Google OAuth authentication
- ✅ Create single-choice polls
- ✅ Real-time poll responses
- ✅ Live analytics dashboard
- ✅ Poll publishing and sharing
- ✅ Anonymous responses

### Upcoming Features 🚀
- [ ] Multi-choice and open-ended questions
- [ ] Poll templates library
- [ ] Advanced analytics and reporting
- [ ] API documentation with Swagger
- [ ] Webhooks for integrations
- [ ] AI-powered insights
- [ ] Multilingual support
- [ ] Custom branding options
- [ ] Mobile native applications
- [ ] Export to CSV/Excel
- [ ] Scheduled poll publishing
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Rate limiting and anti-spam

---

## 🐛 Bug Reports & Issues

Found a bug? Have a suggestion? Please [open an issue](https://github.com/lalit999999/PollMan/issues) with:

- **Clear description** of the problem
- **Steps to reproduce** the issue
- **Expected vs actual** behavior
- **Screenshots/videos** if applicable
- **Environment details** (OS, browser, Node version)

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### You are free to:
- ✅ Use commercially
- ✅ Modify the code
- ✅ Distribute copies
- ✅ Use privately

### With the condition:
- 📌 Include license and copyright notice

---

## 📚 Documentation

For detailed documentation, see:
- `guidelines/Guidelines.md` - General coding guidelines
- `guidelines/BACKEND_SETUP.md` - Backend setup instructions
- `server/AUTH.md` - Authentication implementation guide
- `server/SCHEMA.md` - MongoDB schema documentation
- `guidelines/POLL_SETUP.md` - Poll feature setup
- `guidelines/POLL_APIs_COMPLETE.md` - Complete API reference

---

## 🔗 Connect & Support

Have questions? Want to collaborate? Get in touch!

- **LinkedIn**: [Lalit Gujar](https://www.linkedin.com/in/lalitgujar)
- **GitHub**: [@lalit999999](https://github.com/lalit999999)
- **Issues**: [GitHub Issues](https://github.com/lalit999999/PollMan/issues)
- **Email**: [Your Email]

---

## 💡 Inspiration & Credits

Built with ❤️ using:
- **React 18** - UI library
- **Node.js & Express** - Backend framework
- **MongoDB** - Database
- **Socket.IO** - Real-time communication
- **Recharts** - Data visualization
- **Material-UI & Radix UI** - Component libraries
- **Tailwind CSS** - Styling

Special thanks to the open-source community!

---

## ⭐ Show Your Support

If you find PollMan useful, please consider:
- Giving us a ⭐ on GitHub
- Sharing the project with others
- Contributing to development
- Providing feedback and suggestions
- Sponsoring the project

---

<div align="center">

**Made with 💚 by [Lalit Gujar](https://www.linkedin.com/in/lalitgujar)**

*Empowering real-time polling for everyone*

**[⬆ Back to Top](#pollman)**

</div>

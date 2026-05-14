# PollMan

<div align="center">

![PollMan Logo](./content/logo.png)

**A Modern Full-Stack Real-Time Poll and Survey Platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-84.9%25-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-14.2%25-F7DF1E?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql)](https://www.postgresql.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-010101?logo=socket.io)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Create, share, and analyze polls in real-time with live analytics and interactive dashboards.**

[Features](#-features) • [Demo](#-demo) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Contributing](#-contributing)

</div>

---

## 🎯 Overview

**PollMan** is a comprehensive polling and survey platform designed for modern organizations and individuals. Create engaging polls, gather real-time responses, and gain actionable insights through interactive dashboards. Built with cutting-edge technologies, PollMan provides a seamless experience for both poll creators and respondents.

Whether you're conducting market research, gathering feedback, running elections, or just having fun with friends, PollMan makes it simple and engaging.

---

## ✨ Features

### 📊 Core Polling Features
- **Create Custom Polls**: Design polls with multiple question types and customizable options
- **Real-Time Results**: Watch responses come in live with instant updates via WebSocket
- **Live Analytics**: Visualize poll data with beautiful, interactive charts and graphs
- **Public Sharing**: Generate shareable links to reach a wider audience
- **Poll Publishing**: Publish polls to explore trending polls and discover insights

### 🎨 User Experience
- **Interactive Dashboards**: Comprehensive dashboard for managing all your polls
- **Live Voting**: Responsive interface for smooth poll participation
- **Analytics Visualization**: Advanced charting with Recharts for insightful data representation
- **Settings Management**: Customizable poll settings and user preferences
- **Modern UI**: Beautiful, responsive design using Material-UI and Radix components

### 🔧 Technical Capabilities
- **Real-Time Communication**: WebSocket support via Socket.IO for instant updates
- **Secure Authentication**: OAuth integration (GitHub, Google) and JWT-based sessions
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation for reliability
- **Scalable Architecture**: Node.js backend with PostgreSQL database

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
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI** - Comprehensive React component library
- **Radix UI** - Unstyled, accessible component primitives
- **Recharts** - Composable charting library built with React
- **Socket.IO Client** - Real-time communication client
- **React Router** - Client-side routing
- **React Hook Form** - Performant form handling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **PostgreSQL** - Reliable relational database
- **Mongoose** - MongoDB ODM (if using MongoDB)
- **JWT** - Secure authentication tokens
- **Passport.js** - OAuth authentication middleware
- **bcryptjs** - Password hashing

### Development Tools
- **TypeScript** - Static type checking
- **Nodemon** - Auto-restart development server
- **Concurrently** - Run multiple npm scripts simultaneously
- **Tailwind CSS Vite** - Vite plugin for Tailwind

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- PostgreSQL (for database)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/lalit999999/PollMan.git
cd PollMan
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pollman

# Server
PORT=3000
NODE_ENV=development

# Client
VITE_API_URL=http://localhost:3000

# OAuth (Optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# JWT
JWT_SECRET=your_jwt_secret_key
```

### Running the Application

#### Development Mode
Run both frontend and backend concurrently:
```bash
npm run dev
```

This command will start:
- **Frontend**: Vite dev server at `http://localhost:5173`
- **Backend**: Express server at `http://localhost:3000`

#### Production Build
```bash
npm run build
npm start
```

#### Individual Server/Client
```bash
# Frontend only
npm run client:dev

# Backend only
npm run server:dev

# Backend production
npm run server:start
```

---

## 📁 Project Structure

```
PollMan/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── App.tsx        # Main App component
│   └── index.html
│
├── server/                 # Express backend application
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── middleware/    # Express middleware
│   │   ├── socket/        # Socket.IO handlers
│   │   └── server.js      # Server entry point
│
├── content/                # Images and media
├── guidelines/             # Documentation
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── tailwind.config.js      # Tailwind CSS configuration
```

---

## 🔐 Authentication

PollMan supports multiple authentication methods:

### Email/Password
- Secure password hashing with bcryptjs
- JWT-based session management

### OAuth
- GitHub authentication
- Google OAuth 2.0

Sessions are managed with `express-session` and `passport.js` for secure, scalable authentication.

---

## 🌐 Real-Time Features

PollMan leverages **Socket.IO** for real-time, bidirectional communication:

- **Live Poll Updates**: See new responses instantly
- **Real-Time Analytics**: Charts update as votes come in
- **Broadcast Events**: Notify all participants of poll activities
- **Connection Management**: Automatic reconnection and fallback mechanisms

---

## 📊 Analytics & Visualizations

Powered by **Recharts**, PollMan provides:

- **Interactive Charts**: Bar charts, pie charts, line graphs
- **Live Data Updates**: Real-time chart rendering
- **Export Capabilities**: Download poll results and analytics
- **Trend Analysis**: Track response patterns over time

---

## 🎨 UI/UX Design

### Component Libraries
- **Material-UI (MUI)**: Enterprise-grade components
- **Radix UI**: Accessible, unstyled primitives for customization
- **Tailwind CSS**: Rapid, utility-first styling

### Responsive Design
- Mobile-first approach
- Responsive breakpoints
- Touch-friendly interfaces
- Accessibility (a11y) compliance

---

## 🧪 Testing

*(Documentation for testing setup coming soon)*

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/PollMan.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Write meaningful commit messages
   - Keep commits atomic and focused

4. **Test your changes**
   ```bash
   npm run dev
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Describe your changes clearly
   - Link any related issues
   - Request review from maintainers

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting
- Write descriptive variable and function names

---

## 📋 Roadmap

- [ ] Enhanced poll templates
- [ ] Advanced analytics and reporting
- [ ] API documentation with Swagger
- [ ] Mobile native applications
- [ ] Webhooks for integrations
- [ ] AI-powered insights
- [ ] Multilingual support
- [ ] Custom branding options

---

## 🐛 Bug Reports & Issues

Found a bug? Have a suggestion? Please [open an issue](https://github.com/lalit999999/PollMan/issues) with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if applicable
- Environment details

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

The MIT License allows you to:
- ✅ Use commercially
- ✅ Modify the code
- ✅ Distribute copies
- ✅ Use privately

With the conditions:
- 📌 Include license and copyright notice

---

## 🔗 Connect & Support

Have questions? Want to collaborate? Get in touch!

- **LinkedIn**: [Lalit Gujar](https://www.linkedin.com/in/lalitgujar)
- **GitHub**: [@lalit999999](https://github.com/lalit999999)
- **Issues**: [GitHub Issues](https://github.com/lalit999999/PollMan/issues)

---

## 💡 Inspiration & Credits

Built with ❤️ using:
- React ecosystem
- Node.js community
- Open-source libraries and frameworks

---

## ⭐ Show Your Support

If you find PollMan useful, please consider:
- Giving us a ⭐ on GitHub
- Sharing the project with others
- Contributing to development
- Providing feedback

---

<div align="center">

**Made with 💚 by [Lalit Gujar](https://www.linkedin.com/in/lalitgujar)**

*Empowering real-time polling for everyone*

</div>

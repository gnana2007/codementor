# CodeMentor.AI - Full-Stack Application

A comprehensive full-stack web application that helps students learn programming through AI-powered code debugging and multilingual tutoring.

![CodeMentor.AI](https://img.shields.io/badge/AI-Powered-blue) ![React](https://img.shields.io/badge/React-18-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![MongoDB](https://img.shields.io/badge/MongoDB-8.0+-green)

---

## 📋 Features

### 1️⃣ Code Debugging System
- **Upload or Paste Code**: Support for `.py`, `.cpp`, `.js`, `.java`, `.c` files
- **Intelligent Analysis**: Detects syntax errors, logical issues, and runtime risks
- **Beginner-Friendly Explanations**: Every error explained in simple terms
- **Auto-Fix**: Get corrected code instantly
- **Split View**: Compare original vs fixed code side-by-side
- **Download Fixed Code**: Save corrected files directly
- **History**: View past code analyses stored in MongoDB

### 2️⃣ Multilingual AI Chatbot
- **8+ Languages Supported**: English, Telugu (తెలుగు), Tamil (தமிழ்), Hindi (हिंदी), Malayalam (മലയാളം), Kannada (ಕನ್ನಡ), Punjabi (ਪੰਜਾਬੀ), Bengali (বাংলা)
- **Auto Language Detection**: Responds in the same language you ask
- **Floating Chat Interface**: Accessible from anywhere
- **Coding Tutor**: Explains concepts, debugs code, provides guidance
- **Supportive & Patient**: Designed for beginners
- **Conversation History**: All chats stored in MongoDB

---

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS 4.0** for styling
- **shadcn/ui** components
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **RESTful API** architecture

---

## 📁 Project Structure

```
codementor.ai-development/
├── server.js                 # Main server entry point
├── server/
│   ├── config/
│   │   └── database.js      # MongoDB connection config
│   ├── controllers/
│   │   ├── codeController.js
│   │   └── chatController.js
│   ├── models/
│   │   ├── CodeAnalysis.js
│   │   └── ChatMessage.js
│   └── routes/
│       ├── codeRoutes.js
│       └── chatRoutes.js
├── src/
│   ├── components/           # React components
│   ├── utils/
│   │   └── api.ts           # API client functions
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── .env                      # Environment variables (create this)
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** installed
- **MongoDB** installed and running (or MongoDB Atlas connection string)
- **npm** or **yarn** package manager

### Installation

1. **Clone or download the project**

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/codementor

# Server Port
PORT=5000

# Frontend API URL (for production)
VITE_API_URL=http://localhost:5000/api

# Node Environment
NODE_ENV=development
```

**For MongoDB Atlas (cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/codementor?retryWrites=true&w=majority
```

4. **Start MongoDB** (if using local MongoDB)
```bash
# On macOS/Linux
mongod

# On Windows
# Start MongoDB service from Services or run:
net start MongoDB
```

5. **Start the backend server**
```bash
# Development mode (with auto-reload)
npm run dev:server

# Or production mode
npm start
```

The server will run on `http://localhost:5000`

6. **Start the frontend** (in a new terminal)
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

---

## 📡 API Endpoints

### Code Analysis

- **POST** `/api/code/analyze` - Analyze code
  ```json
  {
    "code": "your code here",
    "language": "python",
    "fileName": "optional filename"
  }
  ```

- **GET** `/api/code/history?limit=10` - Get analysis history

- **GET** `/api/code/:id` - Get specific analysis by ID

### Chat

- **POST** `/api/chat/message` - Send chat message
  ```json
  {
    "message": "your question",
    "conversationId": "optional conversation ID"
  }
  ```

- **GET** `/api/chat/history?conversationId=xxx&limit=50` - Get chat history

### Health Check

- **GET** `/api/health` - Server health status

---

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run dev:server` - Start backend server with nodemon (auto-reload)
- `npm start` - Start backend server (production)
- `npm run server` - Alias for `npm start`
- `npm run build` - Build frontend for production

### Running Both Servers

**Option 1: Two terminals**
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev
```

**Option 2: Use a process manager** (like `concurrently`)
```bash
npm install --save-dev concurrently
```

Then add to `package.json`:
```json
"dev:all": "concurrently \"npm run dev:server\" \"npm run dev\""
```

---

## 🗄️ Database Models

### CodeAnalysis
- `code` - Original code
- `language` - Programming language
- `summary` - Analysis summary
- `errors` - Array of error objects
- `fixed_code` - Corrected code
- `fileName` - Original file name
- `createdAt` - Timestamp

### ChatMessage
- `message` - User's message
- `response` - AI response
- `detectedLanguage` - Detected language code
- `conversationId` - Conversation identifier
- `createdAt` - Timestamp

---

## 🔧 Configuration

### MongoDB Connection

The app connects to MongoDB using the `MONGO_URI` environment variable. 

**Local MongoDB:**
```env
MONGO_URI=mongodb://localhost:27017/codementor
```

**MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/codementor
```

### Frontend API Configuration

The frontend uses `VITE_API_URL` to connect to the backend. In development, Vite proxy handles this automatically. For production, set:

```env
VITE_API_URL=https://your-api-domain.com/api
```

---

## 🚢 Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Ensure MongoDB is accessible (use MongoDB Atlas for cloud)
3. Run `npm start` or use a process manager like PM2

### Frontend Deployment

1. Build the frontend: `npm run build`
2. Deploy the `build` folder to:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting service

3. Set `VITE_API_URL` to your backend URL

---

## 🔐 Security Notes

- Never commit `.env` file to version control
- Use environment variables for sensitive data
- Implement rate limiting in production
- Add authentication/authorization as needed
- Sanitize user inputs
- Use HTTPS in production

---

## 📝 Notes

- The current AI analysis and chat responses use mock implementations
- Replace the mock functions in controllers with actual AI service integrations
- Consider adding user authentication for production use
- Add rate limiting to prevent abuse
- Implement proper error logging and monitoring

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

ISC

---

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongosh` or check service status
- Verify `MONGO_URI` in `.env` is correct
- Check firewall settings if using remote MongoDB

### Port Already in Use
- Change `PORT` in `.env` or kill the process using the port
- Windows: `netstat -ano | findstr :5000` then `taskkill /PID <pid> /F`
- macOS/Linux: `lsof -ti:5000 | xargs kill`

### Frontend Can't Connect to Backend
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `.env`
- Verify CORS is enabled (already configured in `server.js`)

---

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

---

**Happy Coding! 🚀**

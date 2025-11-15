# CodeMentor.AI - Project Structure

## 📁 Complete Folder Structure

```
codementor.ai-development/
│
├── server.js                    # Main Express server entry point
├── package.json                 # Dependencies and scripts
├── package-lock.json            # Locked dependency versions
├── vite.config.ts              # Vite configuration (frontend)
├── index.html                  # HTML entry point
├── .env                        # Environment variables (create this)
├── .gitignore                  # Git ignore rules
├── README.md                   # Main documentation
├── PROJECT_STRUCTURE.md        # This file
│
├── server/                      # Backend server code
│   ├── config/
│   │   └── database.js        # MongoDB connection configuration
│   │
│   ├── controllers/            # Request handlers
│   │   ├── codeController.js  # Code analysis endpoints
│   │   └── chatController.js  # Chat message endpoints
│   │
│   ├── models/                 # Mongoose models
│   │   ├── CodeAnalysis.js   # Code analysis data model
│   │   └── ChatMessage.js      # Chat message data model
│   │
│   └── routes/                 # API route definitions
│       ├── codeRoutes.js      # Code analysis routes
│       └── chatRoutes.js      # Chat routes
│
└── src/                        # Frontend React application
    ├── main.tsx               # React entry point
    ├── App.tsx                # Main App component
    ├── index.css              # Global styles
    │
    ├── components/            # React components
    │   ├── ChatBot.tsx        # Chatbot component
    │   ├── ChatMessage.tsx    # Individual chat message
    │   ├── CodeDebugger.tsx   # Code analysis interface
    │   ├── CodeViewer.tsx     # Code display component
    │   ├── ErrorList.tsx      # Error display component
    │   │
    │   ├── figma/
    │   │   └── ImageWithFallback.tsx
    │   │
    │   └── ui/                 # shadcn/ui components
    │       ├── accordion.tsx
    │       ├── alert-dialog.tsx
    │       ├── alert.tsx
    │       ├── aspect-ratio.tsx
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── breadcrumb.tsx
    │       ├── button.tsx
    │       ├── calendar.tsx
    │       ├── card.tsx
    │       ├── carousel.tsx
    │       ├── chart.tsx
    │       ├── checkbox.tsx
    │       ├── collapsible.tsx
    │       ├── command.tsx
    │       ├── context-menu.tsx
    │       ├── dialog.tsx
    │       ├── drawer.tsx
    │       ├── dropdown-menu.tsx
    │       ├── form.tsx
    │       ├── hover-card.tsx
    │       ├── input-otp.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── menubar.tsx
    │       ├── navigation-menu.tsx
    │       ├── pagination.tsx
    │       ├── popover.tsx
    │       ├── progress.tsx
    │       ├── radio-group.tsx
    │       ├── resizable.tsx
    │       ├── scroll-area.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── sheet.tsx
    │       ├── sidebar.tsx
    │       ├── skeleton.tsx
    │       ├── slider.tsx
    │       ├── sonner.tsx
    │       ├── switch.tsx
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       ├── textarea.tsx
    │       ├── toggle-group.tsx
    │       ├── toggle.tsx
    │       ├── tooltip.tsx
    │       ├── use-mobile.ts
    │       └── utils.ts
    │
    ├── utils/                  # Utility functions
    │   └── api.ts             # API client functions
    │
    ├── styles/                 # Additional styles
    │   └── globals.css
    │
    ├── guidelines/             # Documentation
    │   └── Guidelines.md
    │
    ├── README.md              # Frontend-specific docs
    ├── LINGO_WORKFLOW_GUIDE.md # Legacy workflow guide
    └── Attributions.md        # Attribution information
```

## 🔄 Data Flow

### Code Analysis Flow
```
User Input (Frontend)
  ↓
CodeDebugger Component
  ↓
api.ts → analyzeCode()
  ↓
POST /api/code/analyze
  ↓
codeController.js → analyzeCode()
  ↓
MongoDB (CodeAnalysis Model)
  ↓
Response with analysis results
  ↓
Frontend displays results
```

### Chat Flow
```
User Message (Frontend)
  ↓
ChatBot Component
  ↓
api.ts → sendChatMessage()
  ↓
POST /api/chat/message
  ↓
chatController.js → sendMessage()
  ↓
MongoDB (ChatMessage Model)
  ↓
Response with AI reply
  ↓
Frontend displays message
```

## 📦 Key Files Explained

### Backend Files

**server.js**
- Main Express server
- Sets up middleware (CORS, JSON parsing)
- Connects to MongoDB
- Registers routes
- Starts HTTP server

**server/config/database.js**
- MongoDB connection logic
- Error handling for database connection

**server/models/**
- Mongoose schemas defining data structure
- CodeAnalysis: Stores code analysis results
- ChatMessage: Stores chat conversations

**server/controllers/**
- Business logic for API endpoints
- codeController: Handles code analysis requests
- chatController: Handles chat message requests

**server/routes/**
- Route definitions mapping URLs to controllers
- codeRoutes: `/api/code/*` endpoints
- chatRoutes: `/api/chat/*` endpoints

### Frontend Files

**src/App.tsx**
- Main application component
- Layout and routing structure

**src/components/CodeDebugger.tsx**
- Code analysis interface
- File upload/paste functionality
- Results display

**src/components/ChatBot.tsx**
- Chatbot interface
- Message handling
- Multilingual support UI

**src/utils/api.ts**
- API client functions
- All HTTP requests to backend
- Error handling

## 🗄️ Database Schema

### CodeAnalysis Collection
```javascript
{
  code: String,
  language: String, // 'python' | 'javascript' | 'java' | 'cpp' | 'c'
  summary: String,
  errors: [{
    line: Number,
    issue: String,
    explanation: String,
    severity: 'error' | 'warning' | 'info'
  }],
  fixed_code: String,
  fileName: String,
  createdAt: Date
}
```

### ChatMessage Collection
```javascript
{
  message: String,
  response: String,
  detectedLanguage: String,
  conversationId: String,
  createdAt: Date
}
```

## 🔌 API Endpoints Summary

### Code Analysis
- `POST /api/code/analyze` - Analyze code
- `GET /api/code/history` - Get analysis history
- `GET /api/code/:id` - Get specific analysis

### Chat
- `POST /api/chat/message` - Send message
- `GET /api/chat/history` - Get chat history

### System
- `GET /api/health` - Health check

## 🚀 Running the Application

1. **Backend**: `npm run dev:server` (port 5000)
2. **Frontend**: `npm run dev` (port 3000)
3. **MongoDB**: Must be running on configured URI

## 📝 Environment Variables

Required in `.env`:
- `MONGO_URI` - MongoDB connection string
- `PORT` - Backend server port (default: 5000)
- `VITE_API_URL` - Frontend API URL (optional, defaults to localhost:5000)
- `NODE_ENV` - Environment (development/production)


# WorkflowGPT 🤖

WorkflowGPT is a powerful, production-ready AI Automation Agent built with Node.js, TypeScript, and React. It uses LLMs (via Groq) to understand user intent and execute complex workflows using a modular tool-calling system.

## ✨ Key Features
- **Agentic Workflow**: The AI doesn't just chat; it executes "Tools" to perform actions (Finance, Approvals, Notifications, User Management).
- **Premium Dashboard**: A sleek, dark-themed React UI with real-time tool execution monitoring and glassmorphism design.
- **Self-Correction Layer**: Handles AI formatting variations (e.g., JSON-in-text fallback) to ensure robust execution.
- **Real-time Notifications**: Integrated with Socket.IO for live feedback.
- **Production Ready**: Clean architecture, comprehensive logging, and robust error handling.

## 🛠️ Technology Stack
- **Backend**: Node.js, Express, TypeScript, Mongoose (MongoDB)
- **AI**: Groq SDK (Llama 3.1 / 3.3 models)
- **Frontend**: React (Vite), Framer Motion (Animations), Lucide-React (Icons)
- **Communication**: Socket.IO for real-time updates

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (running locally or a Cloud URI)
- Groq API Key

### 2. Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd WorkflowGPT

# Install Backend dependencies
npm install

# Install Frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Variables
Create a `.env` file in the root directory based on `.env.example`:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/workflow_gpt
GROQ_API_KEY=your_key_here
```

### 4. Running the Project
Run both the backend and the frontend with a single command:
```bash
npm run dev:full
```
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **Swagger Docs**: http://localhost:5000/api-docs

## 🧩 Available Tools
The agent currently has access to:
- **Finance**: `getUserTransactions`, `addTransaction`, `getTotalSpending`
- **Workflow**: `getPendingApprovals`, `approveRequest`, `rejectRequest`
- **User**: `getUserInfo`, `updateUserInfo`
- **System**: `sendNotification`

## 📄 License
MIT

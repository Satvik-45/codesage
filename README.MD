# CodeSage Frontend

CodeSage Frontend is a ChatGPT-inspired conversational UI with a slight IDE aesthetic, built to interact with the CodeSage RAG backend.

It enables repository uploads, conversational querying, reference inspection, and repository-level chat history management.

## Live Link
https://codesage-liard.vercel.app/new
---

## 🏗 Tech Stack

- React (Vite)
- TypeScript
- TailwindCSS
- React Router
- React Markdown
- React Syntax Highlighter
- Vercel (Deployment)

---

## 🎨 UI Philosophy

The interface replicates:

- ChatGPT-style layout
- Fixed sidebar
- Centered empty state
- Clean conversation flow
- Expandable code references
- Professional dark theme
- Balanced spacing and alignment

---

## 📂 Project Structure

src/
├── components/
│ ├── chat/
│ ├── sidebar/
│ └── layout/
├── pages/
│ ├── NewRepository.tsx
│ ├── RepositoryChat.tsx
│ └── Status.tsx
├── services/api.ts
└── App.tsx


---

## 🚀 Core Features

### Repository Upload
- Upload ZIP file
- Connect GitHub repository
- Redirect to repository chat
- Persistent repository list in sidebar

---

### Conversational Interface

- ChatGPT-style message bubbles
- Markdown rendering
- Syntax-highlighted code blocks
- Thinking indicator
- Scroll management
- Centered empty state

---

### Reference Rendering

Each assistant message may include expandable references:

- File path
- Exact startLine and endLine
- Code snippet only
- Syntax highlighted
- Dropdown toggle per reference

No full file dumping — only relevant chunks.

---

### History Management

- Repository-level chat history
- Load history when repository opened
- Delete individual chat
- Clear repository chat history
- Delete repository entirely

---

### Health Status Page

Displays backend connectivity:

- Backend status
- Database status

Connected to `/health` endpoint.

---

## 🔄 API Integration

All API calls centralized in:

src/services/api.ts


Includes:

- uploadZip
- connectGithub
- askQuestion
- getHistory
- getRepositories
- deleteRepository
- clearRepositoryHistory
- deleteChat
- getHealth

---

## 🌐 Environment Variables

VITE_API_BASE_URL=


Must point to deployed backend URL.

Example:

VITE_API_BASE_URL=https://codesage-api-u9b7.onrender.com


---

## ⚙️ Local Setup
npm install
npm run dev

## 🚀 Deployment
Hosted on Vercel
Connected to production backend
Environment variables configured via Vercel dashboard

## 🎯 UX Design Considerations
Empty state vertically centered
Balanced spacing between messages
Input field centered and fixed
No UI congestion
Professional spacing and padding
Responsive layout

## 🧠 Architectural Separation
Frontend Responsibilities:
UI rendering
State management
Reference display
API consumption

Backend Responsibilities:
Retrieval
Embeddings
Vector search
LLM reasoning
Persistence
Clean separation of concerns.

## 📈 Future Improvements
Streaming answer rendering
File tree preview
Side-by-side code diff
Theme switch (light/dark)
Keyboard shortcuts
Multi-repository comparison

## 👨‍💻 Author
Built as part of a full-stack RAG system assessment demonstrating:
Modern frontend architecture
Professional UI replication
Backend integration
Clean system design
Production deployment

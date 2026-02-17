import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { Sidebar } from "./components/sidebar/Sidebar";
import { NewRepository } from "./pages/NewRepository";
import { RepositoryChat } from "./pages/RepositoryChat";
import { Status } from "./pages/Status";
import { api } from "./services/api";
interface Repository {
  id: string;
  name: string;
  createdAt: string;
}

interface ChatHistory {
  id: string;
  question: string;
  repositoryId: string;
}

function AppContent() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [activeRepositoryId, setActiveRepositoryId] = useState<string>();
  const [activeChatId, setActiveChatId] = useState<string>();
  const [chatResetKey, setChatResetKey] = useState(0);
  const navigate = useNavigate();

  const fetchRepositories = async () => {
    try {
      const repos: any = await api.getRepositories();
      if (repos.repositories) {
        setRepositories(repos.repositories);
        localStorage.setItem("repositories", JSON.stringify(repos.repositories));
      }
    } catch (err) {
      const stored = localStorage.getItem("repositories");
      if (stored) {
        setRepositories(JSON.parse(stored));
      }
    }
  };

  const fetchChatHistory = async (repositoryId: string) => {
    try {
      const history: any = await api.getHistory(repositoryId);
      const rawMessages: any[] = Array.isArray(history) ? history : [];
      const chats: ChatHistory[] = rawMessages.map((item: any) => ({
        id: item.id,
        question: item.question?.substring(0, 60) + (item.question?.length > 60 ? "..." : ""),
        repositoryId: repositoryId,
      }));
      setChatHistory(chats);
      localStorage.setItem("chatHistory", JSON.stringify(chats));
    } catch (err) {
      const stored = localStorage.getItem("chatHistory");
      if (stored) {
        setChatHistory(JSON.parse(stored));
      }
    }
  };

  useEffect(() => {
    fetchRepositories();

    const activeId = localStorage.getItem("activeRepositoryId");
    if (activeId) {
      setActiveRepositoryId(activeId);
      fetchChatHistory(activeId);
    }
  }, []);

  const handleSelectRepository = (id: string) => {
    setActiveRepositoryId(id);
    setActiveChatId(undefined);
    localStorage.setItem("activeRepositoryId", id);

    // Load chat history for this repository
    fetchChatHistory(id);

    navigate(`/repo/${id}`);
  };

  const handleSelectChat = (id: string) => {
    const chat = chatHistory.find(c => c.id === id);
    if (chat) {
      setActiveChatId(id);
      setActiveRepositoryId(chat.repositoryId);
      navigate(`/repo/${chat.repositoryId}?chatId=${id}`);
    }
  };

  const handleRepositoryLoad = (repositoryId: string) => {
    if (activeRepositoryId !== repositoryId) {
      setActiveRepositoryId(repositoryId);
      localStorage.setItem("activeRepositoryId", repositoryId);
      fetchChatHistory(repositoryId);
    }
  };

  const handleNewChat = async (repositoryId: string, _question: string, chatId: string) => {
    setActiveRepositoryId(repositoryId);
    localStorage.setItem("activeRepositoryId", repositoryId);
    await fetchChatHistory(repositoryId);
    setActiveChatId(chatId);
    // Don't change chatResetKey here - only on deletion
  };

  const handleRepositoryCreated = async (repositoryId: string) => {
    await fetchRepositories();
    setActiveRepositoryId(repositoryId);
    localStorage.setItem("activeRepositoryId", repositoryId);
    navigate(`/repo/${repositoryId}`);
  };

  const handleCreateNew = () => {
    setActiveChatId(undefined);
    setActiveRepositoryId(undefined);
    setChatHistory([]);
    navigate("/new");
  };

  const handleDeleteRepository = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this repository?")) return;

    await api.deleteRepository(id);

    setRepositories(prev => prev.filter(repo => repo.id !== id));
    setChatHistory(prev => prev.filter(chat => chat.repositoryId !== id));
    localStorage.removeItem("activeRepositoryId");
    navigate("/new");
  };

  const handleDeleteChat = async (id: string) => {
    if (!window.confirm("Delete this chat?")) return;

    try {
      try {
        await api.deleteChat(id);
      } catch (apiErr) {
        // Backend delete failed (endpoint may not exist yet)
      }

      const updated = chatHistory.filter(chat => chat.id !== id);
      setChatHistory(updated);
      localStorage.setItem("chatHistory", JSON.stringify(updated));

      setActiveChatId(undefined);
      setChatResetKey(prev => prev + 1);
      navigate(`/repo/${activeRepositoryId}`, { replace: true });
    } catch (err) {
      alert("Failed to delete chat. Please try again.");
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/new" replace />} />
      <Route
        path="/new"
        element={
          <AppLayout sidebar={
            <Sidebar
              key={`sidebar-new-${repositories.length}`}
              repositories={repositories}
              chatHistory={[]}
              activeRepositoryId={activeRepositoryId}
              activeChatId={activeChatId}
              onSelectRepository={handleSelectRepository}
              onSelectChat={handleSelectChat}
              onCreateNew={handleCreateNew}
              onDeleteRepository={handleDeleteRepository}
              onDeleteChat={handleDeleteChat}
              onNewChat={undefined}
            />
          }>
            <NewRepository onRepositoryCreated={handleRepositoryCreated} />
          </AppLayout>
        }
      />
      <Route
        path="/repo/:repositoryId"
        element={
          <AppLayout sidebar={
            <Sidebar
              key={`sidebar-repo-${activeRepositoryId}-${chatHistory.length}`}
              repositories={repositories}
              chatHistory={activeRepositoryId ? chatHistory.filter(c => c.repositoryId === activeRepositoryId) : []}
              activeRepositoryId={activeRepositoryId}
              activeChatId={activeChatId}
              onSelectRepository={handleSelectRepository}
              onSelectChat={handleSelectChat}
              onCreateNew={handleCreateNew}
              onDeleteRepository={handleDeleteRepository}
              onDeleteChat={handleDeleteChat}
              onNewChat={activeRepositoryId ? () => window.location.href = `/repo/${activeRepositoryId}` : undefined}
            />
          }>
            <RepositoryChat
              key={`chat-${activeRepositoryId}-${chatResetKey}`}
              onNewChat={handleNewChat}
              onRepositoryLoad={handleRepositoryLoad}
            />
          </AppLayout>
        }
      />
      <Route
        path="/health"
        element={
          <AppLayout sidebar={
            <Sidebar
              key={`sidebar-health-${repositories.length}`}
              repositories={repositories}
              chatHistory={activeRepositoryId ? chatHistory.filter(c => c.repositoryId === activeRepositoryId) : []}
              activeRepositoryId={activeRepositoryId}
              activeChatId={activeChatId}
              onSelectRepository={handleSelectRepository}
              onSelectChat={handleSelectChat}
              onCreateNew={handleCreateNew}
              onDeleteRepository={handleDeleteRepository}
              onDeleteChat={handleDeleteChat}
              onNewChat={activeRepositoryId ? () => window.location.href = `/repo/${activeRepositoryId}` : undefined}
            />
          }>
            <Status />
          </AppLayout>
        }
      />
    </Routes>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

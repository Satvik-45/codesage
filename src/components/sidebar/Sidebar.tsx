import { RepositoryItem } from "./RepositoryItem";
import { ChatHistoryItem } from "./ChatHistoryItem";

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

interface SidebarProps {
    repositories: Repository[];
    chatHistory?: ChatHistory[];
    activeRepositoryId?: string;
    activeChatId?: string;
    onSelectRepository: (id: string) => void;
    onSelectChat?: (id: string) => void;
    onCreateNew: () => void;
    onDeleteRepository: (id: string) => void;
    onDeleteChat: (id: string) => void;
    onNewChat?: () => void;
    onClose?: () => void;
}

export function Sidebar({
    repositories,
    chatHistory = [],
    activeRepositoryId,
    activeChatId,
    onSelectRepository,
    onSelectChat,
    onCreateNew,
    onDeleteRepository,
    onDeleteChat,
    onNewChat,
    onClose,
}: SidebarProps) {
    return (
        <aside className="w-64 h-screen border-r border-zinc-800 bg-zinc-900 flex flex-col shadow-xl lg:shadow-none">
            <div className="p-4 space-y-4 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">CodeSage</h1>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="lg:hidden p-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
                            aria-label="Close sidebar"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                <button
                    onClick={onCreateNew}
                    className="w-full px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-sm font-medium transition-colors"
                >
                    + New Repository
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-1 px-2">
                <div className="mb-4">
                    <div className="px-3 py-2 text-xs text-zinc-500 uppercase tracking-wider font-medium">Repositories</div>
                    <div className="space-y-1">
                        {repositories.map((repo) => (
                            <RepositoryItem
                                key={repo.id}
                                id={repo.id}
                                name={repo.name}
                                isActive={repo.id === activeRepositoryId}
                                onClick={() => onSelectRepository(repo.id)}
                                onDeleteRepository={onDeleteRepository}
                            />
                        ))}
                    </div>
                </div>

                {chatHistory.length > 0 && (
                    <div>
                        <div className="px-3 py-2 text-xs text-zinc-500 uppercase tracking-wider font-medium">
                            <span>Chat History</span>
                        </div>
                        {onNewChat && (
                            <div className="px-3 pb-2">
                                <button
                                    onClick={onNewChat}
                                    className="w-full px-3 py-2 mb-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-sm font-medium transition-colors"
                                >
                                    + New Chat
                                </button>
                            </div>
                        )}
                        <div className="space-y-1">
                            {chatHistory.map((chat) => (
                                <ChatHistoryItem
                                    key={chat.id}
                                    id={chat.id}
                                    question={chat.question}
                                    isActive={chat.id === activeChatId}
                                    onClick={() => onSelectChat?.(chat.id)}
                                    onDeleteChat={onDeleteChat}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t border-zinc-800 p-4">
                <a
                    href="/health"
                    className="block text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
                >
                    Health Status
                </a>
            </div>
        </aside>
    );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChatContainer } from "../components/chat/ChatContainer";
import { api } from "../services/api";

interface Message {
    role: "user" | "assistant";
    content: string;
    references?: Reference[];
}

interface Reference {
    file: string;
    line?: number;
    snippet?: string;
}

export function RepositoryChat({ onNewChat, onRepositoryLoad }: {
    onNewChat?: (repoId: string, question: string, chatId: string) => void;
    onRepositoryLoad?: (repoId: string) => void;
}) {
    const { repositoryId } = useParams<{ repositoryId: string }>();
    const searchParams = new URLSearchParams(window.location.search);
    const chatId = searchParams.get('chatId');



    const [messages, setMessages] = useState<Message[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentChatId, setCurrentChatId] = useState<string | null>(chatId);




    useEffect(() => {
        if (repositoryId) {
            onRepositoryLoad?.(repositoryId);

            if (chatId) {
                loadChatHistory();
            } else {
                setMessages([]);
                setCurrentChatId(null);
                setLoading(false);
            }
        }
    }, [repositoryId, chatId]);

    const loadChatHistory = async () => {
        try {
            setLoading(true);
            const history: any = await api.getHistory(repositoryId!);

            if (Array.isArray(history)) {
                // Find the specific chat by chatId
                const chatData = history.find((item: any) => item.id === chatId);

                if (chatData) {
                    // Map backend reference format to frontend format
                    const mappedReferences = (chatData.references || []).map((ref: any) => ({
                        file: ref.filePath || ref.file,
                        line: ref.startLine || ref.line,
                        snippet: ref.content || ref.snippet,
                    }));

                    const formatted: Message[] = [
                        { role: "user", content: chatData.question },
                        {
                            role: "assistant",
                            content: chatData.answer,
                            references: mappedReferences,
                        },
                    ];
                    setMessages(formatted);
                }
            }
        } catch (err) {

        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (content: string) => {
        const userMessage: Message = { role: "user", content };
        setMessages((prev) => [...prev, userMessage]);
        setIsThinking(true);

        try {
            const response: any = await api.askQuestion(repositoryId!, content);
            console.log("Backend response:", response);

            // Map backend reference format to frontend format
            const mappedReferences = (response.references || []).map((ref: any) => ({
                file: ref.filePath || ref.file,
                line: ref.startLine || ref.line,
                snippet: ref.content || ref.snippet,
            }));

            const assistantMessage: Message = {
                role: "assistant",
                content: response.answer || response.response || response.content,
                references: mappedReferences,
            };

            setMessages((prev) => [...prev, assistantMessage]);

            // Backend doesn't return id, so call callback for every new chat
            if (!currentChatId && onNewChat) {
                const tempChatId = `chat-${Date.now()}`;
                setCurrentChatId(tempChatId);
                onNewChat(repositoryId!, content, tempChatId);
            }
        } catch (err) {

            const errorMessage: Message = {
                role: "assistant",
                content: "Sorry, I encountered an error processing your question.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsThinking(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <div className="text-zinc-400">Loading...</div>
            </div>
        );
    }

    return <ChatContainer messages={messages} isThinking={isThinking} onSendMessage={handleSendMessage} />;
}

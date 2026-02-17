import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ThinkingIndicator } from "./ThinkingIndicator";

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

interface ChatContainerProps {
    messages: Message[];
    isThinking?: boolean;
    onSendMessage: (message: string) => void;
}

export function ChatContainer({ messages, isThinking, onSendMessage }: ChatContainerProps) {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isThinking]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input.trim());
            setInput("");
        }
    };

    const hasMessages = messages.length > 0 || isThinking;

    if (!hasMessages) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-2xl px-4 lg:px-8">
                    <div className="text-center space-y-6 mb-6">
                        <h1 className="text-4xl font-semibold tracking-tight">
                            What can I help with?
                        </h1>
                        <p className="text-zinc-400 text-base">
                            Ask anything about this repository
                        </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-3 shadow-xl focus-within:ring-1 focus-within:ring-green-500 transition-all">
                            <div className="flex items-end gap-2">
                                <div className="flex-1 flex items-end">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Message CodeSage..."
                                        className="w-full bg-transparent text-base text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-600 hover:scrollbar-thumb-zinc-500 py-2"
                                        rows={1}
                                        style={{
                                            scrollbarWidth: 'thin',
                                            scrollbarColor: '#52525b transparent',
                                            minHeight: '24px',
                                            maxHeight: '192px'
                                        }}
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = '24px';
                                            target.style.height = Math.min(target.scrollHeight, 192) + 'px';
                                        }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="p-2 bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-xl transition-all shrink-0 mb-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto w-full px-4 lg:px-8 py-6 pb-20">
                    {messages.map((msg, idx) => (
                        <ChatMessage key={idx} message={msg} />
                    ))}
                    {isThinking && (
                        <div className="flex justify-center mb-12">
                            <div className="max-w-[80%] bg-zinc-800 text-zinc-100 rounded-2xl px-5 py-4 shadow-sm">
                                <ThinkingIndicator />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="fixed bottom-6 left-0 right-0 lg:left-64 z-30 flex justify-center px-4 lg:px-0">
                <div className="w-full max-w-5xl lg:px-8">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-zinc-800 border border-zinc-600 rounded-xl px-4 lg:px-6 py-3 shadow-2xl focus-within:ring-1 focus-within:ring-green-500 transition-all">
                            <div className="flex items-end gap-2">
                                <div className="flex-1 flex items-end">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Message CodeSage..."
                                        className="w-full bg-transparent outline-none text-zinc-100 text-base resize-none overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-600 hover:scrollbar-thumb-zinc-500 py-2"
                                        rows={1}
                                        style={{
                                            scrollbarWidth: 'thin',
                                            scrollbarColor: '#52525b transparent',
                                            minHeight: '24px',
                                            maxHeight: '192px'
                                        }}
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = '24px';
                                            target.style.height = Math.min(target.scrollHeight, 192) + 'px';
                                        }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="p-2 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white transition-all shrink-0 mb-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-black text-center text-xs text-zinc-400 py-2 z-20">
                CodeSage can make mistakes. Check important info.
            </div>
        </div>
    );
}

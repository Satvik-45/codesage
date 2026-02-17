import { useState, useEffect, useRef } from "react";

interface ChatHistoryItemProps {
    id: string;
    question: string;
    isActive: boolean;
    onClick: () => void;
    onDeleteChat: (id: string) => void;
}

export function ChatHistoryItem({ id, question, isActive, onClick, onDeleteChat }: ChatHistoryItemProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <div className="relative" ref={menuRef}>
            <div className="flex items-center group">
                <button
                    onClick={onClick}
                    className={`flex-1 text-left px-3 py-2 text-sm transition-colors truncate rounded-lg ${isActive
                        ? "bg-zinc-800 text-zinc-100"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                        }`}
                >
                    {question}
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(!menuOpen);
                    }}
                    className="text-zinc-600 hover:text-zinc-300 px-2 transition-colors"
                >
                    ⋯
                </button>
            </div>
            {menuOpen && (
                <div className="absolute right-4 mt-1 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl w-44 z-50">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(false);
                            if (onDeleteChat) {
                                onDeleteChat(id);
                            }
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        Delete Chat
                    </button>
                </div>
            )}
        </div>
    );
}

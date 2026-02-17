import { useState } from "react";

interface Reference {
  file: string;
  line?: number;
  snippet?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  references?: Reference[];
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [expandedRefs, setExpandedRefs] = useState<Set<number>>(new Set());

  const toggleReference = (idx: number) => {
    setExpandedRefs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

  return (
    <div className={`flex ${isUser ? "justify-end mb-2" : "justify-center mb-8"}`}>
      <div className={`max-w-[80%] rounded-2xl px-2 py-2 shadow-sm ${isUser
        ? "bg-green-600 text-white"
        : "bg-zinc-800 text-zinc-100"
        }`}>
        <div className="text-base leading-7 whitespace-pre-wrap">
          {message.content}
        </div>

        {message.references && message.references.length > 0 && (
          <div className="mt-4">
            <div className="mt-4 space-y-2">
              {message.references.map((ref, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg overflow-hidden border ${isUser
                    ? "border-green-500/30"
                    : "border-zinc-700/50"
                    }`}
                >
                  <button
                    onClick={() => toggleReference(idx)}
                    className={`w-full flex items-center justify-between gap-2 p-3 text-sm transition-colors ${isUser
                      ? "bg-green-700/50 hover:bg-green-700/70 text-green-50"
                      : "bg-zinc-900/50 hover:bg-zinc-900/80 text-zinc-300"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-medium">{ref.file}</span>
                      {ref.line && (
                        <span className={isUser ? "text-green-200" : "text-zinc-500"}>
                          Line {ref.line}
                        </span>
                      )}
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${expandedRefs.has(idx) ? "rotate-180" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedRefs.has(idx) && ref.snippet && (
                    <pre className={`p-3 text-xs overflow-x-auto ${isUser
                      ? "bg-green-800/30 text-green-50"
                      : "bg-zinc-950/50 text-zinc-300"
                      }`}>
                      <code>{ref.snippet}</code>
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

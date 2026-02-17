import { useState } from "react";
import { api } from "../services/api";

interface NewRepositoryProps {
    onRepositoryCreated?: (repositoryId: string) => void;
}

export function NewRepository({ onRepositoryCreated }: NewRepositoryProps) {
    const [githubUrl, setGithubUrl] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setGithubUrl("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let result;
            if (file) {
                result = await api.uploadZip(file);
            } else if (githubUrl) {
                result = await api.connectGithub(githubUrl);
            } else {
                setError("Please provide a GitHub URL or upload a ZIP file");
                setLoading(false);
                return;
            }

            if (result.repositoryId && onRepositoryCreated) {
                onRepositoryCreated(result.repositoryId);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload repository");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-2xl px-6">
                <h1 className="text-4xl font-semibold text-center mb-6">
                    Analyze Your Codebase
                </h1>
                <p className="text-zinc-400 text-center mb-6">
                    Upload a repository to begin asking questions.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-3 shadow-xl focus-within:ring-1 focus-within:ring-green-500">
                        <div className="flex items-end gap-2">
                            <label className="cursor-pointer p-2 hover:bg-zinc-700 rounded-lg transition-colors shrink-0 mb-2">
                                <input
                                    type="file"
                                    accept=".zip"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    disabled={loading || !!githubUrl}
                                />
                                <svg className="w-6 h-6 text-zinc-400 hover:text-zinc-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </label>

                            <div className="flex-1 flex items-end">
                                <textarea
                                    value={githubUrl}
                                    onChange={(e) => {
                                        setGithubUrl(e.target.value);
                                        setFile(null);
                                    }}
                                    placeholder="Paste GitHub repo URL or upload ZIP to begin"
                                    className="w-full bg-transparent text-base text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-600 hover:scrollbar-thumb-zinc-500 py-2"
                                    disabled={loading || !!file}
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
                                disabled={loading || (!githubUrl && !file)}
                                className="p-2 bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-xl transition-all shrink-0 mb-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            </button>
                        </div>

                        {file && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-zinc-400 bg-zinc-900 rounded-lg p-3">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="flex-1 truncate">{file.name}</span>
                                <button
                                    type="button"
                                    onClick={() => setFile(null)}
                                    className="text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 text-sm text-red-400 bg-red-950/30 rounded-lg p-3">
                                {error}
                            </div>
                        )}
                    </div>

                    {loading && (
                        <div className="text-center mt-6 text-zinc-400 text-sm">
                            Processing...
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

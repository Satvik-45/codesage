const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
async function request<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }
    return data;
}
export const api = {
    uploadZip: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${API_BASE_URL}/repo/upload`, {
            method: "POST",
            body: formData,
        });
        return response.json();
    },
    connectGithub: (githubUrl: string) =>
        request("/repo/github", {
            method: "POST",
            body: JSON.stringify({ githubUrl }),
        }),
    getRepositories: () => request("/repo/list"),
    askQuestion: (repositoryId: string, question: string) =>
        request("/qa/ask", {
            method: "POST",
            body: JSON.stringify({ repositoryId, question }),
        }),
    getHistory: (repositoryId: string) =>
        request(`/qa/history/${repositoryId}`),
    getHealth: () => request("/health"),
    deleteRepository: (repositoryId: string) =>
        request(`/repo/${repositoryId}`, {
            method: "DELETE",
        }),
    clearRepositoryHistory: (repositoryId: string) =>
        request(`/qa/history/${repositoryId}`, {
            method: "DELETE",
        }),
    deleteChat: (chatId: string) =>
        request(`/qa/${chatId}`, {
            method: "DELETE",
        }),
};

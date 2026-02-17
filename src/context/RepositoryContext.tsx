import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
interface RepositoryContextType {
    repositoryId: string | null;
    setRepositoryId: (id: string | null) => void;
}
const RepositoryContext = createContext<RepositoryContextType | undefined>(
    undefined
);
export function RepositoryProvider({ children }: { children: ReactNode }) {
    const [repositoryId, setRepositoryIdState] = useState<string | null>(null);
    useEffect(() => {
        const saved = localStorage.getItem("repositoryId");
        if (saved) {
            setRepositoryIdState(saved);
        }
    }, []);
    const setRepositoryId = (id: string | null) => {
        if (id) {
            localStorage.setItem("repositoryId", id);
        } else {
            localStorage.removeItem("repositoryId");
        }
        setRepositoryIdState(id);
    };
    return (
        <RepositoryContext.Provider value={{ repositoryId, setRepositoryId }}>
            {children}
        </RepositoryContext.Provider>
    );
}
export function useRepository() {
    const context = useContext(RepositoryContext);
    if (!context) {
        throw new Error("useRepository must be used inside RepositoryProvider");
    }
    return context;
}

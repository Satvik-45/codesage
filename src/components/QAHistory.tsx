import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useRepository } from "../context/RepositoryContext";
export default function QAHistory() {
    const { repositoryId } = useRepository();
    const [history, setHistory] = useState<any[]>([]);
    useEffect(() => {
        if (!repositoryId) return;
        api.getHistory(repositoryId).then((res: any) => {
            if (res.success) {
                setHistory(res.data);
            }
        });
    }, [repositoryId]);
    if (!repositoryId) return null;
    return (
        <div style={{ marginTop: "40px" }}>
            <h3>Recent Questions</h3>
            {history.length === 0 && <p>No questions yet.</p>}
            {history.map((item) => (
                <div
                    key={item.id}
                    style={{
                        marginBottom: "20px",
                        padding: "10px",
                        border: "1px solid #ddd",
                    }}
                >
                    <p><strong>Question:</strong> {item.question}</p>
                    <p><strong>Answer:</strong> {item.answer}</p>
                </div>
            ))}
        </div>
    );
}

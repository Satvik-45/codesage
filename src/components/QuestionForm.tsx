import { useState } from "react";
import { api } from "../services/api";
import { useRepository } from "../context/RepositoryContext";

export default function QuestionForm({ onAnswer }: any) {
    const { repositoryId } = useRepository();
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!repositoryId || !question.trim()) return;

        setLoading(true);
        try {
            const response = await api.askQuestion(repositoryId, question) as any;
            if (response.success) {
                onAnswer(response.data);
                setQuestion("");
            }
        } catch (error) {
            alert("Failed to get answer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: "20px" }}>
            <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about this codebase..."
                style={{ width: "400px", marginRight: "10px" }}
            />
            <button onClick={handleSubmit}>
                Ask
            </button>

            {loading && <p>Thinking...</p>}
        </div>
    );
}

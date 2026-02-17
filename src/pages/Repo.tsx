import { useState } from "react";
import RepoUploader from "../components/RepoUploader";
import QuestionForm from "../components/QuestionForm";
import AnswerView from "../components/AnswerView";
import QAHistory from "../components/QAHistory";
import { useRepository } from "../context/RepositoryContext";

export default function Repo() {
    const { repositoryId } = useRepository();
    const [answerData, setAnswerData] = useState<any>(null);

    return (
        <div style={{ padding: "20px" }}>
            <h2>CodeSage</h2>

            {!repositoryId && (
                <>
                    <h3>Upload Repository</h3>
                    <RepoUploader />
                </>
            )}

            {repositoryId && (
                <>
                    <p><strong>Repository ID:</strong> {repositoryId}</p>

                    <QuestionForm onAnswer={setAnswerData} />

                    <AnswerView data={answerData} />

                    <QAHistory />
                </>
            )}
        </div>
    );
}

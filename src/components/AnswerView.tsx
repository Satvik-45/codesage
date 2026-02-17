import { useState } from "react";
export default function AnswerView({ data }: any) {
    if (!data) return null;
    return (
        <div style={{ marginTop: "30px" }}>
            <h3>Answer</h3>
            <p>{data.answer}</p>
            <h4>References</h4>
            {data.references?.map((ref: any, index: number) => (
                <ReferenceBlock key={index} refData={ref} />
            ))}
        </div>
    );
}
function ReferenceBlock({ refData }: any) {
    const [expanded, setExpanded] = useState(false);
    const previewLines = refData.content.split("\n").slice(0, 20).join("\n");
    return (
        <div
            style={{
                marginBottom: "15px",
                border: "1px solid #ddd",
                padding: "10px",
            }}
        >
            <strong>{refData.filePath}</strong>
            <p>
                Lines {refData.startLine} - {refData.endLine}
            </p>
            <pre
                style={{
                    background: "#f4f4f4",
                    padding: "10px",
                    overflowX: "auto",
                    maxHeight: expanded ? "none" : "200px",
                }}
            >
                {expanded ? refData.content : previewLines}
            </pre>
            <button onClick={() => setExpanded(!expanded)}>
                {expanded ? "Show Less" : "Show More"}
            </button>
        </div>
    );
}

import { useState } from "react";
import { api } from "../services/api";
import { useRepository } from "../context/RepositoryContext";
export default function RepoUploader() {
    const [loading, setLoading] = useState(false);
    const { setRepositoryId } = useRepository();
    const handleFileUpload = async (file: File) => {
        setLoading(true);
        try {
            const response = await api.uploadZip(file);
            if (response.success) {
                setRepositoryId(response.repositoryId);
            }
        } catch (error) {
            alert("Upload failed");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <input
                type="file"
                accept=".zip"
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0]);
                    }
                }}
            />
            {loading && <p>Uploading...</p>}
        </div>
    );
}

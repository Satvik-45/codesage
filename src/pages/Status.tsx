import { useEffect, useState } from "react";
import { api } from "../services/api";

interface HealthStatus {
    backend?: string;
    database?: string;
}

export function Status() {
    const [status, setStatus] = useState<HealthStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getHealth()
            .then((res) => {
                setStatus(res as HealthStatus);
                setLoading(false);
            })
            .catch(() => {
                setStatus(null);
                setLoading(false);
            });
    }, []);

    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md px-6">
                <div className="bg-zinc-800/50 rounded-xl border border-zinc-700 p-8">
                    <h1 className="text-2xl font-semibold mb-6">System Status</h1>

                    {loading ? (
                        <p className="text-zinc-400">Checking status...</p>
                    ) : (
                        <div className="space-y-4">

                            {/* Backend Status */}
                            <div className="flex items-center justify-between py-2">
                                <span className="text-zinc-400">Backend:</span>
                                <span
                                    className={
                                        status?.backend === "ok"
                                            ? "text-green-500 font-medium"
                                            : "text-red-500 font-medium"
                                    }
                                >
                                    {status?.backend === "ok" ? "✓ OK" : "✗ Unavailable"}
                                </span>
                            </div>

                            {/* Database Status */}
                            <div className="flex items-center justify-between py-2">
                                <span className="text-zinc-400">Database:</span>
                                <span
                                    className={
                                        status?.database === "ok"
                                            ? "text-green-500 font-medium"
                                            : "text-red-500 font-medium"
                                    }
                                >
                                    {status?.database === "ok" ? "✓ OK" : "✗ Unavailable"}
                                </span>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

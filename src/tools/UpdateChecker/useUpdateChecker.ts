import { useState, useEffect } from "react";
import { checkForUpdate, installUpdate, type UpdateInfo, type UpdateStatus } from "./logic";

export function useUpdateChecker() {
    const [status, setStatus] = useState<UpdateStatus>("idle");
    const [info, setInfo] = useState<UpdateInfo | null>(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setStatus("checking");
            try {
                const result = await checkForUpdate();
                if (cancelled) return;
                if (result) {
                    setInfo(result);
                    setStatus("available");
                } else {
                    setStatus("idle");
                }
            } catch (err) {
                if (cancelled) return;
                console.error("Update check failed:", err);
                setStatus("idle");
            }
        }

        run();
        return () => { cancelled = true; };
    }, []);

    async function handleInstall() {
        setStatus("downloading");
        setError("");
        try {
            await installUpdate((percent) => {
                setProgress(percent);
                if (percent >= 100) setStatus("installing");
            });
        } catch (err) {
            console.error("Update install failed:", err);
            setError(String(err));
            setStatus("error");
        }
    }

    return { status, info, progress, error, handleInstall };
}

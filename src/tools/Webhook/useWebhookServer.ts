import { useState } from "react";
import { type AuthMethod, startServer, stopServer } from "./logic";

export function useWebhookServer() {
    const [port, setPort] = useState(3000);
    const [authMethod, setAuthMethod] = useState<AuthMethod>("none");
    const [authValue, setAuthValue] = useState("");
    const [serverRunning, setServerRunning] = useState(false);
    const [serverUrl, setServerUrl] = useState("");
    const [serverLoading, setServerLoading] = useState(false);

    async function handleToggleServer() {
        setServerLoading(true);
        try {
            if (serverRunning) {
                await stopServer();
                setServerRunning(false);
                setServerUrl("");
            } else {
                const url = await startServer(
                    port,
                    authMethod === "none" ? "" : authMethod,
                    authValue
                );
                setServerRunning(true);
                setServerUrl(url);
            }
        } catch (error) {
            console.error("Erro no servidor:", error);
        } finally {
            setServerLoading(false);
        }
    }

    return {
        port, setPort,
        authMethod, setAuthMethod,
        authValue, setAuthValue,
        serverRunning, serverUrl, serverLoading,
        handleToggleServer,
    };
}

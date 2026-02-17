import { useState, useEffect } from "react";
import { checkForUpdate, installUpdate, type UpdateInfo, type UpdateStatus } from "./logic";
import "./UpdateChecker.css";

export default function UpdateChecker() {
  const [status, setStatus] = useState<UpdateStatus>("idle");
  const [info, setInfo] = useState<UpdateInfo | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [dismissed, setDismissed] = useState(false);

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

  if (status === "idle" || status === "checking" || dismissed) {
    return null;
  }

  return (
    <div className="update-overlay">
      <div className="update-dialog">
        <div className="update-dialog-header">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <h2>Nova atualização disponível</h2>
        </div>

        {info && (
          <>
            <span className="update-version">v{info.version}</span>
            {info.body && <p className="update-body">{info.body}</p>}
          </>
        )}

        {(status === "downloading" || status === "installing") && (
          <>
            <div className="update-progress-bar">
              <div
                className="update-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="update-progress-text">
              {status === "installing"
                ? "Instalando..."
                : `Baixando... ${Math.round(progress)}%`}
            </p>
          </>
        )}

        {status === "error" && (
          <p className="update-error">{error}</p>
        )}

        <div className="update-actions">
          {(status === "available" || status === "error") && (
            <button
              className="update-btn update-btn-secondary"
              onClick={() => setDismissed(true)}
            >
              Depois
            </button>
          )}
          {(status === "available" || status === "error") && (
            <button
              className="update-btn update-btn-primary"
              onClick={handleInstall}
            >
              {status === "error" ? "Tentar novamente" : "Atualizar agora"}
            </button>
          )}
          {(status === "downloading" || status === "installing") && (
            <p className="update-status-text">Não feche o aplicativo</p>
          )}
        </div>
      </div>
    </div>
  );
}

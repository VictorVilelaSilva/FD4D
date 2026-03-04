import { useState } from "react";
import { useUpdateChecker } from "./useUpdateChecker";
import { Download } from "lucide-react";
import "./UpdateChecker.css";

export default function UpdateChecker() {
  const { status, info, progress, error, handleInstall } = useUpdateChecker();
  const [dismissed, setDismissed] = useState(false);

  if (status === "idle" || status === "checking" || dismissed) {
    return null;
  }

  return (
    <div className="update-overlay">
      <div className="update-dialog">
        <div className="update-dialog-header">
          <Download size={22} />
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

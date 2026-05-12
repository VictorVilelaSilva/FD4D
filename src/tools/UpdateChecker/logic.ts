import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export interface UpdateInfo {
  version: string;
  body: string;
}

export type UpdateStatus =
  | "idle"
  | "checking"
  | "available"
  | "downloading"
  | "installing"
  | "error";

export async function checkForUpdate(): Promise<UpdateInfo | null> {
  const update = await check();
  if (!update) return null;
  return {
    version: update.version,
    body: update.body ?? "",
  };
}

export async function installUpdate(
  onProgress?: (percent: number) => void
): Promise<void> {
  const update = await check();
  if (!update) throw new Error("Nenhuma atualização disponível");

  let downloaded = 0;
  let total = 0;

  await update.downloadAndInstall((event) => {
    if (event.event === "Started" && event.data.contentLength) {
      total = event.data.contentLength;
    } else if (event.event === "Progress") {
      downloaded += event.data.chunkLength;
      if (total > 0 && onProgress) {
        onProgress(Math.min((downloaded / total) * 100, 100));
      }
    } else if (event.event === "Finished") {
      onProgress?.(100);
    }
  });

  await relaunch();
}

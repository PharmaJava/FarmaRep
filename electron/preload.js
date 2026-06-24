// Preload script — exposes Electron APIs to the renderer in a controlled way.
// Keep this minimal: the app uses only localStorage, no Node.js APIs are needed.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApp', {
  version: process.versions.electron,
  platform: process.platform,
  // Copia una imagen (data URL PNG) al portapapeles del sistema vía el proceso principal.
  copyImage: (dataURL) => ipcRenderer.invoke('copy-image', dataURL),
});

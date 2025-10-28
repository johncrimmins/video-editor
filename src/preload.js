const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File dialog operations
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  
  // File operations
  getFileInfo: (filePath) => ipcRenderer.invoke('get-file-info', filePath),
  validateFilePath: (filePath) => ipcRenderer.invoke('validate-file-path', filePath),
  
  // Utility methods
  platform: process.platform,
  versions: process.versions
});

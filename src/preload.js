const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File dialog operations
  showOpenDialog: (options) => {
    return ipcRenderer.invoke('show-open-dialog', options);
  },
  
  // File operations
  getFileInfo: (filePath) => {
    return ipcRenderer.invoke('get-file-info', filePath);
  },
  validateFilePath: (filePath) => {
    return ipcRenderer.invoke('validate-file-path', filePath);
  },
  
  // Video operations
  trimVideo: (params) => {
    return ipcRenderer.invoke('trim-video', params);
  },
  
  // Utility methods
  platform: process.platform,
  versions: process.versions
});

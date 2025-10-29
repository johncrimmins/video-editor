const { contextBridge, ipcRenderer } = require('electron');

console.log('🔗 preload.js: Preload script loading...');
console.log('🔗 preload.js: contextBridge available:', !!contextBridge);
console.log('🔗 preload.js: ipcRenderer available:', !!ipcRenderer);

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
console.log('🔗 preload.js: Exposing electronAPI to renderer...');
contextBridge.exposeInMainWorld('electronAPI', {
  // File dialog operations
  showOpenDialog: (options) => {
    console.log('🔗 preload.js: showOpenDialog called with options:', options);
    return ipcRenderer.invoke('show-open-dialog', options);
  },
  
  // File operations
  getFileInfo: (filePath) => {
    console.log('🔗 preload.js: getFileInfo called with filePath:', filePath);
    return ipcRenderer.invoke('get-file-info', filePath);
  },
  validateFilePath: (filePath) => {
    console.log('🔗 preload.js: validateFilePath called with filePath:', filePath);
    return ipcRenderer.invoke('validate-file-path', filePath);
  },
  
  // Video operations
  trimVideo: (params) => {
    console.log('🔗 preload.js: trimVideo called with params:', params);
    return ipcRenderer.invoke('trim-video', params);
  },
  
  // Utility methods
  platform: process.platform,
  versions: process.versions
});

console.log('🔗 preload.js: electronAPI exposed to window.electronAPI');
console.log('🔗 preload.js: Preload script setup complete');

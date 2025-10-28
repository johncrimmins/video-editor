import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import started from 'electron-squirrel-startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers for file operations
const setupIpcHandlers = () => {
  // Handle file dialog
  ipcMain.handle('show-open-dialog', async (event, options) => {
    try {
      console.log('Opening file dialog with options:', options);
      const result = await dialog.showOpenDialog(options);
      console.log('File dialog result:', result);
      return result;
    } catch (error) {
      console.error('File dialog error:', error);
      throw error;
    }
  });

  // Handle get file info
  ipcMain.handle('get-file-info', async (event, filePath) => {
    try {
      console.log('Getting file info for:', filePath);
      
      if (!filePath || typeof filePath !== 'string') {
        throw new Error('Invalid file path');
      }

      const stats = fs.statSync(filePath);
      const ext = path.extname(filePath).toLowerCase();
      
      const fileInfo = {
        name: path.basename(filePath),
        path: filePath,
        size: stats.size,
        extension: ext,
        type: getMimeType(ext),
        modified: stats.mtime,
        created: stats.birthtime
      };
      
      console.log('File info:', fileInfo);
      return fileInfo;
    } catch (error) {
      console.error('Get file info error:', error);
      throw error;
    }
  });

  // Handle validate file path
  ipcMain.handle('validate-file-path', async (event, filePath) => {
    try {
      console.log('Validating file path:', filePath);
      
      if (!filePath || typeof filePath !== 'string') {
        return { exists: false, accessible: false };
      }

      const exists = fs.existsSync(filePath);
      let accessible = false;
      
      if (exists) {
        try {
          fs.accessSync(filePath, fs.constants.R_OK);
          accessible = true;
        } catch (accessError) {
          console.log('File exists but not accessible:', accessError.message);
        }
      }
      
      return { exists, accessible };
    } catch (error) {
      console.error('Validate file path error:', error);
      return { exists: false, accessible: false };
    }
  });
};

// Helper function to get MIME type from extension
const getMimeType = (extension) => {
  const mimeTypes = {
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime'
  };
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
};


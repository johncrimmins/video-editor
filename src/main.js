import { app, BrowserWindow, ipcMain, dialog, protocol } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import started from 'electron-squirrel-startup';
import ffprobe from 'ffprobe-static';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  console.log('🖥️ main.js: Creating browser window...');
  
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  console.log('🖥️ main.js: Browser window created');

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    console.log('🖥️ main.js: Loading from Vite dev server:', MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    console.log('🖥️ main.js: Loading from file system:', path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  console.log('🖥️ main.js: Opening DevTools...');
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  
  console.log('🖥️ main.js: Window setup complete');
};

// Register custom protocol for serving local video files
const setupCustomProtocol = () => {
  console.log('🖥️ main.js: Setting up custom protocol...');
  
  // Register custom protocol for serving local files
  protocol.registerFileProtocol('app', (request, callback) => {
    console.log('🖥️ main.js: Custom protocol request:', request.url);
    
    try {
      // Parse the URL properly to get the file path
      const url = new URL(request.url);
      const filePath = decodeURIComponent(url.pathname);
      console.log('🖥️ main.js: Parsed file path:', filePath);
      
      // Check if file exists before serving
      if (fs.existsSync(filePath)) {
        console.log('🖥️ main.js: File exists, serving:', filePath);
        callback({ path: filePath });
      } else {
        console.error('🖥️ main.js: File not found:', filePath);
        callback({ error: -6 }); // ERR_FILE_NOT_FOUND
      }
    } catch (error) {
      console.error('🖥️ main.js: Protocol error:', error);
      callback({ error: -6 }); // ERR_FILE_NOT_FOUND
    }
  });
  
  console.log('🖥️ main.js: Custom protocol registered successfully');
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  console.log('🖥️ main.js: Electron app ready, setting up...');
  setupCustomProtocol();
  console.log('🖥️ main.js: Custom protocol setup complete');
  setupIpcHandlers();
  console.log('🖥️ main.js: IPC handlers setup complete');
  createWindow();
  console.log('🖥️ main.js: Window creation initiated');

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
  console.log('🖥️ main.js: Setting up IPC handlers...');
  
  // Handle file dialog
  ipcMain.handle('show-open-dialog', async (event, options) => {
    console.log('🖥️ main.js: show-open-dialog IPC called with options:', options);
    try {
      console.log('🖥️ main.js: Opening file dialog with options:', options);
      const result = await dialog.showOpenDialog(options);
      console.log('🖥️ main.js: File dialog result:', result);
      return result;
    } catch (error) {
      console.error('🖥️ main.js: File dialog error:', error);
      throw error;
    }
  });

  // Handle get file info
  ipcMain.handle('get-file-info', async (event, filePath) => {
    console.log('🖥️ main.js: get-file-info IPC called with filePath:', filePath);
    try {
      console.log('🖥️ main.js: Getting file info for:', filePath);
      
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
      
      // Extract video duration if it's a video file
      if (ext === '.mp4' || ext === '.mov') {
        console.log('🖥️ main.js: Video file detected, extracting duration...');
        const duration = await getVideoDuration(filePath);
        fileInfo.duration = duration;
        console.log('🖥️ main.js: Added duration to file info:', duration);
      }
      
      console.log('🖥️ main.js: File info:', fileInfo);
      return fileInfo;
    } catch (error) {
      console.error('🖥️ main.js: Get file info error:', error);
      throw error;
    }
  });

  // Handle validate file path
  ipcMain.handle('validate-file-path', async (event, filePath) => {
    console.log('🖥️ main.js: validate-file-path IPC called with filePath:', filePath);
    try {
      console.log('🖥️ main.js: Validating file path:', filePath);
      
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
      
      console.log('🖥️ main.js: File path validation result:', { exists, accessible });
      return { exists, accessible };
    } catch (error) {
      console.error('🖥️ main.js: Validate file path error:', error);
      return { exists: false, accessible: false };
    }
  });
  
  console.log('🖥️ main.js: All IPC handlers setup complete');
};

// Helper function to get MIME type from extension
const getMimeType = (extension) => {
  const mimeTypes = {
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime'
  };
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
};

// Extract video duration using ffprobe
const getVideoDuration = async (filePath) => {
  console.log('🖥️ main.js: Getting video duration for:', filePath);
  try {
    const command = `"${ffprobe.path}" -v quiet -show_entries format=duration -of csv="p=0" "${filePath}"`;
    const { stdout } = await execAsync(command);
    const duration = parseFloat(stdout.trim());
    console.log('🖥️ main.js: Video duration:', duration, 'seconds');
    return isNaN(duration) ? 0 : duration;
  } catch (error) {
    console.error('🖥️ main.js: Error getting video duration:', error);
    return 0;
  }
};


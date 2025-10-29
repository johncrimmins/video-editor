import { app, BrowserWindow, ipcMain, dialog, protocol } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import started from 'electron-squirrel-startup';
import ffmpeg from 'ffmpeg-static';
import ffprobe from 'ffprobe-static';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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

  // Load the index.html of the app.
  // Electron Forge Vite plugin handles both dev and production:
  // - Dev: MAIN_WINDOW_VITE_DEV_SERVER_URL is set (e.g., http://localhost:5173)
  // - Production: Renderer is built to .vite/renderer/{MAIN_WINDOW_VITE_NAME}/index.html inside ASAR
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    // Development mode: Load from Vite dev server
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    // Production mode: Load from packaged renderer inside ASAR
    // Structure: .vite/build/main.js (__dirname) -> .vite/renderer/{name}/index.html
    const indexPath = path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`);
    mainWindow.loadFile(indexPath);
  }
};

// Register custom protocol for serving local video files
const setupCustomProtocol = () => {
  // Register custom protocol for serving local files
  protocol.registerFileProtocol('app', (request, callback) => {
    try {
      // Parse the URL properly to get the file path
      const url = new URL(request.url);
      const filePath = decodeURIComponent(url.pathname);
      
      // Check if file exists before serving
      if (fs.existsSync(filePath)) {
        callback({ path: filePath });
      } else {
        callback({ error: -6 }); // ERR_FILE_NOT_FOUND
      }
    } catch (error) {
      callback({ error: -6 }); // ERR_FILE_NOT_FOUND
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  setupCustomProtocol();
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
      const result = await dialog.showOpenDialog(options);
      return result;
    } catch (error) {
      throw error;
    }
  });

  // Handle get file info
  ipcMain.handle('get-file-info', async (event, filePath) => {
    try {
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
        const duration = await getVideoDuration(filePath);
        fileInfo.duration = duration;
      }
      
      return fileInfo;
    } catch (error) {
      throw error;
    }
  });

  // Handle validate file path
  ipcMain.handle('validate-file-path', async (event, filePath) => {
    try {
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
          // File exists but not accessible
        }
      }
      
      return { exists, accessible };
    } catch (error) {
      return { exists: false, accessible: false };
    }
  });

  // Handle trim video
  ipcMain.handle('trim-video', async (event, { inputPath, outputPath, startTime, duration }) => {
    try {
      if (!inputPath || !outputPath || startTime === undefined || duration === undefined) {
        throw new Error('Invalid trim parameters');
      }

      // Check if input file exists
      if (!fs.existsSync(inputPath)) {
        throw new Error('Input file does not exist');
      }

      // Clamp startTime to prevent negative values
      const clampedStartTime = Math.max(0, startTime);

      // Use system FFmpeg with re-encoding for reliable playback
      // Re-encoding is slower but produces playable videos even with non-keyframe cuts
      const systemFfmpeg = '/opt/homebrew/bin/ffmpeg';
      const command = `"${systemFfmpeg}" -ss ${clampedStartTime} -i "${inputPath}" -t ${duration} -c:v libx264 -preset veryfast -crf 23 -c:a aac -b:a 128k "${outputPath}"`;
      
      // Execute FFmpeg command
      await execAsync(command);
      
      // Check if output file was created
      if (!fs.existsSync(outputPath)) {
        throw new Error('Output file was not created');
      }
      
      return { success: true, outputPath };
    } catch (error) {
      throw error;
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

// Extract video duration using system ffprobe
const getVideoDuration = async (filePath) => {
  try {
    // Try system ffprobe first (if installed via Homebrew)
    const systemFfprobe = '/opt/homebrew/bin/ffprobe';
    const command = `"${systemFfprobe}" -v quiet -show_entries format=duration -of csv=p=0 "${filePath}"`;
    
    const { stdout } = await execAsync(command);
    const output = stdout.trim();
    
    if (output && !isNaN(parseFloat(output))) {
      return parseFloat(output);
    }
    
    throw new Error('System ffprobe failed');
  } catch (error) {
    try {
      // Try system ffmpeg (Homebrew)
      const systemFfmpeg = '/opt/homebrew/bin/ffmpeg';
      const command = `"${systemFfmpeg}" -i "${filePath}" 2>&1 | grep Duration`;
      
      const { stdout } = await execAsync(command);
      
      // Parse duration from output like "Duration: 00:00:15.12"
      const durationMatch = stdout.match(/Duration:\s*(\d{2}):(\d{2}):(\d{2})\.(\d{2})/);
      
      if (durationMatch) {
        const hours = parseInt(durationMatch[1], 10);
        const minutes = parseInt(durationMatch[2], 10);
        const seconds = parseInt(durationMatch[3], 10);
        const centiseconds = parseInt(durationMatch[4], 10);
        
        return hours * 3600 + minutes * 60 + seconds + centiseconds / 100;
      }
      
      throw new Error('Could not parse duration from system ffmpeg');
    } catch (ffmpegError) {
      // Last resort: Return a placeholder and let the renderer figure it out
      // The video element in the browser can get duration via loadedmetadata event
      return 0;
    }
  }
};


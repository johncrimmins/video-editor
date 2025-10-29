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

  // Handle trim video
  ipcMain.handle('trim-video', async (event, { inputPath, outputPath, startTime, duration }) => {
    console.log('🖥️ main.js: trim-video IPC called with:', { inputPath, outputPath, startTime, duration });
    try {
      console.log('🖥️ main.js: Trimming video...');
      
      if (!inputPath || !outputPath || startTime === undefined || duration === undefined) {
        throw new Error('Invalid trim parameters');
      }

      // Check if input file exists
      if (!fs.existsSync(inputPath)) {
        throw new Error('Input file does not exist');
      }

      // Clamp startTime to prevent negative values
      const clampedStartTime = Math.max(0, startTime);
      if (clampedStartTime !== startTime) {
        console.log(`🖥️ main.js: Clamped startTime from ${startTime} to ${clampedStartTime}`);
      }

      // Use system FFmpeg with re-encoding for reliable playback
      // Re-encoding is slower but produces playable videos even with non-keyframe cuts
      const systemFfmpeg = '/opt/homebrew/bin/ffmpeg';
      const command = `"${systemFfmpeg}" -ss ${clampedStartTime} -i "${inputPath}" -t ${duration} -c:v libx264 -preset veryfast -crf 23 -c:a aac -b:a 128k "${outputPath}"`;
      console.log('🖥️ main.js: FFmpeg command:', command);
      
      // Execute FFmpeg command
      const { stdout, stderr } = await execAsync(command);
      console.log('🖥️ main.js: FFmpeg stdout:', stdout);
      if (stderr) {
        console.log('🖥️ main.js: FFmpeg stderr:', stderr);
      }
      
      // Check if output file was created
      if (!fs.existsSync(outputPath)) {
        throw new Error('Output file was not created');
      }
      
      console.log('🖥️ main.js: Video trim successful');
      return { success: true, outputPath };
    } catch (error) {
      console.error('🖥️ main.js: Trim video error:', error);
      throw error;
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

// Extract video duration using system ffprobe
const getVideoDuration = async (filePath) => {
  console.log('🖥️ main.js: ===== USING SYSTEM FFPROBE =====');
  console.log('🖥️ main.js: Getting video duration for:', filePath);
  
  try {
    // Try system ffprobe first (if installed via Homebrew)
    const systemFfprobe = '/opt/homebrew/bin/ffprobe';
    const command = `"${systemFfprobe}" -v quiet -show_entries format=duration -of csv=p=0 "${filePath}"`;
    console.log('🖥️ main.js: Trying system ffprobe:', command);
    
    const { stdout, stderr } = await execAsync(command);
    const output = stdout.trim();
    console.log('🖥️ main.js: System ffprobe output:', output);
    
    if (output && !isNaN(parseFloat(output))) {
      const duration = parseFloat(output);
      console.log('🖥️ main.js: Video duration from system ffprobe:', duration, 'seconds');
      return duration;
    }
    
    throw new Error('System ffprobe failed');
  } catch (error) {
    console.log('🖥️ main.js: System ffprobe failed, trying system ffmpeg...');
    
    try {
      // Try system ffmpeg (Homebrew)
      const systemFfmpeg = '/opt/homebrew/bin/ffmpeg';
      const command = `"${systemFfmpeg}" -i "${filePath}" 2>&1 | grep Duration`;
      console.log('🖥️ main.js: Trying system ffmpeg:', command);
      
      const { stdout } = await execAsync(command);
      console.log('🖥️ main.js: System ffmpeg output:', stdout);
      
      // Parse duration from output like "Duration: 00:00:15.12"
      const durationMatch = stdout.match(/Duration:\s*(\d{2}):(\d{2}):(\d{2})\.(\d{2})/);
      
      if (durationMatch) {
        const hours = parseInt(durationMatch[1], 10);
        const minutes = parseInt(durationMatch[2], 10);
        const seconds = parseInt(durationMatch[3], 10);
        const centiseconds = parseInt(durationMatch[4], 10);
        
        const duration = hours * 3600 + minutes * 60 + seconds + centiseconds / 100;
        console.log('🖥️ main.js: Video duration from system ffmpeg:', duration, 'seconds');
        return duration;
      }
      
      throw new Error('Could not parse duration from system ffmpeg');
    } catch (ffmpegError) {
      console.log('🖥️ main.js: System ffmpeg failed, trying HTML5 video element...');
      
      // Last resort: Return a placeholder and let the renderer figure it out
      // The video element in the browser can get duration via loadedmetadata event
      console.error('🖥️ main.js: All duration extraction methods failed');
      console.error('🖥️ main.js: Error:', ffmpegError.message);
      console.log('🖥️ main.js: Returning 0 - duration will need to be extracted in renderer');
      return 0;
    }
  }
};


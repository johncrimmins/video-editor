import { app, BrowserWindow, ipcMain, dialog, protocol, desktopCapturer } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import started from 'electron-squirrel-startup';
import ffmpeg from 'ffmpeg-static';
import ffprobe from 'ffprobe-static';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Track active recording processes
const recordingProcesses = new Map();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
    },
  });

  // Load the index.html of the app.
  // Electron Forge Vite plugin handles both dev and production:
  // - Dev: MAIN_WINDOW_VITE_DEV_SERVER_URL is set (e.g., http://localhost:5173)
  // - Production: Renderer is built to .vite/renderer/{MAIN_WINDOW_VITE_NAME}/index.html inside ASAR
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    // Development mode: Load from Vite dev server
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    
    // Open DevTools automatically in development
    mainWindow.webContents.openDevTools();
  } else {
    // Production mode: Load from packaged renderer inside ASAR
    // Structure: .vite/build/main.js (__dirname) -> .vite/renderer/{name}/index.html
    const indexPath = path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`);
    mainWindow.loadFile(indexPath);
  }
  
  return mainWindow;
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
      console.error('📂 Main Process IPC: Error in show-open-dialog:', error);
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
      console.error('📄 Main Process IPC: Error in get-file-info:', error);
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
      console.error('✂️ Main Process IPC: Error in trim-video:', error);
      throw error;
    }
  });

  // Handle generate thumbnail
  ipcMain.handle('generate-thumbnail', async (event, { inputPath, outputPath, timeOffset = 1, width = 320, height = 180 }) => {
    try {
      if (!inputPath || !outputPath) {
        throw new Error('Invalid thumbnail parameters');
      }

      // Check if input file exists
      if (!fs.existsSync(inputPath)) {
        throw new Error('Input video file does not exist');
      }

      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Use system FFmpeg for thumbnail generation
      const systemFfmpeg = '/opt/homebrew/bin/ffmpeg';
      const command = `"${systemFfmpeg}" -i "${inputPath}" -ss ${timeOffset} -vframes 1 -vf "scale=${width}:${height}" -f image2 -y "${outputPath}"`;
      
      // Execute FFmpeg command
      await execAsync(command);
      
      // Check if output file was created
      if (!fs.existsSync(outputPath)) {
        throw new Error('Thumbnail file was not created');
      }

      const outputStats = fs.statSync(outputPath);
      if (outputStats.size === 0) {
        throw new Error('Thumbnail file is empty');
      }
      
      return { 
        success: true, 
        outputPath, 
        size: outputStats.size,
        width,
        height
      };
    } catch (error) {
      throw error;
    }
  });

  // Handle get native recording sources (FFmpeg-based)
  ipcMain.handle('get-native-recording-sources', async (event) => {
    console.log('🎥 Main Process IPC: get-native-recording-sources called');
    try {
      // Use FFmpeg to list available capture devices
      const systemFfmpeg = '/opt/homebrew/bin/ffmpeg';
      const command = `"${systemFfmpeg}" -f avfoundation -list_devices true -i ""`;
      
      console.log('🎥 Main Process IPC: Executing FFmpeg command:', command);
      
      let stdout, stderr;
      try {
        const result = await execAsync(command);
        stdout = result.stdout;
        stderr = result.stderr;
        console.log('🎥 Main Process IPC: FFmpeg command succeeded');
        console.log('🎥 Main Process IPC: STDOUT:', stdout);
        console.log('🎥 Main Process IPC: STDERR:', stderr);
      } catch (error) {
        console.log('🎥 Main Process IPC: FFmpeg command failed (expected for device listing)');
        console.log('🎥 Main Process IPC: Error code:', error.code);
        console.log('🎥 Main Process IPC: Error stdout:', error.stdout);
        console.log('🎥 Main Process IPC: Error stderr:', error.stderr);
        
        // FFmpeg returns non-zero exit code even when listing devices successfully
        // Check if we got the device list in stderr
        if (error.stderr && error.stderr.includes('AVFoundation video devices:')) {
          console.log('🎥 Main Process IPC: Found device list in stderr, using error output');
          stdout = error.stdout || '';
          stderr = error.stderr;
        } else {
          console.log('🎥 Main Process IPC: No device list found, throwing error');
          throw error;
        }
      }
      
      // Parse FFmpeg output to extract available sources
      console.log('🎥 Main Process IPC: Parsing FFmpeg sources from stderr');
      const sources = parseFFmpegSources(stderr);
      console.log('🎥 Main Process IPC: Parsed sources:', sources);
      
      // Get thumbnails for screen sources using desktopCapturer
      console.log('🎥 Main Process IPC: Getting thumbnails for screen sources');
      const desktopSources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: 150, height: 150 }
      });
      
      // Match FFmpeg sources with desktopCapturer thumbnails
      const sourcesWithThumbnails = sources.map(source => {
        // For screen capture sources, try to match with desktopCapturer
        if (source.name.includes('Capture screen')) {
          // Extract screen number from name (e.g., "Capture screen 0" -> 0)
          const screenMatch = source.name.match(/Capture screen (\d+)/);
          if (screenMatch) {
            const screenIndex = parseInt(screenMatch[1]);
            // desktopCapturer sources are named like "Screen 1", "Screen 2", etc. (1-indexed)
            const desktopSource = desktopSources.find(ds => 
              ds.name === `Screen ${screenIndex + 1}` || ds.name.includes(`screen ${screenIndex}`)
            );
            
            if (desktopSource && desktopSource.thumbnail) {
              return {
                ...source,
                thumbnail: desktopSource.thumbnail.toDataURL(),
                displayName: desktopSource.display_id ? `Screen ${screenIndex + 1}` : source.name
              };
            }
          }
        }
        
        // For cameras, use a camera icon (no thumbnail available)
        return {
          ...source,
          thumbnail: null,
          displayName: source.name
        };
      });
      
      console.log('🎥 Main Process IPC: Sources with thumbnails:', sourcesWithThumbnails.length);
      
      return {
        success: true,
        sources: sourcesWithThumbnails
      };
    } catch (error) {
      console.error('🎥 Main Process IPC: Error in get-native-recording-sources:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // Handle start native recording (FFmpeg-based)
  ipcMain.handle('start-native-recording', async (event, { sourceId, filename, options = {} }) => {
    try {
      const {
        width = 1920,
        height = 1080,
        framerate = 30,
        bitrate = '2500k'
      } = options;

      // Generate full output path in main process (where os.homedir() is available)
      const recordingsDir = path.join(os.homedir(), 'Desktop', 'Clipforge Recordings');
      const outputPath = path.join(recordingsDir, filename);
      
      console.log('🎥 Main Process IPC: Recording to:', outputPath);

      // Ensure recordings directory exists
      if (!fs.existsSync(recordingsDir)) {
        fs.mkdirSync(recordingsDir, { recursive: true });
      }

      // Use FFmpeg for native screen recording
      const systemFfmpeg = '/opt/homebrew/bin/ffmpeg';
      
      console.log('🎥 Main Process IPC: Starting FFmpeg with source:', sourceId);
      
      // Start FFmpeg process for screen recording on macOS
      const ffmpegProcess = spawn(systemFfmpeg, [
        '-f', 'avfoundation',
        '-capture_cursor', '1',
        '-i', `${sourceId}:0`,
        '-vf', `scale=${width}:${height}`,
        '-r', framerate.toString(),
        '-b:v', bitrate,
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-y',
        outputPath
      ]);

      // Handle process errors
      ffmpegProcess.on('error', (error) => {
        console.error('🎥 FFmpeg process error:', error);
        recordingProcesses.delete(outputPath);
      });
      
      // Log FFmpeg output for debugging
      ffmpegProcess.stderr.on('data', (data) => {
        console.log('🎥 FFmpeg:', data.toString());
      });

      // Store process reference for stopping
      recordingProcesses.set(outputPath, ffmpegProcess);

      return {
        success: true,
        outputPath,
        processId: outputPath
      };
    } catch (error) {
      console.error('🎥 Main Process IPC: Error in start-native-recording:', error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  // Handle stop native recording
  ipcMain.handle('stop-native-recording', async (event, { processId }) => {
    try {
      const process = recordingProcesses.get(processId);
      if (process) {
        process.kill('SIGTERM');
        recordingProcesses.delete(processId);
        
        // Wait a moment for file to be written
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return { success: true };
      }
      return { success: false, error: 'Process not found' };
    } catch (error) {
      console.error('🎥 Main Process IPC: Error in stop-native-recording:', error);
      return { success: false, error: error.message };
    }
  });
};

// Helper function to parse FFmpeg output for available sources
const parseFFmpegSources = (output) => {
  console.log('🎥 parseFFmpegSources: Starting to parse output');
  console.log('🎥 parseFFmpegSources: Raw output:', output);
  
  const sources = [];
  const lines = output.split('\n');
  console.log('🎥 parseFFmpegSources: Split into', lines.length, 'lines');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    console.log(`🎥 parseFFmpegSources: Line ${i}:`, line);
    
    if (line.includes('AVFoundation video devices:')) {
      console.log('🎥 parseFFmpegSources: Found AVFoundation video devices section');
      // Parse video devices
      i++;
      while (i < lines.length && !lines[i].includes('AVFoundation audio devices:')) {
        const deviceLine = lines[i].trim();
        console.log(`🎥 parseFFmpegSources: Processing device line ${i}:`, deviceLine);
        
        // Match the device line pattern: [AVFoundation indev @ ...] [ID] Device Name
        // We need to extract the [ID] and Device Name from the line
        const match = deviceLine.match(/\[AVFoundation[^\]]*\]\s*\[(\d+)\]\s*(.+)/);
        if (match) {
          const deviceId = match[1];
          const deviceName = match[2];
          console.log(`🎥 parseFFmpegSources: Found device - ID: ${deviceId}, Name: ${deviceName}`);
          
          // Filter for screen capture devices and cameras
          if (deviceName.includes('Capture screen') || 
              deviceName.includes('Camera') || 
              deviceName.includes('FaceTime') ||
              deviceName.includes('Virtual Camera')) {
            console.log(`🎥 parseFFmpegSources: Adding device to sources: ${deviceName}`);
            sources.push({
              id: deviceId,
              name: deviceName,
              type: 'video'
            });
          } else {
            console.log(`🎥 parseFFmpegSources: Skipping device (not screen/camera): ${deviceName}`);
          }
        } else {
          console.log(`🎥 parseFFmpegSources: No match for device line: ${deviceLine}`);
        }
        i++;
      }
    }
  }
  
  console.log('🎥 parseFFmpegSources: Final sources array:', sources);
  return sources;
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


/**
 * Recording IPC handlers for native screen recording functionality
 * Handles FFmpeg-based recording operations through Electron IPC
 */

import { desktopCapturer } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { 
  listCaptureDevices, 
  parseFFmpegSources, 
  spawnRecordingProcess, 
  killFFmpegProcess 
} from '../../../shared/domains/recording/ffmpegUtils';
import { 
  logWithContext, 
  logSuccess, 
  logDebug, 
  handleFFmpegError, 
  ERROR_CONTEXTS, 
  ERROR_LEVELS 
} from '../../../shared/services/errorService';

// Track active recording processes
const recordingProcesses = new Map();

/**
 * Gets available native recording sources using FFmpeg
 * @param {Object} event - IPC event
 * @returns {Promise<Object>} - Promise resolving to sources result
 */
export const handleGetNativeRecordingSources = async (event) => {
  logDebug('get-native-recording-sources called', ERROR_CONTEXTS.RECORDING);
  
  try {
    // Use FFmpeg to list available capture devices
    const { stdout, stderr } = await listCaptureDevices();
    
    // Parse FFmpeg output to extract available sources
    logDebug('Parsing FFmpeg sources from stderr', ERROR_CONTEXTS.RECORDING);
    const sources = parseFFmpegSources(stderr);
    logDebug(`Parsed ${sources.length} sources`, ERROR_CONTEXTS.RECORDING, { sources });
    
    // Get thumbnails for screen sources using desktopCapturer
    logDebug('Getting thumbnails for screen sources', ERROR_CONTEXTS.RECORDING);
    const desktopSources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 150, height: 150 }
    });
    
    // Match FFmpeg sources with desktopCapturer thumbnails
    const sourcesWithThumbnails = sources.map(source => {
      if (source.name.includes('Capture screen')) {
        const screenMatch = source.name.match(/Capture screen (\d+)/);
        if (screenMatch) {
          const screenIndex = parseInt(screenMatch[1]);
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
      return {
        ...source,
        thumbnail: null,
        displayName: source.name
      };
    });
    
    logSuccess(`Found ${sourcesWithThumbnails.length} recording sources`, ERROR_CONTEXTS.RECORDING);
    
    return {
      success: true,
      sources: sourcesWithThumbnails
    };
    
  } catch (error) {
    return handleFFmpegError(error, 'get-native-recording-sources');
  }
};

/**
 * Starts native screen recording using FFmpeg
 * @param {Object} event - IPC event
 * @param {Object} params - Recording parameters
 * @param {string} params.sourceId - Source ID to record
 * @param {string} params.filename - Filename for recording
 * @param {Object} params.options - Recording options
 * @returns {Promise<Object>} - Promise resolving to recording start result
 */
export const handleStartNativeRecording = async (event, { sourceId, filename, options = {} }) => {
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
    
    logDebug('Starting native recording', ERROR_CONTEXTS.RECORDING, { 
      sourceId, 
      filename, 
      outputPath, 
      options 
    });

    // Ensure recordings directory exists
    if (!fs.existsSync(recordingsDir)) {
      fs.mkdirSync(recordingsDir, { recursive: true });
      logDebug('Created recordings directory', ERROR_CONTEXTS.RECORDING, { recordingsDir });
    }

    // Spawn FFmpeg process for screen recording
    const { process: ffmpegProcess } = spawnRecordingProcess(sourceId, outputPath, options);

    // Store process reference for stopping
    recordingProcesses.set(outputPath, ffmpegProcess);
    logDebug('Stored recording process reference', ERROR_CONTEXTS.RECORDING, { outputPath });

    logSuccess('Native recording started successfully', ERROR_CONTEXTS.RECORDING, { 
      sourceId, 
      outputPath 
    });

    return {
      success: true,
      outputPath,
      processId: outputPath
    };
    
  } catch (error) {
    return handleFFmpegError(error, 'start-native-recording');
  }
};

/**
 * Stops native screen recording
 * @param {Object} event - IPC event
 * @param {Object} params - Stop parameters
 * @param {string} params.processId - Process ID to stop
 * @returns {Promise<Object>} - Promise resolving to recording stop result
 */
export const handleStopNativeRecording = async (event, { processId }) => {
  try {
    logDebug('Stopping native recording', ERROR_CONTEXTS.RECORDING, { processId });
    
    const process = recordingProcesses.get(processId);
    if (process) {
      await killFFmpegProcess(process);
      recordingProcesses.delete(processId);
      
      logSuccess('Native recording stopped successfully', ERROR_CONTEXTS.RECORDING, { processId });
      
      return { success: true };
    }
    
    logWithContext(`Recording process not found: ${processId}`, ERROR_CONTEXTS.RECORDING, ERROR_LEVELS.WARN);
    return { success: false, error: 'Process not found' };
    
  } catch (error) {
    return handleFFmpegError(error, 'stop-native-recording');
  }
};

/**
 * Gets the current recording processes (for debugging)
 * @param {Object} event - IPC event
 * @returns {Object} - Current recording processes
 */
export const handleGetRecordingProcesses = async (event) => {
  const processes = Array.from(recordingProcesses.keys());
  logDebug('Current recording processes', ERROR_CONTEXTS.RECORDING, { processes });
  
  return {
    success: true,
    processes
  };
};

/**
 * Cleans up all recording processes (for app shutdown)
 */
export const cleanupRecordingProcesses = async () => {
  logDebug('Cleaning up all recording processes', ERROR_CONTEXTS.RECORDING);
  
  const cleanupPromises = Array.from(recordingProcesses.entries()).map(async ([processId, process]) => {
    try {
      await killFFmpegProcess(process);
      logDebug(`Cleaned up process: ${processId}`, ERROR_CONTEXTS.RECORDING);
    } catch (error) {
      logWithContext(`Error cleaning up process ${processId}`, ERROR_CONTEXTS.RECORDING, ERROR_LEVELS.ERROR, error);
    }
  });
  
  await Promise.all(cleanupPromises);
  recordingProcesses.clear();
  
  logSuccess('All recording processes cleaned up', ERROR_CONTEXTS.RECORDING);
};

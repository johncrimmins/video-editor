/**
 * File IPC handlers for file operations
 * Handles file dialogs, file info extraction, and file validation
 */

import { dialog } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import ffprobe from 'ffprobe-static';
import { exec } from 'child_process';
import { promisify } from 'util';
import { 
  logWithContext, 
  logSuccess, 
  logDebug, 
  handleIPCError, 
  ERROR_CONTEXTS, 
  ERROR_LEVELS 
} from '../../../shared/services/errorService';

const execAsync = promisify(exec);

/**
 * Opens file dialog for video file selection
 * @param {Object} event - IPC event
 * @param {Object} options - Dialog options
 * @returns {Promise<Object>} - Promise resolving to file dialog result
 */
export const handleOpenFileDialog = async (event, options = {}) => {
  try {
    const {
      title = 'Select Video File',
      filters = [
        { name: 'Video Files', extensions: ['mp4', 'mov', 'avi', 'mkv', 'webm'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      properties = ['openFile']
    } = options;

    logDebug('Opening file dialog', ERROR_CONTEXTS.FILE, { title, filters, properties });

    const result = await dialog.showOpenDialog({
      title,
      filters,
      properties
    });

    if (result.canceled) {
      logDebug('File dialog canceled by user', ERROR_CONTEXTS.FILE);
      return {
        success: true,
        canceled: true,
        filePath: null
      };
    }

    const filePath = result.filePaths[0];
    logSuccess('File selected', ERROR_CONTEXTS.FILE, { filePath });

    return {
      success: true,
      canceled: false,
      filePath
    };

  } catch (error) {
    return handleIPCError(error, 'open-file-dialog');
  }
};

/**
 * Gets file information including video metadata
 * @param {Object} event - IPC event
 * @param {Object} params - File parameters
 * @param {string} params.filePath - Path to file
 * @returns {Promise<Object>} - Promise resolving to file info result
 */
export const handleGetFileInfo = async (event, { filePath }) => {
  try {
    logDebug('Getting file info', ERROR_CONTEXTS.FILE, { filePath });

    if (!fs.existsSync(filePath)) {
      throw new Error('File does not exist');
    }

    // Get basic file stats
    const stats = fs.statSync(filePath);
    const fileName = path.basename(filePath);
    const fileExtension = path.extname(filePath).toLowerCase();

    // Determine MIME type based on extension
    const mimeTypes = {
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.mkv': 'video/x-matroska',
      '.webm': 'video/webm'
    };
    const mimeType = mimeTypes[fileExtension] || 'video/mp4';

    let duration = 0;
    let width = 0;
    let height = 0;

    // Try to get video metadata using ffprobe
    try {
      logDebug('Getting video metadata with ffprobe', ERROR_CONTEXTS.FILE, { filePath });
      
      const ffprobeCommand = `"${ffprobe.path}" -v quiet -print_format json -show_format -show_streams "${filePath}"`;
      const { stdout } = await execAsync(ffprobeCommand);
      const metadata = JSON.parse(stdout);

      // Extract duration
      if (metadata.format && metadata.format.duration) {
        duration = parseFloat(metadata.format.duration);
      }

      // Extract video dimensions
      const videoStream = metadata.streams?.find(stream => stream.codec_type === 'video');
      if (videoStream) {
        width = parseInt(videoStream.width) || 0;
        height = parseInt(videoStream.height) || 0;
      }

      logDebug('Video metadata extracted', ERROR_CONTEXTS.FILE, { duration, width, height });

    } catch (ffprobeError) {
      logWithContext('Failed to get video metadata with ffprobe', ERROR_CONTEXTS.FILE, ERROR_LEVELS.WARN, ffprobeError);
      // Continue without metadata - duration will be 0
    }

    const fileInfo = {
      name: fileName,
      size: stats.size,
      type: mimeType,
      duration,
      width,
      height,
      lastModified: stats.mtime,
      extension: fileExtension
    };

    logSuccess('File info retrieved successfully', ERROR_CONTEXTS.FILE, { 
      fileName, 
      size: stats.size, 
      duration 
    });

    return {
      success: true,
      fileInfo
    };

  } catch (error) {
    return handleIPCError(error, 'get-file-info');
  }
};

/**
 * Validates if a file is a supported video format
 * @param {Object} event - IPC event
 * @param {Object} params - Validation parameters
 * @param {string} params.filePath - Path to file
 * @returns {Promise<Object>} - Promise resolving to validation result
 */
export const handleValidateVideoFile = async (event, { filePath }) => {
  try {
    logDebug('Validating video file', ERROR_CONTEXTS.FILE, { filePath });

    if (!fs.existsSync(filePath)) {
      return {
        success: true,
        isValid: false,
        error: 'File does not exist'
      };
    }

    const fileExtension = path.extname(filePath).toLowerCase();
    const supportedExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];

    if (!supportedExtensions.includes(fileExtension)) {
      return {
        success: true,
        isValid: false,
        error: `Unsupported file format: ${fileExtension}`
      };
    }

    // Check file size (basic validation)
    const stats = fs.statSync(filePath);
    const maxSize = 500 * 1024 * 1024; // 500MB limit

    if (stats.size > maxSize) {
      return {
        success: true,
        isValid: false,
        error: 'File too large (max 500MB)'
      };
    }

    if (stats.size === 0) {
      return {
        success: true,
        isValid: false,
        error: 'File is empty'
      };
    }

    logSuccess('Video file validation passed', ERROR_CONTEXTS.FILE, { filePath });

    return {
      success: true,
      isValid: true
    };

  } catch (error) {
    return handleIPCError(error, 'validate-video-file');
  }
};

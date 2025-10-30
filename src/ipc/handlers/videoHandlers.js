/**
 * Video IPC handlers for video processing operations
 * Handles video trimming, processing, and manipulation
 */

import path from 'node:path';
import fs from 'node:fs';
import ffmpeg from 'ffmpeg-static';
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
 * Trims a video file using FFmpeg
 * @param {Object} event - IPC event
 * @param {Object} params - Trim parameters
 * @param {string} params.inputPath - Input video file path
 * @param {number} params.startTime - Start time in seconds
 * @param {number} params.endTime - End time in seconds
 * @param {string} params.outputPath - Output video file path
 * @returns {Promise<Object>} - Promise resolving to trim result
 */
export const handleTrimVideo = async (event, { inputPath, startTime, endTime, outputPath }) => {
  try {
    logDebug('Starting video trim operation', ERROR_CONTEXTS.VIDEO, { 
      inputPath, 
      startTime, 
      endTime, 
      outputPath 
    });

    // Validate input file exists
    if (!fs.existsSync(inputPath)) {
      throw new Error('Input video file does not exist');
    }

    // Validate time parameters
    if (startTime < 0 || endTime <= startTime) {
      throw new Error('Invalid time parameters');
    }

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      logDebug('Created output directory', ERROR_CONTEXTS.VIDEO, { outputDir });
    }

    // Calculate duration
    const duration = endTime - startTime;

    // Build FFmpeg command for trimming
    const ffmpegCommand = [
      `"${ffmpeg}"`,
      '-i', `"${inputPath}"`,
      '-ss', startTime.toString(),
      '-t', duration.toString(),
      '-c', 'copy', // Copy streams without re-encoding for speed
      '-avoid_negative_ts', 'make_zero',
      '-y', // Overwrite output file
      `"${outputPath}"`
    ].join(' ');

    logDebug('Executing FFmpeg trim command', ERROR_CONTEXTS.VIDEO, { ffmpegCommand });

    // Execute FFmpeg command
    const { stdout, stderr } = await execAsync(ffmpegCommand);

    logDebug('FFmpeg trim command completed', ERROR_CONTEXTS.VIDEO, { stdout, stderr });

    // Verify output file was created
    if (!fs.existsSync(outputPath)) {
      throw new Error('Output file was not created');
    }

    const outputStats = fs.statSync(outputPath);
    if (outputStats.size === 0) {
      throw new Error('Output file is empty');
    }

    logSuccess('Video trim operation completed successfully', ERROR_CONTEXTS.VIDEO, { 
      inputPath, 
      outputPath, 
      duration 
    });

    return {
      success: true,
      outputPath,
      duration,
      size: outputStats.size
    };

  } catch (error) {
    return handleIPCError(error, 'trim-video');
  }
};

/**
 * Gets video metadata using FFprobe
 * @param {Object} event - IPC event
 * @param {Object} params - Video parameters
 * @param {string} params.filePath - Path to video file
 * @returns {Promise<Object>} - Promise resolving to video metadata
 */
export const handleGetVideoMetadata = async (event, { filePath }) => {
  try {
    logDebug('Getting video metadata', ERROR_CONTEXTS.VIDEO, { filePath });

    if (!fs.existsSync(filePath)) {
      throw new Error('Video file does not exist');
    }

    // Use ffprobe to get detailed video metadata
    const ffprobeCommand = `"${ffmpeg.replace('ffmpeg', 'ffprobe')}" -v quiet -print_format json -show_format -show_streams "${filePath}"`;
    
    logDebug('Executing ffprobe command', ERROR_CONTEXTS.VIDEO, { ffprobeCommand });

    const { stdout } = await execAsync(ffprobeCommand);
    const metadata = JSON.parse(stdout);

    // Extract key information
    const format = metadata.format || {};
    const videoStream = metadata.streams?.find(stream => stream.codec_type === 'video');
    const audioStream = metadata.streams?.find(stream => stream.codec_type === 'audio');

    const videoMetadata = {
      duration: parseFloat(format.duration) || 0,
      size: parseInt(format.size) || 0,
      bitrate: parseInt(format.bit_rate) || 0,
      video: videoStream ? {
        codec: videoStream.codec_name,
        width: parseInt(videoStream.width) || 0,
        height: parseInt(videoStream.height) || 0,
        fps: eval(videoStream.r_frame_rate) || 0,
        bitrate: parseInt(videoStream.bit_rate) || 0
      } : null,
      audio: audioStream ? {
        codec: audioStream.codec_name,
        channels: parseInt(audioStream.channels) || 0,
        sampleRate: parseInt(audioStream.sample_rate) || 0,
        bitrate: parseInt(audioStream.bit_rate) || 0
      } : null
    };

    logSuccess('Video metadata retrieved successfully', ERROR_CONTEXTS.VIDEO, { 
      duration: videoMetadata.duration,
      size: videoMetadata.size 
    });

    return {
      success: true,
      metadata: videoMetadata
    };

  } catch (error) {
    return handleIPCError(error, 'get-video-metadata');
  }
};

/**
 * Converts video to a different format
 * @param {Object} event - IPC event
 * @param {Object} params - Conversion parameters
 * @param {string} params.inputPath - Input video file path
 * @param {string} params.outputPath - Output video file path
 * @param {string} params.format - Target format (mp4, webm, etc.)
 * @param {Object} params.options - Conversion options
 * @returns {Promise<Object>} - Promise resolving to conversion result
 */
export const handleConvertVideo = async (event, { inputPath, outputPath, format = 'mp4', options = {} }) => {
  try {
    logDebug('Starting video conversion', ERROR_CONTEXTS.VIDEO, { 
      inputPath, 
      outputPath, 
      format, 
      options 
    });

    if (!fs.existsSync(inputPath)) {
      throw new Error('Input video file does not exist');
    }

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Build FFmpeg command for conversion
    const {
      quality = 'medium',
      bitrate = '2000k',
      resolution = '1920x1080'
    } = options;

    const ffmpegCommand = [
      `"${ffmpeg}"`,
      '-i', `"${inputPath}"`,
      '-c:v', 'libx264',
      '-preset', quality,
      '-b:v', bitrate,
      '-s', resolution,
      '-c:a', 'aac',
      '-b:a', '128k',
      '-y',
      `"${outputPath}"`
    ].join(' ');

    logDebug('Executing FFmpeg conversion command', ERROR_CONTEXTS.VIDEO, { ffmpegCommand });

    const { stdout, stderr } = await execAsync(ffmpegCommand);

    logDebug('FFmpeg conversion command completed', ERROR_CONTEXTS.VIDEO, { stdout, stderr });

    // Verify output file was created
    if (!fs.existsSync(outputPath)) {
      throw new Error('Output file was not created');
    }

    const outputStats = fs.statSync(outputPath);
    logSuccess('Video conversion completed successfully', ERROR_CONTEXTS.VIDEO, { 
      inputPath, 
      outputPath, 
      size: outputStats.size 
    });

    return {
      success: true,
      outputPath,
      size: outputStats.size
    };

  } catch (error) {
    return handleIPCError(error, 'convert-video');
  }
};

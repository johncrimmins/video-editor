/**
 * IPC handlers index - registers all IPC handlers
 * Centralized registration of all IPC communication handlers
 */

import { ipcMain } from 'electron';

// Import handler modules
import * as recordingHandlers from './recordingHandlers';
import * as fileHandlers from './fileHandlers';
import * as videoHandlers from './videoHandlers';

/**
 * Registers all IPC handlers
 */
export const registerAllHandlers = () => {
  console.log('🔧 Registering IPC handlers...');

  // Recording handlers
  ipcMain.handle('get-native-recording-sources', recordingHandlers.handleGetNativeRecordingSources);
  ipcMain.handle('start-native-recording', recordingHandlers.handleStartNativeRecording);
  ipcMain.handle('stop-native-recording', recordingHandlers.handleStopNativeRecording);
  ipcMain.handle('get-recording-processes', recordingHandlers.handleGetRecordingProcesses);

  // File handlers
  ipcMain.handle('open-file-dialog', fileHandlers.handleOpenFileDialog);
  ipcMain.handle('get-file-info', fileHandlers.handleGetFileInfo);
  ipcMain.handle('validate-video-file', fileHandlers.handleValidateVideoFile);

  // Video handlers
  ipcMain.handle('trim-video', videoHandlers.handleTrimVideo);
  ipcMain.handle('get-video-metadata', videoHandlers.handleGetVideoMetadata);
  ipcMain.handle('convert-video', videoHandlers.handleConvertVideo);

  console.log('✅ All IPC handlers registered successfully');
};

/**
 * Cleanup function for app shutdown
 */
export const cleanupHandlers = async () => {
  console.log('🧹 Cleaning up IPC handlers...');
  
  // Cleanup recording processes
  await recordingHandlers.cleanupRecordingProcesses();
  
  console.log('✅ IPC handlers cleanup completed');
};

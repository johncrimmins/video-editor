# Recording Implementation Plan: Native File System Approach

## 🎯 Problem Analysis

### Current Issues
1. **WebM Blob Duration Problem**: MediaRecorder creates WebM blobs with missing duration metadata, causing `video.duration` to return `Infinity`
2. **Web App Approach**: Using blob URLs instead of native file system operations
3. **Inconsistent Data Flow**: Recording uses different data flow than file import (blob vs real files)
4. **Timeline Freeze**: `Infinity` duration causes infinite calculations in timeline rendering

### Root Cause
We're treating an Electron desktop app like a web app, using browser blob APIs instead of leveraging Electron's native file system capabilities.

## 🚀 Solution: Native File System Approach

### Core Principle
**Use Electron's native file system access instead of web blob APIs** - record directly to files and process them the same way as imported files.

## 📋 Implementation Plan

### Phase 1: Add File System Recording IPC

#### 1.1 Add IPC Handler in main.js
```javascript
// Add to setupIpcHandlers() in main.js
ipcMain.handle('save-recording', async (event, { blobData, filename }) => {
  try {
    const recordingsDir = path.join(os.homedir(), 'Desktop', 'Clipforge Recordings');
    
    // Ensure recordings directory exists
    if (!fs.existsSync(recordingsDir)) {
      fs.mkdirSync(recordingsDir, { recursive: true });
    }
    
    const filePath = path.join(recordingsDir, filename);
    
    // Write blob data to file
    fs.writeFileSync(filePath, Buffer.from(blobData));
    
    // Use existing getFileInfo to extract metadata (including duration)
    const fileInfo = await getFileInfo(filePath);
    
    return {
      success: true,
      filePath,
      fileInfo
    };
  } catch (error) {
    console.error('🎥 Main Process IPC: Error in save-recording:', error);
    return {
      success: false,
      error: error.message
    };
  }
});
```

#### 1.2 Add Preload API
```javascript
// Add to preload.js
saveRecording: (blobData, filename) => {
  return ipcRenderer.invoke('save-recording', { blobData, filename });
}
```

### Phase 2: Update Recording Service

#### 2.1 Add File System Recording Function
```javascript
// Add to recordingService.js
export const saveRecordingToFile = async (blob, filename) => {
  try {
    if (!window.electronAPI || !window.electronAPI.saveRecording) {
      throw new Error('Electron API not available. Make sure preload script is loaded.');
    }
    
    // Convert blob to ArrayBuffer for IPC
    const arrayBuffer = await blob.arrayBuffer();
    const blobData = new Uint8Array(arrayBuffer);
    
    const result = await window.electronAPI.saveRecording(blobData, filename);
    return result;
  } catch (error) {
    console.error('🎥 recordingService.js: Save recording error:', error);
    throw error;
  }
};
```

### Phase 3: Update useRecording Hook

#### 3.1 Replace Blob URL Approach
```javascript
// Update onstop handler in useRecording.js
mediaRecorder.onstop = async () => {
  const currentChunks = chunksRef.current;
  const blob = new Blob(currentChunks, { type: 'video/webm' });
  const filename = generateRecordingFilename('recording', 'webm');
  
  try {
    // Save recording to file system (native approach)
    console.log('🎥 useRecording: Saving recording to file system...');
    const result = await saveRecordingToFile(blob, filename);
    
    if (result.success) {
      // Create video file object with real file path and FFmpeg-extracted metadata
      const videoFile = {
        path: result.filePath,           // Real file path (not blob URL)
        name: result.fileInfo.name,
        size: result.fileInfo.size,
        type: result.fileInfo.type,
        duration: result.fileInfo.duration,  // From FFmpeg (not Infinity!)
        isRecorded: true
      };
      
      console.log('🎥 useRecording: Recording saved with duration:', videoFile.duration);
      setCompletedRecording(videoFile);
    } else {
      throw new Error(result.error || 'Failed to save recording');
    }
  } catch (error) {
    console.error('🎥 useRecording: Failed to save recording:', error);
    setError(error.message);
  }
  
  // Clean up
  stopStream(stream);
  setCurrentStream(null);
  setRecordedChunks([]);
  chunksRef.current = [];
};
```

### Phase 4: Update Video File Structure

#### 4.1 Remove Blob URL Dependencies
```javascript
// Update blobToVideoFile in recordingUtils.js
export const createVideoFileFromPath = (filePath, fileInfo) => {
  return {
    // Match the structure expected by the existing video system
    path: filePath,                    // Real file path
    name: fileInfo.name,
    size: fileInfo.size,
    type: fileInfo.type,
    duration: fileInfo.duration,       // From FFmpeg (finite number)
    isRecorded: true
  };
};
```

### Phase 5: Update Duration Validation

#### 5.1 Fix Timeline Duration Validation
```javascript
// Update TimelineEditorScreen.jsx
if (!videoFile?.duration || videoFile.duration <= 0 || !isFinite(videoFile.duration)) {
  return <TimelineErrorBoundary videoFile={videoFile} onDeleteClip={onDeleteClip} />;
}

// Update useTimeline.js
if (!videoFile?.duration || videoFile.duration <= 0 || !isFinite(videoFile.duration)) {
  const error = new Error(`Invalid video duration: ${videoFile?.duration}. Video must have a valid finite duration greater than 0.`);
  console.error('🎣 useTimeline: Invalid video duration:', error.message);
  throw error;
}
```

## 🔄 Data Flow Comparison

### Current (Broken) Flow
```
MediaRecorder → Blob → blobToVideoFile → blob URL → extractDurationFromFile → Infinity → Timeline Freeze
```

### New (Native) Flow
```
MediaRecorder → Blob → saveRecordingToFile → Real File → getFileInfo (FFmpeg) → Finite Duration → Timeline Works
```

## ✅ Benefits of Native Approach

1. **Consistent with File Import**: Same data flow and processing pipeline
2. **Proper Duration Extraction**: FFmpeg handles duration correctly (no Infinity)
3. **Native Performance**: Real file system access, no blob URL overhead
4. **Desktop App Integration**: Files saved to user's Desktop/Clipforge Recordings
5. **Timeline Compatibility**: Works with existing video processing system
6. **Error Handling**: Proper error states and user feedback

## 🧪 Testing Strategy

### Phase 1 Testing
- [ ] IPC handler saves blob to file system
- [ ] File is created in Desktop/Clipforge Recordings directory
- [ ] FFmpeg extracts proper duration from saved file

### Phase 2 Testing
- [ ] Recording completes without Infinity duration
- [ ] Timeline shows recorded video (not error screen)
- [ ] Video plays correctly in timeline editor

### Phase 3 Testing
- [ ] Recorded videos integrate with existing timeline features
- [ ] Trim functionality works with recorded videos
- [ ] Export functionality works with recorded videos

## 📁 File Changes Required

### New Files
- None (reuse existing infrastructure)

### Modified Files
1. `src/main.js` - Add save-recording IPC handler
2. `src/preload.js` - Add saveRecording API
3. `src/shared/domains/recording/recordingService.js` - Add saveRecordingToFile function
4. `src/shared/hooks/useRecording.js` - Update onstop handler to use file system
5. `src/shared/domains/recording/recordingUtils.js` - Add createVideoFileFromPath function
6. `src/screens/TimelineScreen/components/TimelineEditorScreen.jsx` - Add isFinite validation
7. `src/screens/TimelineScreen/hooks/useTimeline.js` - Add isFinite validation

### Removed Code
- Remove `extractDurationFromFile` usage in useRecording
- Remove blob URL creation in blobToVideoFile
- Remove debugging logs after implementation

## 🎯 Success Criteria

1. **Recording completes** with finite duration (not Infinity)
2. **Timeline shows** recorded video instead of error screen
3. **Video plays** correctly in timeline editor
4. **File is saved** to Desktop/Clipforge Recordings directory
5. **Duration is accurate** (matches actual recording time)
6. **Integration works** with existing timeline features (trim, export)

## 📝 Notes for Next Agent

- This approach leverages Electron's native capabilities instead of fighting browser limitations
- The key insight is to treat recordings like file imports - use the file system and FFmpeg
- All existing video processing infrastructure can be reused
- The `isFinite()` validation prevents the timeline freeze issue
- This maintains consistency with the existing codebase architecture

## 🚨 Critical Points

1. **Don't use blob URLs** - use real file paths
2. **Don't extract duration from blobs** - use FFmpeg in main process
3. **Use existing file processing** - reuse getFileInfo/getVideoDuration
4. **Add isFinite validation** - prevent Infinity duration issues
5. **Save to file system** - leverage Electron's native capabilities

This approach transforms the recording feature from a web app pattern to a proper native desktop app pattern, solving the duration issue and providing better integration with the existing codebase.

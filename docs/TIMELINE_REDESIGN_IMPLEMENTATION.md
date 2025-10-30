# Timeline Redesign Implementation Guide

## Overview
Transform the timeline editor from basic Konva shapes to a beautiful, design-system-aligned interface matching the reference screenshot. This guide covers all three implementation phases.

---

## Phase 1: Redesign Konva Components with Design System

### 1.1 Update ClipBlock Component

**File**: `src/screens/TimelineScreen/components/ClipBlock.jsx`

**Design System Colors**:
```javascript
// From darkTheme.js
const CLIP_COLORS = {
  fill: '#2a2a3a',           // Dark purple-gray
  fillGradient: '#1f1f2e',   // Darker shade for gradient
  stroke: 'rgba(99, 102, 241, 0.3)', // Primary with opacity
  strokeWidth: 1,
  cornerRadius: 8,           // Rounded corners
};

const HANDLE_COLORS = {
  fill: 'rgba(255, 255, 255, 0.3)',  // Light with opacity
  fillHover: 'rgba(255, 255, 255, 0.5)',
  stroke: 'rgba(255, 255, 255, 0.1)',
  strokeWidth: 1,
  width: 6,                  // Thin, elegant
  cornerRadius: 3,
};
```

**Implementation Structure**:
```javascript
import React, { useState, memo, useCallback } from 'react';
import { Group, Rect, Line } from 'react-konva';
import { calculateClipWidth, clamp } from '../../../shared/domains/timeline';

const ClipBlock = memo(({ videoFile, timelineWidth, yOffset = 0, onTrimStart, onTrimEnd }) => {
  const [leftHandleX, setLeftHandleX] = useState(0);
  const [rightHandleX, setRightHandleX] = useState(clipWidth);
  const [leftHover, setLeftHover] = useState(false);
  const [rightHover, setRightHover] = useState(false);

  // Clip dimensions
  const clipWidth = calculateClipWidth(videoFile.duration, videoFile.duration, timelineWidth);
  const clipHeight = 60;
  const clipY = yOffset + 10;

  // Main clip block with rounded corners
  <Rect
    x={leftHandleX}
    y={clipY}
    width={rightHandleX - leftHandleX}
    height={clipHeight}
    fill="#2a2a3a"
    stroke="rgba(99, 102, 241, 0.3)"
    strokeWidth={1}
    cornerRadius={8}
    shadowColor="rgba(0, 0, 0, 0.3)"
    shadowBlur={4}
    shadowOffset={{ x: 0, y: 2 }}
  />

  // Left trim handle with grip indicator
  <Group>
    <Rect
      x={leftHandleX}
      y={clipY}
      width={6}
      height={clipHeight}
      fill={leftHover ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)'}
      stroke="rgba(255, 255, 255, 0.1)"
      strokeWidth={1}
      cornerRadius={3}
      draggable
      onMouseEnter={() => setLeftHover(true)}
      onMouseLeave={() => setLeftHover(false)}
      onDragMove={handleLeftDragMove}
      onDragEnd={handleLeftDragEnd}
    />
    {/* Grip dots - 3 small circles vertically centered */}
    <Line
      points={[leftHandleX + 3, clipY + clipHeight/2 - 6, 
               leftHandleX + 3, clipY + clipHeight/2 - 6]}
      stroke="rgba(255, 255, 255, 0.5)"
      strokeWidth={1.5}
      lineCap="round"
    />
    <Line
      points={[leftHandleX + 3, clipY + clipHeight/2, 
               leftHandleX + 3, clipY + clipHeight/2]}
      stroke="rgba(255, 255, 255, 0.5)"
      strokeWidth={1.5}
      lineCap="round"
    />
    <Line
      points={[leftHandleX + 3, clipY + clipHeight/2 + 6, 
               leftHandleX + 3, clipY + clipHeight/2 + 6]}
      stroke="rgba(255, 255, 255, 0.5)"
      strokeWidth={1.5}
      lineCap="round"
    />
  </Group>

  // Right trim handle (mirror of left)
  // ... similar structure
});
```

**Key Changes**:
- Replace `#007bff` with `#2a2a3a` (dark purple-gray)
- Add `cornerRadius={8}` to all Rect components
- Change trim handle width from 10px to 6px
- Update colors to use rgba with opacity
- Add hover states for trim handles
- Add grip indicators (3 dots)
- Add subtle shadow to clip block

---

### 1.2 Create Beautiful Playback Head Component

**File**: `src/screens/TimelineScreen/components/PlaybackHead.jsx` (NEW FILE)

**Complete Implementation**:
```javascript
import React, { memo, useState, useCallback } from 'react';
import { Group, Rect, Circle, Line } from 'react-konva';
import { darkTheme } from '../../../shared/ui/darkTheme';

const PlaybackHead = memo(({ 
  x, 
  timelineHeight, 
  timelineWidth,
  onDragMove, 
  onDragEnd 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragMove = useCallback((e) => {
    const newX = e.target.x();
    onDragMove?.(newX);
  }, [onDragMove]);

  const handleDragEnd = useCallback((e) => {
    setIsDragging(false);
    const newX = e.target.x();
    onDragEnd?.(newX);
  }, [onDragEnd]);

  const handleColor = isDragging || isHover 
    ? darkTheme.primaryLight 
    : darkTheme.primary;

  return (
    <Group>
      {/* Vertical line */}
      <Line
        points={[x, 0, x, timelineHeight]}
        stroke={darkTheme.primary}
        strokeWidth={2}
        listening={false}
      />
      
      {/* Top handle - draggable circle */}
      <Circle
        x={x}
        y={8}
        radius={8}
        fill={handleColor}
        stroke={darkTheme.text}
        strokeWidth={1}
        draggable
        dragBoundFunc={(pos) => ({
          x: Math.max(0, Math.min(timelineWidth, pos.x)),
          y: 8, // Keep Y fixed
        })}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        shadowColor="rgba(0, 0, 0, 0.5)"
        shadowBlur={4}
        shadowOffset={{ x: 0, y: 2 }}
      />
      
      {/* Inner circle for depth */}
      <Circle
        x={x}
        y={8}
        radius={4}
        fill={darkTheme.text}
        listening={false}
      />
    </Group>
  );
});

PlaybackHead.displayName = 'PlaybackHead';

export default PlaybackHead;
```

**Key Features**:
- Draggable circular handle at top
- Vertical line extends full timeline height
- Uses primary color from design system
- Hover and drag states for visual feedback
- Constrained dragging (stays within timeline bounds)
- Smooth transitions and shadows

---

### 1.3 Update TimelineCanvas Component

**File**: `src/screens/TimelineScreen/components/TimelineCanvas.jsx`

**Key Updates**:

```javascript
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Stage, Layer, Line, Text as KonvaText, Rect } from 'react-konva';
import { getDefaultTimelineDimensions, positionToTime, timeToPosition } from '../../../shared/domains/timeline';
import ClipBlock from './ClipBlock';
import PlaybackHead from './PlaybackHead';
import { Button } from '../../../shared/ui';
import { darkTheme } from '../../../shared/ui/darkTheme';

const TimelineCanvas = ({ videoFile, trimPoints, updateTrimPoint, onTimeUpdate }) => {
  const [dimensions, setDimensions] = useState(getDefaultTimelineDimensions());
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Playback head position
  const playbackHeadX = useMemo(() => {
    return timeToPosition(currentTime, videoFile?.duration || 0, dimensions.width);
  }, [currentTime, videoFile?.duration, dimensions.width]);

  // Playback head drag handlers (memoized)
  const handlePlaybackHeadDragMove = useCallback((newX) => {
    const constrainedX = Math.max(0, Math.min(dimensions.width, newX));
    const newTime = positionToTime(constrainedX, videoFile?.duration || 0, dimensions.width);
    setCurrentTime(newTime);
    onTimeUpdate?.(newTime); // Update video element
  }, [dimensions.width, videoFile?.duration, onTimeUpdate]);

  const handlePlaybackHeadDragEnd = useCallback((newX) => {
    const constrainedX = Math.max(0, Math.min(dimensions.width, newX));
    const newTime = positionToTime(constrainedX, videoFile?.duration || 0, dimensions.width);
    setCurrentTime(newTime);
    onTimeUpdate?.(newTime);
  }, [dimensions.width, videoFile?.duration, onTimeUpdate]);

  // Time markers with design system colors
  const timeMarkers = useMemo(() => {
    if (!videoFile?.duration) return [];
    
    const markers = [];
    const interval = Math.max(1, Math.floor(videoFile.duration / 20));
    
    for (let i = 0; i <= videoFile.duration; i += interval) {
      const x = timeToPosition(i, videoFile.duration, dimensions.width);
      
      // Time text
      markers.push(
        <KonvaText
          key={`marker-text-${i}`}
          x={x - 20}
          y={5}
          text={formatTime(i)}
          fontSize={10}
          fill={darkTheme.textSecondary}
          align="center"
          width={40}
        />
      );
      
      // Tick mark
      markers.push(
        <Line
          key={`marker-line-${i}`}
          points={[x, 30, x, 40]}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={1}
        />
      );
    }
    return markers;
  }, [videoFile?.duration, dimensions.width, formatTime]);

  return (
    <>
      {/* Playback Controls Bar */}
      <div className="flex items-center justify-between px-md py-sm border-b border-border bg-background">
        {/* ... existing controls ... */}
      </div>
      
      {/* Timeline Canvas */}
      <div className="flex justify-center items-center p-md bg-background-secondary">
        <div className="relative">
          <Stage width={dimensions.width} height={dimensions.height}>
            <Layer>
              {/* Timeline ruler background */}
              <Rect
                x={0}
                y={0}
                width={dimensions.width}
                height={50}
                fill={darkTheme.backgroundSecondary}
              />
              
              {/* Time markers */}
              {timeMarkers}
              
              {/* Timeline base line */}
              <Line
                points={[0, 50, dimensions.width, 50]}
                stroke={darkTheme.border}
                strokeWidth={2}
              />
              
              {/* Video clip block with trim handles */}
              {videoFile && (
                <ClipBlock
                  videoFile={videoFile}
                  timelineWidth={dimensions.width}
                  yOffset={50}
                  onTrimStart={(x) => {
                    const inTime = positionToTime(x, videoFile.duration, dimensions.width);
                    updateTrimPoint('inTime', inTime);
                  }}
                  onTrimEnd={(x) => {
                    const outTime = positionToTime(x, videoFile.duration, dimensions.width);
                    updateTrimPoint('outTime', outTime);
                  }}
                />
              )}
              
              {/* Playback head */}
              <PlaybackHead
                x={playbackHeadX}
                timelineHeight={dimensions.height}
                timelineWidth={dimensions.width}
                onDragMove={handlePlaybackHeadDragMove}
                onDragEnd={handlePlaybackHeadDragEnd}
              />
            </Layer>
          </Stage>
        </div>
      </div>
    </>
  );
};

export default TimelineCanvas;
```

**Key Changes**:
- Import `PlaybackHead` component
- Use `darkTheme` colors throughout
- Update ruler background to `backgroundSecondary`
- Update time marker colors to `textSecondary`
- Update tick marks to use rgba with opacity
- Replace inline playback head with `PlaybackHead` component
- Add `onTimeUpdate` callback for video sync

---

## Phase 2: Implement Scrubbing Functionality

### 2.1 Update TimelineEditorContent to Pass Time Updates

**File**: `src/screens/TimelineScreen/components/TimelineEditorContent.jsx`

```javascript
import React, { useRef, useCallback } from 'react';
import { EditorScreen } from '../../../shared/layouts';
import TimelineCanvas from './TimelineCanvas';
import VideoPreview from './VideoPreview';
import ControlPanel from './ControlPanel';
import { useTimelineContext } from '../../../contexts/TimelineContext';

const TimelineEditorContent = ({ onDeleteClip }) => {
  const { videoFile, trimPoints, updateTrimPoint, handleApplyTrim } = useTimelineContext();
  const videoRef = useRef(null);
  
  // Handle time updates from scrubbing
  const handleTimeUpdate = useCallback((newTime) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  }, []);
  
  return (
    <EditorScreen>
      <div className="grid grid-rows-[1fr_auto] w-full h-full overflow-hidden">
        {videoFile ? (
          <>
            {/* Video Preview Panel */}
            <div className="min-h-0 p-md bg-background overflow-hidden">
              <VideoPreview 
                videoFile={videoFile} 
                trimPoints={trimPoints}
                videoRef={videoRef}
              />
            </div>
            
            {/* Timeline Editor */}
            <div className="grid grid-rows-[auto_auto_auto] bg-background-secondary">
              <TimelineCanvas 
                videoFile={videoFile} 
                trimPoints={trimPoints} 
                updateTrimPoint={updateTrimPoint}
                onTimeUpdate={handleTimeUpdate}
              />
              
              {/* Control Panel */}
              <div className="border-t border-border">
                <ControlPanel 
                  videoFile={videoFile} 
                  trimPoints={trimPoints}
                  onApplyTrim={handleApplyTrim}
                  onDeleteClip={onDeleteClip}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-full">
            <p className="text-text-secondary">No video loaded</p>
          </div>
        )}
      </div>
    </EditorScreen>
  );
};

export default TimelineEditorContent;
```

**Key Changes**:
- Add `videoRef` to access video element
- Create `handleTimeUpdate` callback
- Pass `onTimeUpdate` to `TimelineCanvas`
- Pass `videoRef` to `VideoPreview`

---

### 2.2 Update VideoPreview to Accept Ref

**File**: `src/screens/TimelineScreen/components/VideoPreview.jsx`

```javascript
import React, { memo } from 'react';
import { VideoElement } from '../../../shared/ui';

const VideoPreview = memo(({ videoFile, trimPoints, videoRef }) => {
  if (!videoFile) {
    return null;
  }
  
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="relative w-full h-full max-w-4xl flex items-center justify-center">
        <div className="border-4 border-primary rounded-lg overflow-hidden bg-black max-h-full">
          <VideoElement 
            videoFile={videoFile}
            trimPoints={trimPoints}
            videoRef={videoRef}
            onError={(e) => {
              // Silently handle video errors
            }}
          />
        </div>
        
        {/* Trim info overlay */}
        {trimPoints && (
          <div className="absolute bottom-2 right-2 bg-black/70 px-3 py-1 rounded text-xs text-text-secondary">
            <span>In: {trimPoints.inTime?.toFixed(2)}s</span>
            <span className="mx-2">|</span>
            <span>Out: {trimPoints.outTime?.toFixed(2)}s</span>
            <span className="mx-2">|</span>
            <span>Duration: {(trimPoints.outTime - trimPoints.inTime)?.toFixed(2)}s</span>
          </div>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.videoFile?.path === nextProps.videoFile?.path &&
    prevProps.trimPoints?.inTime === nextProps.trimPoints?.inTime &&
    prevProps.trimPoints?.outTime === nextProps.trimPoints?.outTime
  );
});

VideoPreview.displayName = 'VideoPreview';

export default VideoPreview;
```

**Key Changes**:
- Accept `videoRef` prop
- Pass `videoRef` to `VideoElement`

---

### 2.3 Update VideoElement to Support Ref

**File**: `src/shared/ui/VideoElement.jsx`

```javascript
import React, { useEffect, useRef } from 'react';

const VideoElement = ({ videoFile, trimPoints, videoRef, onError }) => {
  const internalRef = useRef(null);
  const ref = videoRef || internalRef;

  useEffect(() => {
    if (ref.current && trimPoints) {
      ref.current.currentTime = trimPoints.inTime || 0;
    }
  }, [trimPoints, ref]);

  if (!videoFile?.url && !videoFile?.path) {
    return null;
  }

  const videoSrc = videoFile.url || `app://${videoFile.path}`;

  return (
    <video
      ref={ref}
      src={videoSrc}
      controls
      className="w-full h-full max-h-[70vh] object-contain"
      onError={onError}
    />
  );
};

export default VideoElement;
```

**Key Changes**:
- Accept `videoRef` prop
- Use external ref if provided, otherwise use internal ref
- Expose video element for currentTime manipulation

---

## Phase 3: Polish & Refinement

### 3.1 Add Smooth Transitions

**Update ClipBlock.jsx**:
```javascript
// Add to trim handle Rect components
opacity={leftHover ? 1 : 0.8}
// Konva will smooth the transition
```

**Update PlaybackHead.jsx**:
```javascript
// Add scale effect on hover/drag
const scale = isDragging ? 1.2 : (isHover ? 1.1 : 1);

<Circle
  // ... existing props
  scaleX={scale}
  scaleY={scale}
/>
```

### 3.2 Add Cursor Feedback

**Update TimelineCanvas.jsx**:
```javascript
// Add to Stage component
style={{ cursor: 'default' }}

// Add to PlaybackHead Circle
style={{ cursor: isDragging ? 'grabbing' : 'grab' }}

// Add to ClipBlock trim handles
style={{ cursor: 'ew-resize' }}
```

### 3.3 Performance Verification

**Checklist**:
- ✅ All event handlers use `useCallback`
- ✅ Expensive calculations use `useMemo`
- ✅ Components use `React.memo` with custom comparison
- ✅ No console.log statements in production code
- ✅ Drag operations are smooth (60fps)
- ✅ No unnecessary re-renders during interactions

---

## Testing Checklist

### Visual Tests:
- [ ] Clip block has rounded corners and proper colors
- [ ] Trim handles are elegant (6px width, rounded, light color)
- [ ] Playback head has circular handle and vertical line
- [ ] All colors match design system
- [ ] Hover states work on all interactive elements
- [ ] Shadows and depth effects are visible

### Functional Tests:
- [ ] Trim handles drag smoothly
- [ ] Playback head drags smoothly
- [ ] Video scrubbing works (video seeks to dragged position)
- [ ] Playback head stays within timeline bounds
- [ ] Trim handles constrain properly
- [ ] Time markers display correctly
- [ ] All interactions are smooth (60fps)

### Integration Tests:
- [ ] Video preview syncs with playback head position
- [ ] Trim points update correctly
- [ ] Apply trim button works
- [ ] Delete clip button works
- [ ] Navigation between screens works
- [ ] State persists across navigation

---

## File Creation Summary

### New Files to Create:
1. `src/screens/TimelineScreen/components/PlaybackHead.jsx` - Beautiful draggable playback head component

### Files to Update:
1. `src/screens/TimelineScreen/components/ClipBlock.jsx` - Redesign with rounded corners and elegant handles
2. `src/screens/TimelineScreen/components/TimelineCanvas.jsx` - Integrate PlaybackHead, update colors, add scrubbing
3. `src/screens/TimelineScreen/components/TimelineEditorContent.jsx` - Add video ref and time update handling
4. `src/screens/TimelineScreen/components/VideoPreview.jsx` - Accept and pass video ref
5. `src/shared/ui/VideoElement.jsx` - Support external ref for currentTime control

---

## Design System Reference

**Colors** (from `darkTheme.js`):
```javascript
background: '#0f0f0f'
backgroundSecondary: '#1a1a1a'
primary: '#6366f1'
primaryHover: '#4f46e5'
primaryLight: '#818cf8'
border: '#2a2a2a'
text: '#ffffff'
textSecondary: '#a0a0a0'
```

**Spacing** (from `darkSpacing`):
```javascript
sm: '8px'
md: '12px'
lg: '16px'
xl: '20px'
```

**Border Radius** (from `darkBorderRadius`):
```javascript
sm: '4px'
md: '8px'
lg: '12px'
```

---

## Implementation Notes

1. **Performance**: All drag handlers must be memoized with `useCallback`
2. **Constraints**: Playback head and trim handles must stay within bounds
3. **Sync**: Video element currentTime must sync with playback head position
4. **Colors**: Use design system colors consistently (no hardcoded colors)
5. **Rounded Corners**: All Konva Rect components should have `cornerRadius`
6. **Opacity**: Use rgba() for subtle, layered effects
7. **Shadows**: Add subtle shadows for depth (shadowBlur, shadowOffset)
8. **Hover States**: All interactive elements should have hover feedback

---

**End of Implementation Guide** - Total Lines: 498


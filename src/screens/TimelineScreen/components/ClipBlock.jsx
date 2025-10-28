import React, { useState } from 'react';
import { Group, Rect } from 'react-konva';
import { calculateClipWidth, clamp } from '../utils/timelineUtils';

console.log('📦 ClipBlock.jsx: ClipBlock component loading...');

const ClipBlock = ({ videoFile, timelineWidth, onTrimStart, onTrimEnd }) => {
  console.log('📦 ClipBlock.jsx: ClipBlock component rendering...');
  console.log('📦 ClipBlock.jsx: videoFile prop:', videoFile);
  console.log('📦 ClipBlock.jsx: timelineWidth prop:', timelineWidth);
  
  if (!videoFile) {
    console.log('📦 ClipBlock.jsx: No video file, returning null');
    return null;
  }
  
  const clipWidth = calculateClipWidth(videoFile.duration || 0, videoFile.duration || 0, timelineWidth);
  const clipHeight = 40;
  const clipY = 30; // Position above timeline line
  
  // State for trim handle positions
  const [leftHandleX, setLeftHandleX] = useState(-5);
  const [rightHandleX, setRightHandleX] = useState(clipWidth - 5);
  
  // Calculate dynamic clip block dimensions
  const dynamicClipX = leftHandleX + 5; // Start after left handle
  const dynamicClipWidth = rightHandleX - leftHandleX - 5; // Width between handles
  
  console.log('📦 ClipBlock.jsx: Calculated clip width:', clipWidth);
  console.log('📦 ClipBlock.jsx: Left handle x:', leftHandleX, 'Right handle x:', rightHandleX);
  console.log('📦 ClipBlock.jsx: Dynamic clip x:', dynamicClipX, 'width:', dynamicClipWidth);
  
  return (
    <Group>
      {/* Main clip rectangle - dynamic width */}
      <Rect
        x={dynamicClipX}
        y={clipY}
        width={dynamicClipWidth}
        height={clipHeight}
        fill="#007bff"
        stroke="#0056b3"
        strokeWidth={1}
        name="clip-block"
      />
      
      {/* Left trim handle */}
      <Rect
        x={leftHandleX}
        y={clipY}
        width={10}
        height={clipHeight}
        fill="#ff6b6b"
        stroke="#d63031"
        strokeWidth={1}
        draggable={true}
        name="left-trim-handle"
        onDragMove={(e) => {
          const newX = e.target.x();
          const constrainedX = clamp(newX, -5, rightHandleX - 10);
          console.log('📦 ClipBlock.jsx: Left trim handle dragging to x:', newX, 'constrained to:', constrainedX);
          setLeftHandleX(constrainedX);
          if (onTrimStart) {
            onTrimStart(constrainedX);
          }
        }}
        onDragEnd={(e) => {
          const newX = e.target.x();
          const constrainedX = clamp(newX, -5, rightHandleX - 10);
          console.log('📦 ClipBlock.jsx: Left trim handle drag ended at x:', constrainedX);
          setLeftHandleX(constrainedX);
          if (onTrimStart) {
            onTrimStart(constrainedX);
          }
        }}
      />
      
      {/* Right trim handle */}
      <Rect
        x={rightHandleX}
        y={clipY}
        width={10}
        height={clipHeight}
        fill="#ff6b6b"
        stroke="#d63031"
        strokeWidth={1}
        draggable={true}
        name="right-trim-handle"
        onDragMove={(e) => {
          const newX = e.target.x();
          const constrainedX = clamp(newX, leftHandleX + 10, timelineWidth - 5);
          console.log('📦 ClipBlock.jsx: Right trim handle dragging to x:', newX, 'constrained to:', constrainedX);
          setRightHandleX(constrainedX);
          if (onTrimEnd) {
            onTrimEnd(constrainedX);
          }
        }}
        onDragEnd={(e) => {
          const newX = e.target.x();
          const constrainedX = clamp(newX, leftHandleX + 10, timelineWidth - 5);
          console.log('📦 ClipBlock.jsx: Right trim handle drag ended at x:', constrainedX);
          setRightHandleX(constrainedX);
          if (onTrimEnd) {
            onTrimEnd(constrainedX);
          }
        }}
      />
    </Group>
  );
};

console.log('📦 ClipBlock.jsx: ClipBlock component defined, exporting...');
export default ClipBlock;

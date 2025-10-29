import React, { useState } from 'react';
import { Group, Rect } from 'react-konva';
import { calculateClipWidth, clamp } from '../../../shared/domains/timeline';

const ClipBlock = ({ videoFile, timelineWidth, onTrimStart, onTrimEnd }) => {
  // Debug logging
  console.log('🎯 ClipBlock: Component rendering');
  console.log('🎯 ClipBlock: videoFile:', videoFile);
  console.log('🎯 ClipBlock: timelineWidth:', timelineWidth);
  
  if (!videoFile) {
    console.log('🎯 ClipBlock: No video file, returning null');
    return null;
  }
  
  const clipWidth = calculateClipWidth(videoFile.duration, videoFile.duration, timelineWidth);
  console.log('🎯 ClipBlock: clipWidth calculated:', clipWidth);
  
  const clipHeight = 40;
  const clipY = 30; // Position above timeline line
  
  // State for trim handle positions
  const [leftHandleX, setLeftHandleX] = useState(0);
  const [rightHandleX, setRightHandleX] = useState(clipWidth);
  
  // Calculate dynamic clip block dimensions
  const dynamicClipX = leftHandleX; // Start at left handle position
  const dynamicClipWidth = rightHandleX - leftHandleX; // Width between handles
  
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
          // Prevent negative positions and ensure handles don't cross
          const constrainedX = clamp(newX, 0, rightHandleX - 20);
          setLeftHandleX(constrainedX);
          if (onTrimStart) {
            onTrimStart(constrainedX);
          }
        }}
        onDragEnd={(e) => {
          const newX = e.target.x();
          // Prevent negative positions and ensure handles don't cross
          const constrainedX = clamp(newX, 0, rightHandleX - 20);
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
          // Clamp to clipWidth (video duration) to prevent trimming beyond video length
          const constrainedX = clamp(newX, leftHandleX + 20, clipWidth);
          setRightHandleX(constrainedX);
          if (onTrimEnd) {
            onTrimEnd(constrainedX);
          }
        }}
        onDragEnd={(e) => {
          const newX = e.target.x();
          // Clamp to clipWidth (video duration) to prevent trimming beyond video length
          const constrainedX = clamp(newX, leftHandleX + 20, clipWidth);
          setRightHandleX(constrainedX);
          if (onTrimEnd) {
            onTrimEnd(constrainedX);
          }
        }}
      />
    </Group>
  );
};

export default ClipBlock;

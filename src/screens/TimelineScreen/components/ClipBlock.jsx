import React, { useState, memo, useCallback } from 'react';
import { Group, Rect } from 'react-konva';
import { calculateClipWidth, clamp } from '../../../shared/domains/timeline';

const ClipBlock = memo(({ videoFile, timelineWidth, yOffset = 0, onTrimStart, onTrimEnd }) => {
  if (!videoFile) {
    return null;
  }
  
  const clipWidth = calculateClipWidth(videoFile.duration, videoFile.duration, timelineWidth);
  
  const clipHeight = 60;
  const clipY = yOffset + 10; // Position below timeline ruler
  
  // State for trim handle positions
  const [leftHandleX, setLeftHandleX] = useState(0);
  const [rightHandleX, setRightHandleX] = useState(clipWidth);
  
  // Calculate dynamic clip block dimensions
  const dynamicClipX = leftHandleX; // Start at left handle position
  const dynamicClipWidth = rightHandleX - leftHandleX; // Width between handles
  
  // Memoized drag handlers for better performance
  const handleLeftDragMove = useCallback((e) => {
    const newX = e.target.x();
    const constrainedX = clamp(newX, 0, rightHandleX - 20);
    setLeftHandleX(constrainedX);
    onTrimStart?.(constrainedX);
  }, [rightHandleX, onTrimStart]);
  
  const handleLeftDragEnd = useCallback((e) => {
    const newX = e.target.x();
    const constrainedX = clamp(newX, 0, rightHandleX - 20);
    setLeftHandleX(constrainedX);
    onTrimStart?.(constrainedX);
  }, [rightHandleX, onTrimStart]);
  
  const handleRightDragMove = useCallback((e) => {
    const newX = e.target.x();
    const constrainedX = clamp(newX, leftHandleX + 20, clipWidth);
    setRightHandleX(constrainedX);
    onTrimEnd?.(constrainedX);
  }, [leftHandleX, clipWidth, onTrimEnd]);
  
  const handleRightDragEnd = useCallback((e) => {
    const newX = e.target.x();
    const constrainedX = clamp(newX, leftHandleX + 20, clipWidth);
    setRightHandleX(constrainedX);
    onTrimEnd?.(constrainedX);
  }, [leftHandleX, clipWidth, onTrimEnd]);
  
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
        onDragMove={handleLeftDragMove}
        onDragEnd={handleLeftDragEnd}
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
        onDragMove={handleRightDragMove}
        onDragEnd={handleRightDragEnd}
      />
    </Group>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for optimal performance
  return (
    prevProps.videoFile?.duration === nextProps.videoFile?.duration &&
    prevProps.timelineWidth === nextProps.timelineWidth &&
    prevProps.yOffset === nextProps.yOffset &&
    prevProps.onTrimStart === nextProps.onTrimStart &&
    prevProps.onTrimEnd === nextProps.onTrimEnd
  );
});

ClipBlock.displayName = 'ClipBlock';

export default ClipBlock;

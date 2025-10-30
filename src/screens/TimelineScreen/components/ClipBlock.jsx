import React, { useState, memo, useCallback } from 'react';
import { Group, Rect, Line } from 'react-konva';
import { calculateClipWidth, clamp } from '../../../shared/domains/timeline';
import { darkTheme } from '../../../shared/ui/darkTheme';

/**
 * ClipBlock - Beautiful video clip visualization with design system colors
 * Features:
 * - Rounded corners with design system styling
 * - Elegant trim handles with grip indicators
 * - Smooth hover states and interactions
 * - Performance optimized with React.memo
 */
const ClipBlock = memo(({ videoFile, timelineWidth, yOffset = 0, onTrimStart, onTrimEnd }) => {
  if (!videoFile) {
    return null;
  }
  
  const clipWidth = calculateClipWidth(videoFile.duration, videoFile.duration, timelineWidth);
  
  const clipHeight = 60;
  const clipY = yOffset + 10; // Position below timeline ruler
  
  // State for trim handle positions and hover states
  const [leftHandleX, setLeftHandleX] = useState(0);
  const [rightHandleX, setRightHandleX] = useState(clipWidth);
  const [leftHandleHover, setLeftHandleHover] = useState(false);
  const [rightHandleHover, setRightHandleHover] = useState(false);
  
  // Calculate dynamic clip block dimensions
  const dynamicClipX = leftHandleX;
  const dynamicClipWidth = rightHandleX - leftHandleX;
  
  // Design system colors
  const clipFill = darkTheme.card; // Dark card background
  const clipStroke = `rgba(99, 102, 241, 0.4)`; // Primary with opacity
  const handleFill = (isHover) => isHover ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)';
  const handleStroke = 'rgba(255, 255, 255, 0.2)';
  const gripColor = 'rgba(255, 255, 255, 0.5)';
  
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
    document.body.style.cursor = 'default';
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
    document.body.style.cursor = 'default';
  }, [leftHandleX, clipWidth, onTrimEnd]);
  
  return (
    <Group>
      {/* Main clip rectangle - rounded with design system colors */}
      <Rect
        x={dynamicClipX}
        y={clipY}
        width={dynamicClipWidth}
        height={clipHeight}
        fill={clipFill}
        stroke={clipStroke}
        strokeWidth={1}
        cornerRadius={8}
        shadowColor="rgba(0, 0, 0, 0.5)"
        shadowBlur={8}
        shadowOffset={{ x: 0, y: 2 }}
        shadowOpacity={0.8}
        name="clip-block"
      />
      
      {/* Left trim handle - elegant vertical bar */}
      <Group>
        <Rect
          x={leftHandleX}
          y={clipY}
          width={6}
          height={clipHeight}
          fill={handleFill(leftHandleHover)}
          stroke={handleStroke}
          strokeWidth={1}
          cornerRadius={3}
          draggable={true}
          name="left-trim-handle"
          onDragMove={handleLeftDragMove}
          onDragEnd={handleLeftDragEnd}
          onMouseEnter={() => {
            setLeftHandleHover(true);
            document.body.style.cursor = 'ew-resize';
          }}
          onMouseLeave={() => {
            setLeftHandleHover(false);
            document.body.style.cursor = 'default';
          }}
          onDragStart={() => {
            document.body.style.cursor = 'ew-resize';
          }}
          opacity={leftHandleHover ? 1 : 0.9}
        />
        {/* Grip indicator - 3 small vertical lines */}
        <Line
          points={[leftHandleX + 3, clipY + clipHeight/2 - 8, leftHandleX + 3, clipY + clipHeight/2 - 6]}
          stroke={gripColor}
          strokeWidth={1.5}
          lineCap="round"
          listening={false}
        />
        <Line
          points={[leftHandleX + 3, clipY + clipHeight/2 - 1, leftHandleX + 3, clipY + clipHeight/2 + 1]}
          stroke={gripColor}
          strokeWidth={1.5}
          lineCap="round"
          listening={false}
        />
        <Line
          points={[leftHandleX + 3, clipY + clipHeight/2 + 6, leftHandleX + 3, clipY + clipHeight/2 + 8]}
          stroke={gripColor}
          strokeWidth={1.5}
          lineCap="round"
          listening={false}
        />
      </Group>
      
      {/* Right trim handle - elegant vertical bar */}
      <Group>
        <Rect
          x={rightHandleX - 6}
          y={clipY}
          width={6}
          height={clipHeight}
          fill={handleFill(rightHandleHover)}
          stroke={handleStroke}
          strokeWidth={1}
          cornerRadius={3}
          draggable={true}
          name="right-trim-handle"
          onDragMove={handleRightDragMove}
          onDragEnd={handleRightDragEnd}
          onMouseEnter={() => {
            setRightHandleHover(true);
            document.body.style.cursor = 'ew-resize';
          }}
          onMouseLeave={() => {
            setRightHandleHover(false);
            document.body.style.cursor = 'default';
          }}
          onDragStart={() => {
            document.body.style.cursor = 'ew-resize';
          }}
          opacity={rightHandleHover ? 1 : 0.9}
        />
        {/* Grip indicator - 3 small vertical lines */}
        <Line
          points={[rightHandleX - 3, clipY + clipHeight/2 - 8, rightHandleX - 3, clipY + clipHeight/2 - 6]}
          stroke={gripColor}
          strokeWidth={1.5}
          lineCap="round"
          listening={false}
        />
        <Line
          points={[rightHandleX - 3, clipY + clipHeight/2 - 1, rightHandleX - 3, clipY + clipHeight/2 + 1]}
          stroke={gripColor}
          strokeWidth={1.5}
          lineCap="round"
          listening={false}
        />
        <Line
          points={[rightHandleX - 3, clipY + clipHeight/2 + 6, rightHandleX - 3, clipY + clipHeight/2 + 8]}
          stroke={gripColor}
          strokeWidth={1.5}
          lineCap="round"
          listening={false}
        />
      </Group>
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

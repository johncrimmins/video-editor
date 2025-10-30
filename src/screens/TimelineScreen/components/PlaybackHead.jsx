import React, { memo, useState, useCallback } from 'react';
import { Group, Circle, Line } from 'react-konva';
import { darkTheme } from '../../../shared/ui/darkTheme';

/**
 * PlaybackHead - Beautiful draggable playback indicator
 * Features:
 * - Circular handle at top for dragging
 * - Vertical line showing current position
 * - Hover and drag states for visual feedback
 * - Constrained dragging within timeline bounds
 */
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
    document.body.style.cursor = 'grabbing';
  }, []);

  const handleDragMove = useCallback((e) => {
    const newX = e.target.x();
    onDragMove?.(newX);
  }, [onDragMove]);

  const handleDragEnd = useCallback((e) => {
    setIsDragging(false);
    document.body.style.cursor = 'default';
    const newX = e.target.x();
    onDragEnd?.(newX);
  }, [onDragEnd]);
  
  const handleMouseEnter = useCallback(() => {
    setIsHover(true);
    document.body.style.cursor = 'grab';
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
    document.body.style.cursor = 'default';
  }, []);

  // Color changes based on state
  const handleColor = isDragging || isHover ? darkTheme.primaryLight : darkTheme.primary;
  const scale = isDragging ? 1.2 : (isHover ? 1.1 : 1);
  const lineOpacity = isDragging || isHover ? 1 : 0.9;

  return (
    <Group>
      {/* Vertical line */}
      <Line
        points={[x, 0, x, timelineHeight]}
        stroke={darkTheme.primary}
        strokeWidth={2}
        listening={false}
        opacity={lineOpacity}
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        shadowColor="rgba(0, 0, 0, 0.6)"
        shadowBlur={6}
        shadowOffset={{ x: 0, y: 2 }}
        scaleX={scale}
        scaleY={scale}
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
}, (prevProps, nextProps) => {
  // Custom comparison for optimal performance
  return (
    prevProps.x === nextProps.x &&
    prevProps.timelineHeight === nextProps.timelineHeight &&
    prevProps.timelineWidth === nextProps.timelineWidth &&
    prevProps.onDragMove === nextProps.onDragMove &&
    prevProps.onDragEnd === nextProps.onDragEnd
  );
});

PlaybackHead.displayName = 'PlaybackHead';

export default PlaybackHead;

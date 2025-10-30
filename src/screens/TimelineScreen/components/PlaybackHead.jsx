import React, { memo, useState, useCallback } from 'react';
import { Group, Circle, Line } from 'react-konva';

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

  // Color changes based on state
  const handleColor = isDragging || isHover ? '#818cf8' : '#6366f1'; // primaryLight : primary
  const scale = isDragging ? 1.2 : (isHover ? 1.1 : 1);

  return (
    <Group>
      {/* Vertical line */}
      <Line
        points={[x, 0, x, timelineHeight]}
        stroke="#6366f1"
        strokeWidth={2}
        listening={false}
      />
      
      {/* Top handle - draggable circle */}
      <Circle
        x={x}
        y={8}
        radius={8}
        fill={handleColor}
        stroke="#ffffff"
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
        scaleX={scale}
        scaleY={scale}
      />
      
      {/* Inner circle for depth */}
      <Circle
        x={x}
        y={8}
        radius={4}
        fill="#ffffff"
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


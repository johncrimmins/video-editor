import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Stage, Layer, Line, Text as KonvaText, Rect } from 'react-konva';
import { positionToTime, timeToPosition } from '../../../shared/domains/timeline';
import ClipBlock from './ClipBlock';
import PlaybackHead from './PlaybackHead';
import { Button } from '../../../shared/ui';

/**
 * TimelineCanvas - Main timeline editor with Konva canvas
 * Features:
 * - Playback controls (play/pause, skip, time display)
 * - Timeline ruler with time markers
 * - Draggable clip block with trim handles
 * - Draggable playback head for scrubbing
 * - Zoom controls
 */
const TimelineCanvas = ({ videoFile, trimPoints, updateTrimPoint }) => {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 120 });
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const containerRef = useRef(null);

  // Format time helper
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
  }, []);

  // Playback head position
  const playbackHeadX = useMemo(() => {
    if (!videoFile?.duration) return 0;
    return timeToPosition(currentTime, videoFile.duration, dimensions.width);
  }, [currentTime, videoFile?.duration, dimensions.width]);

  // Playback head drag handlers (memoized)
  const handlePlaybackHeadDragMove = useCallback((newX) => {
    if (!videoFile?.duration) return;
    const constrainedX = Math.max(0, Math.min(dimensions.width, newX));
    const newTime = positionToTime(constrainedX, videoFile.duration, dimensions.width);
    setCurrentTime(newTime);
  }, [dimensions.width, videoFile?.duration]);

  const handlePlaybackHeadDragEnd = useCallback((newX) => {
    if (!videoFile?.duration) return;
    const constrainedX = Math.max(0, Math.min(dimensions.width, newX));
    const newTime = positionToTime(constrainedX, videoFile.duration, dimensions.width);
    setCurrentTime(newTime);
  }, [dimensions.width, videoFile?.duration]);

  // Playback controls
  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleSkipBackward = useCallback(() => {
    setCurrentTime(prev => Math.max(0, prev - 5));
  }, []);

  const handleSkipForward = useCallback(() => {
    setCurrentTime(prev => Math.min(videoFile?.duration || 0, prev + 5));
  }, [videoFile?.duration]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(200, prev + 25));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(50, prev - 25));
  }, []);

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
          fill="#a0a0a0"
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

  // Responsive width
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = Math.min(1200, containerRef.current.offsetWidth - 32);
        setDimensions({ width, height: 120 });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <>
      {/* Playback Controls Bar */}
      <div className="flex items-center justify-between px-md py-sm border-b border-border bg-background">
        <div className="flex items-center gap-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkipBackward}
            aria-label="Skip backward 5 seconds"
          >
            ⏮
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkipForward}
            aria-label="Skip forward 5 seconds"
          >
            ⏭
          </Button>
        </div>
        
        <div className="text-sm text-text-secondary">
          {formatTime(currentTime)} / {formatTime(videoFile?.duration || 0)}
        </div>
        
        <div className="flex items-center gap-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            aria-label="Zoom out"
          >
            −
          </Button>
          <span className="text-sm text-text-secondary min-w-[4rem] text-center">
            {zoomLevel}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            aria-label="Zoom in"
          >
            +
          </Button>
        </div>
      </div>
      
      {/* Timeline Canvas */}
      <div ref={containerRef} className="flex justify-center items-center p-md bg-background-secondary">
        <div className="relative">
          <Stage width={dimensions.width} height={dimensions.height}>
            <Layer>
              {/* Timeline ruler background */}
              <Rect
                x={0}
                y={0}
                width={dimensions.width}
                height={50}
                fill="#1a1a1a"
              />
              
              {/* Time markers */}
              {timeMarkers}
              
              {/* Timeline base line */}
              <Line
                points={[0, 50, dimensions.width, 50]}
                stroke="#2a2a2a"
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


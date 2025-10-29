import React, { useState, useEffect } from 'react';
import { Stage, Layer, Line, Text as KonvaText, Rect } from 'react-konva';
import { getDefaultTimelineDimensions, positionToTime, timeToPosition } from '../../../shared/domains/timeline';
import ClipBlock from './ClipBlock';
import { Button } from '../../../shared/ui';

const TimelineCanvas = ({ videoFile, trimPoints, updateTrimPoint }) => {
  const [dimensions, setDimensions] = useState(getDefaultTimelineDimensions());
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newDimensions = {
        width: Math.max(window.innerWidth - 400, 800),
        height: 120
      };
      setDimensions(newDimensions);
    };
    
    handleResize(); // Initial size
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Format time helper
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 10);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds}`;
  };
  
  // Calculate playback head position
  const playbackHeadX = timeToPosition(currentTime, videoFile?.duration || 0, dimensions.width);
  
  // Generate time markers for the ruler
  const renderTimeMarkers = () => {
    if (!videoFile?.duration) return [];
    
    const markers = [];
    const interval = Math.max(1, Math.floor(videoFile.duration / 20)); // Adaptive interval
    
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
          fill="#888"
          align="center"
          width={40}
        />
      );
      
      // Tick mark
      markers.push(
        <Line
          key={`marker-line-${i}`}
          points={[x, 25, x, 35]}
          stroke="#555"
          strokeWidth={1}
        />
      );
    }
    return markers;
  };
  
  // Playback controls
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleSkipBackward = () => {
    setCurrentTime(Math.max(0, currentTime - 5));
  };
  
  const handleSkipForward = () => {
    setCurrentTime(Math.min(videoFile?.duration || 0, currentTime + 5));
  };
  
  const handleZoomIn = () => {
    setZoomLevel(Math.min(200, zoomLevel + 25));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(Math.max(50, zoomLevel - 25));
  };
  
  return (
    <div className="flex-1 flex flex-col bg-background-secondary overflow-hidden">
      {/* Playback Controls Bar */}
      <div className="flex items-center justify-between px-md py-sm border-b border-border bg-background">
        {/* Left: Playback controls */}
        <div className="flex items-center gap-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkipBackward}
            className="w-8 h-8 p-0"
            title="Skip backward 5s"
          >
            ⏮
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePlayPause}
            className="w-8 h-8 p-0"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkipForward}
            className="w-8 h-8 p-0"
            title="Skip forward 5s"
          >
            ⏭
          </Button>
          
          {/* Time display */}
          <div className="ml-md text-sm text-text font-mono">
            {formatTime(currentTime)} / {formatTime(videoFile?.duration || 0)}
          </div>
          
          {/* Speed control */}
          <div className="ml-md text-sm text-text-secondary">
            1x
          </div>
        </div>
        
        {/* Right: Zoom controls */}
        <div className="flex items-center gap-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="w-8 h-8 p-0"
            title="Zoom out"
          >
            −
          </Button>
          <span className="text-sm text-text-secondary font-mono min-w-[60px] text-center">
            {zoomLevel}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="w-8 h-8 p-0"
            title="Zoom in"
          >
            +
          </Button>
        </div>
      </div>
      
      {/* Timeline Canvas */}
      <div className="flex-1 flex justify-center items-start p-md overflow-auto">
        <div className="relative">
          <Stage width={dimensions.width} height={dimensions.height}>
            <Layer>
              {/* Timeline ruler background */}
              <Rect
                x={0}
                y={0}
                width={dimensions.width}
                height={40}
                fill="#1a1a1a"
              />
              
              {/* Time markers */}
              {renderTimeMarkers()}
              
              {/* Timeline base line */}
              <Line
                points={[0, 40, dimensions.width, 40]}
                stroke="#2a2a2a"
                strokeWidth={2}
              />
              
              {/* Video clip block with trim handles */}
              {videoFile && (
                <ClipBlock
                  videoFile={videoFile}
                  timelineWidth={dimensions.width}
                  yOffset={40}
                  onTrimStart={(x) => {
                    const duration = videoFile.duration;
                    const inTime = positionToTime(x, duration, dimensions.width);
                    updateTrimPoint('inTime', inTime);
                  }}
                  onTrimEnd={(x) => {
                    const duration = videoFile.duration;
                    const outTime = positionToTime(x, duration, dimensions.width);
                    updateTrimPoint('outTime', outTime);
                  }}
                />
              )}
              
              {/* Playback head (red line) */}
              <Line
                points={[playbackHeadX, 0, playbackHeadX, dimensions.height]}
                stroke="#ef4444"
                strokeWidth={2}
              />
              <Rect
                x={playbackHeadX - 6}
                y={0}
                width={12}
                height={12}
                fill="#ef4444"
              />
            </Layer>
          </Stage>
          
          {/* Video filename */}
          <div className="mt-sm text-xs text-text-secondary text-center">
            {videoFile ? videoFile.name : 'No video loaded'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineCanvas;

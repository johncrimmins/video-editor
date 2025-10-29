import React, { useState, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { getDefaultTimelineDimensions, positionToTime } from '../../../shared/domains/timeline';
import ClipBlock from './ClipBlock';

const TimelineCanvas = ({ videoFile, trimPoints, updateTrimPoint }) => {
  const [dimensions, setDimensions] = useState(getDefaultTimelineDimensions());
  
  // Debug logging
  useEffect(() => {
    console.log('🎨 TimelineCanvas: Component mounted');
    console.log('🎨 TimelineCanvas: videoFile:', videoFile);
    console.log('🎨 TimelineCanvas: trimPoints:', trimPoints);
    console.log('🎨 TimelineCanvas: dimensions:', dimensions);
  }, [videoFile, trimPoints, dimensions]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newDimensions = {
        width: Math.min(window.innerWidth - 100, 800),
        height: 100
      };
      setDimensions(newDimensions);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="border border-border rounded-md p-xl bg-card min-h-[200px]">
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {/* Timeline base line */}
          <Line
            points={[0, dimensions.height / 2, dimensions.width, dimensions.height / 2]}
            stroke="#333"
            strokeWidth={2}
          />
          
          {/* Video clip block with trim handles */}
          {videoFile && (
            <ClipBlock
              videoFile={videoFile}
              timelineWidth={dimensions.width}
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
        </Layer>
      </Stage>
      
      <div className="mt-sm text-xs text-text-secondary">
        {videoFile ? `Video: ${videoFile.name}` : 'No video loaded'}
      </div>
    </div>
  );
};

export default TimelineCanvas;

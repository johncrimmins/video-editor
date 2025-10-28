import React, { useState, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { getDefaultTimelineDimensions } from '../utils/timelineUtils';
import { positionToTime } from '../services/timelineService';
import useTimeline from '../hooks/useTimeline';
import ClipBlock from './ClipBlock';

console.log('🎨 TimelineCanvas.jsx: TimelineCanvas component loading...');

const TimelineCanvas = ({ videoFile }) => {
  console.log('🎨 TimelineCanvas.jsx: TimelineCanvas component rendering...');
  console.log('🎨 TimelineCanvas.jsx: videoFile prop:', videoFile);
  
  const [dimensions, setDimensions] = useState(getDefaultTimelineDimensions());
  const { trimPoints, updateTrimPoint } = useTimeline(videoFile);
  console.log('🎨 TimelineCanvas.jsx: Timeline dimensions:', dimensions);
  console.log('🎨 TimelineCanvas.jsx: Trim points:', trimPoints);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      console.log('🎨 TimelineCanvas.jsx: Window resized, updating dimensions');
      const newDimensions = {
        width: Math.min(window.innerWidth - 100, 800),
        height: 100
      };
      setDimensions(newDimensions);
    };
    
    window.addEventListener('resize', handleResize);
    console.log('🎨 TimelineCanvas.jsx: Resize listener added');
    
    return () => {
      window.removeEventListener('resize', handleResize);
      console.log('🎨 TimelineCanvas.jsx: Resize listener removed');
    };
  }, []);
  
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      minHeight: '200px'
    }}>
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
                console.log('🎨 TimelineCanvas.jsx: Trim start at x:', x);
                const inTime = positionToTime(x, videoFile.duration || 0, dimensions.width);
                updateTrimPoint('inTime', inTime);
              }}
              onTrimEnd={(x) => {
                console.log('🎨 TimelineCanvas.jsx: Trim end at x:', x);
                const outTime = positionToTime(x, videoFile.duration || 0, dimensions.width);
                updateTrimPoint('outTime', outTime);
              }}
            />
          )}
        </Layer>
      </Stage>
      
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        {videoFile ? `Video: ${videoFile.name}` : 'No video loaded'}
      </div>
    </div>
  );
};

console.log('🎨 TimelineCanvas.jsx: TimelineCanvas component defined, exporting...');
export default TimelineCanvas;

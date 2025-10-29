import React from 'react';
import useVideoPlayer from '../hooks/useVideoPlayer';
import { Button, Card, VideoElement } from '../../../shared/ui';

console.log('🎥 VideoPlayer.jsx: VideoPlayer component loading...');

const VideoPlayer = ({ videoFile, onBackToImport, onGoToTimeline }) => {
  console.log('🎥 VideoPlayer.jsx: VideoPlayer component rendering...');
  console.log('🎥 VideoPlayer.jsx: videoFile prop:', videoFile);
  console.log('🎥 VideoPlayer.jsx: onBackToImport prop:', onBackToImport);
  console.log('🎥 VideoPlayer.jsx: onGoToTimeline prop:', onGoToTimeline);
  
  const { videoUrl, isVideoReady } = useVideoPlayer(videoFile);
  console.log('🎥 VideoPlayer.jsx: Hook state - videoUrl:', videoUrl, 'isVideoReady:', isVideoReady);

  const handleBackToImport = () => {
    console.log('🎥 VideoPlayer.jsx: Back to import button clicked');
    if (onBackToImport) {
      console.log('🎥 VideoPlayer.jsx: Calling onBackToImport');
      onBackToImport();
    } else {
      console.error('🎥 VideoPlayer.jsx: onBackToImport not provided');
    }
  };

  const handleGoToTimeline = () => {
    console.log('🎥 VideoPlayer.jsx: Go to timeline button clicked');
    if (onGoToTimeline) {
      console.log('🎥 VideoPlayer.jsx: Calling onGoToTimeline');
      onGoToTimeline();
    } else {
      console.error('🎥 VideoPlayer.jsx: onGoToTimeline not provided');
    }
  };

  if (!videoFile) {
    console.log('🎥 VideoPlayer.jsx: No video file provided, showing message');
    return (
      <Card variant="dashed" className="min-w-75">
        <h2 className="mb-xl text-text">
          No Video Selected
        </h2>
        <p className="text-text-secondary">
          Please go back to the import screen to select a video file.
        </p>
      </Card>
    );
  }

  if (!isVideoReady) {
    console.log('🎥 VideoPlayer.jsx: Video not ready, showing loading message');
    return (
      <Card variant="dashed" className="min-w-75">
        <h2 className="mb-xl text-text">
          Loading Video...
        </h2>
        <p className="text-text-secondary">
          Preparing video for playback
        </p>
      </Card>
    );
  }

  console.log('🎥 VideoPlayer.jsx: Rendering video element with URL:', videoUrl);
  return (
    <Card variant="solid" className="min-w-96">
      <h2 className="mb-xl text-text">
        Video Preview
      </h2>
      <VideoElement 
        videoFile={videoFile}
        onLoadStart={() => console.log('🎥 VideoPlayer.jsx: Video load started')}
        onLoadedData={() => console.log('🎥 VideoPlayer.jsx: Video data loaded')}
        onError={(e) => console.error('🎥 VideoPlayer.jsx: Video error:', e)}
      />
      <p className="mt-lg text-text-secondary text-sm">
        <strong>File:</strong> {videoFile.name}
      </p>
      <div className="mt-lg flex gap-md justify-center">
        <Button variant="primary" size="sm" onClick={handleGoToTimeline}>
          Go to Timeline
        </Button>
        <Button variant="secondary" size="sm" onClick={handleBackToImport}>
          Back to Import
        </Button>
      </div>
    </Card>
  );
};

console.log('🎥 VideoPlayer.jsx: VideoPlayer component defined, exporting...');
export default VideoPlayer;

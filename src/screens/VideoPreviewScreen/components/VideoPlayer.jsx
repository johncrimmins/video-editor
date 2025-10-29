import React from 'react';
import useVideoPlayer from '../hooks/useVideoPlayer';
import { Button, Card, VideoElement } from '../../../shared/ui';

const VideoPlayer = ({ videoFile, onBackToImport, onGoToTimeline }) => {
  const { videoUrl, isVideoReady } = useVideoPlayer(videoFile);

  const handleBackToImport = () => {
    if (onBackToImport) {
      onBackToImport();
    } else {
      console.error('🎥 VideoPlayer.jsx: onBackToImport not provided');
    }
  };

  const handleGoToTimeline = () => {
    if (onGoToTimeline) {
      onGoToTimeline();
    } else {
      console.error('🎥 VideoPlayer.jsx: onGoToTimeline not provided');
    }
  };

  if (!videoFile) {
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
  return (
    <Card variant="solid" className="min-w-96">
      <h2 className="mb-xl text-text">
        Video Preview
      </h2>
      <VideoElement 
        videoFile={videoFile}
        onLoadStart={() => {}}
        onLoadedData={() => {}}
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

export default VideoPlayer;

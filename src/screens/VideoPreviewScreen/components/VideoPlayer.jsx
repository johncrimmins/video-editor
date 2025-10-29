import React from 'react';
import useVideoPlayer from '../hooks/useVideoPlayer';
import { Button, Container, VideoElement } from '../../../shared/ui';
import { colors, spacing, fontSizes } from '../../../shared/ui/theme';

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
      <Container variant="dashed" style={{ minWidth: '300px' }}>
        <h2 style={{ marginBottom: spacing.xl, color: colors.dark }}>
          No Video Selected
        </h2>
        <p style={{ color: colors.textSecondary }}>
          Please go back to the import screen to select a video file.
        </p>
      </Container>
    );
  }

  if (!isVideoReady) {
    console.log('🎥 VideoPlayer.jsx: Video not ready, showing loading message');
    return (
      <Container variant="dashed" style={{ minWidth: '300px' }}>
        <h2 style={{ marginBottom: spacing.xl, color: colors.dark }}>
          Loading Video...
        </h2>
        <p style={{ color: colors.textSecondary }}>
          Preparing video for playback
        </p>
      </Container>
    );
  }

  console.log('🎥 VideoPlayer.jsx: Rendering video element with URL:', videoUrl);
  return (
    <Container variant="solid" style={{ minWidth: '400px' }}>
      <h2 style={{ marginBottom: spacing.xl, color: colors.dark }}>
        Video Preview
      </h2>
      <VideoElement 
        videoFile={videoFile}
        onLoadStart={() => console.log('🎥 VideoPlayer.jsx: Video load started')}
        onLoadedData={() => console.log('🎥 VideoPlayer.jsx: Video data loaded')}
        onError={(e) => console.error('🎥 VideoPlayer.jsx: Video error:', e)}
      />
      <p style={{ marginTop: spacing.lg, color: colors.textSecondary, fontSize: fontSizes.sm }}>
        <strong>File:</strong> {videoFile.name}
      </p>
      <div style={{ marginTop: spacing.lg, display: 'flex', gap: spacing.md, justifyContent: 'center' }}>
        <Button variant="primary" size="sm" onClick={handleGoToTimeline}>
          Go to Timeline
        </Button>
        <Button variant="secondary" size="sm" onClick={handleBackToImport}>
          Back to Import
        </Button>
      </div>
    </Container>
  );
};

console.log('🎥 VideoPlayer.jsx: VideoPlayer component defined, exporting...');
export default VideoPlayer;

import React from 'react';
import { Container, VideoElement } from '../../../shared/ui';
import { colors, spacing, fontSizes } from '../../../shared/ui/theme';

const VideoPreview = ({ videoFile, trimPoints }) => {
  if (!videoFile) {
    return null;
  }
  
  return (
    <Container variant="card" style={{ marginTop: spacing.xl, padding: spacing.md }}>
      <h3 style={{ marginBottom: spacing.md, fontSize: fontSizes.md, color: colors.dark }}>
        Video Preview
      </h3>
      <VideoElement 
        videoFile={videoFile}
        trimPoints={trimPoints}
        onError={(e) => {
          // Silently handle video errors
        }}
      />
      {trimPoints && (
        <div style={{ marginTop: spacing.md, fontSize: fontSizes.xs, color: colors.textSecondary }}>
          <div>In: {trimPoints.inTime?.toFixed(2)}s</div>
          <div>Out: {trimPoints.outTime?.toFixed(2)}s</div>
          <div>Duration: {(trimPoints.outTime - trimPoints.inTime)?.toFixed(2)}s</div>
        </div>
      )}
    </Container>
  );
};

export default VideoPreview;


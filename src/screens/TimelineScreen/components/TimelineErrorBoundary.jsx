import React from 'react';
import { EditorScreen } from '../../../shared/layouts';
import { Button, ErrorMessage } from '../../../shared/ui';
import { Card, CardContent } from '../../../shared/ui/shadcn';

/**
 * Error boundary component for timeline editor
 * Handles invalid video duration and other timeline errors
 */
const TimelineErrorBoundary = ({ videoFile, onDeleteClip }) => {
  return (
    <EditorScreen>
      <div className="flex flex-col justify-center items-center h-full p-xl text-center">
        <h2 className="mb-xl text-error text-2xl">
          ⚠️ Invalid Video Duration
        </h2>
        <Card variant="card" className="max-w-lg mb-xl border-error">
          <CardContent className="p-0">
            <ErrorMessage 
              message={`Could not extract video duration (got: ${videoFile?.duration || 'undefined'} seconds). This usually means the video file is corrupted or in an unsupported format.`}
              className="mb-0"
            />
          </CardContent>
        </Card>
        <Button variant="primary" size="lg" onClick={onDeleteClip}>
          ← Back to Import
        </Button>
      </div>
    </EditorScreen>
  );
};

export default TimelineErrorBoundary;

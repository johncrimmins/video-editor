import React from 'react';
import { BasicScreen } from '../../shared/layouts';
import { Card, CardContent } from '../../shared/ui/shadcn';

/**
 * RecordingsScreen - Modern version using BasicScreen template and shadcn/ui components
 * Provides placeholder for future recordings functionality
 */
const RecordingsScreen = () => {
  return (
    <BasicScreen className="justify-center items-center">
      <Card variant="card" className="text-center max-w-lg p-xxxl">
        <CardContent className="p-0">
          <div className="mb-xl">
            <span className="text-9xl inline-block opacity-50">🎥</span>
          </div>
          <h1 className="text-4xl font-semibold text-text mb-lg">
            Quick Recordings
          </h1>
          <p className="text-md text-text-secondary leading-relaxed">
            Record quick demos and screen captures. This feature is coming soon!
          </p>
        </CardContent>
      </Card>
    </BasicScreen>
  );
};

export default RecordingsScreen;

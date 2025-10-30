import React from 'react';
import { Card, CardContent } from '../../../shared/ui/shadcn';
import { Button } from '../../../shared/ui';

/**
 * EmptyEditorState - Empty state UI with drag and drop functionality
 * Reuses existing Card component and UI patterns from ImportInterface
 */
const EmptyEditorState = ({ 
  onImportClick
}) => {
  console.log('🎨 EmptyEditorState: Rendering with props:', { 
    onImportClick: typeof onImportClick
  });
  
  return (
    <div className="flex flex-col justify-center items-center h-full p-xl">
      <Card 
        variant="dashed" 
        className="min-w-[400px] min-h-[300px] transition-all duration-200 border-border hover:border-primary/50"
      >
        <CardContent className="flex flex-col items-center justify-center h-full p-8">
          <div className="text-center">
            {/* Import Icon */}
            <div className="mb-6">
              <svg 
                className="w-16 h-16 mx-auto text-text-secondary"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
            </div>
            
            {/* Title */}
            <h2 className="mb-4 text-xl font-semibold text-text">
              Import Video to Start Editing
            </h2>
            
            {/* Description */}
            <p className="mb-8 text-text-secondary">
              Click the button below to select an MP4 or MOV video file
            </p>
            
            {/* File Picker Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={onImportClick}
              className="transition-all duration-200"
            >
              Select Video File
            </Button>
            
            {/* Supported Formats */}
            <p className="mt-4 text-sm text-text-muted">
              Supported formats: MP4, MOV
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyEditorState;

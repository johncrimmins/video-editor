import React from 'react';
import { Button } from '../../../shared/ui';

/**
 * EmptyEditorState - Shows when no video is loaded in the editor
 * Provides file picker button to import video
 */
const EmptyEditorState = ({ onImportClick }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full p-xl">
      {/* Heading */}
      <h1 className="text-text-secondary text-2xl mb-xxxxl">
        Name your creation
      </h1>
      
      {/* Upload area */}
      <div 
        className="border-2 border-dashed border-border rounded-lg p-xxxxl max-w-2xl w-full flex flex-col items-center justify-center min-h-[300px] cursor-pointer hover:border-primary/50 transition-colors"
        onClick={onImportClick}
      >
        {/* File icon */}
        <div className="mb-xl">
          <svg 
            width="80" 
            height="80" 
            viewBox="0 0 80 80" 
            fill="none" 
            className="text-text-secondary"
          >
            <rect x="20" y="10" width="40" height="50" rx="4" stroke="currentColor" strokeWidth="2" fill="#2a2a2a"/>
            <path d="M35 10 L35 0 L45 10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <rect x="28" y="25" width="24" height="3" fill="currentColor"/>
            <rect x="28" y="32" width="24" height="3" fill="currentColor"/>
            <rect x="28" y="39" width="16" height="3" fill="currentColor"/>
          </svg>
        </div>
        
        {/* Upload button */}
        <Button
          variant="primary"
          size="lg"
          onClick={(e) => {
            e.stopPropagation();
            onImportClick();
          }}
          className="mb-lg"
        >
          Upload file
        </Button>
        
        {/* Instructions */}
        <p className="text-text-secondary text-sm text-center">
          Click to browse
          <br />
          or drag & drop <span className="text-primary">supported files</span> here
        </p>
      </div>
    </div>
  );
};

export default EmptyEditorState;


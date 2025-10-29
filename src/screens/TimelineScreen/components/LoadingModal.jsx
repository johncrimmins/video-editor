import React from 'react';

/**
 * LoadingModal - Minimal loading state shown while video is being processed
 */
const LoadingModal = ({ message = 'Loading video...' }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-xl flex flex-col items-center gap-md min-w-[300px]">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin"></div>
        
        {/* Message */}
        <p className="text-text text-base">{message}</p>
      </div>
    </div>
  );
};

export default LoadingModal;


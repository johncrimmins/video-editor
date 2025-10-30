import React from 'react';
import ProjectFileCard from './ProjectFileCard';

/**
 * ProjectGrid - Displays imported video files in a grid layout
 * Shows files as cards with thumbnails and metadata
 */
const ProjectGrid = ({ 
  files = [], 
  onOpenInEditor, 
  onDeleteFile, 
  className = '' 
}) => {
  if (files.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <span className="text-6xl inline-block opacity-50 mb-4">📁</span>
        <h3 className="text-xl font-semibold text-text mb-2">No projects yet</h3>
        <p className="text-text-secondary">
          Import some video files to get started
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {files.map((file, index) => (
        <ProjectFileCard
          key={file.path || file.name || index}
          file={file}
          onOpenInEditor={onOpenInEditor}
          onDelete={onDeleteFile}
        />
      ))}
    </div>
  );
};

export default ProjectGrid;

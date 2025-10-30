import React, { useState, useCallback } from 'react';
import { BasicScreen } from '../../shared/layouts';
import { DragDropZone, ProjectGrid } from './components';
import { useNavigation } from '../../contexts/NavigationContext';

/**
 * ProjectsScreen - Video project management with drag-and-drop import
 * Allows users to import video files and manage their projects
 */
const ProjectsScreen = () => {
  const [projects, setProjects] = useState([]);
  const { navigate } = useNavigation();

  const handleFilesImported = useCallback((files) => {
    // Add imported files to projects with additional metadata
    const newProjects = files.map(file => ({
      ...file,
      id: `${file.path}_${Date.now()}`, // Unique ID
      created: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }));
    
    setProjects(prevProjects => [...prevProjects, ...newProjects]);
  }, []);

  const handleOpenInEditor = useCallback((file) => {
    // Navigate to editor with the selected file
    navigate('editor', { videoFile: file });
  }, [navigate]);

  const handleDeleteFile = useCallback((fileToDelete) => {
    setProjects(prevProjects => 
      prevProjects.filter(project => project.id !== fileToDelete.id)
    );
  }, []);

  return (
    <BasicScreen className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Projects</h1>
          <p className="text-text-secondary">
            Import and manage your video projects
          </p>
        </div>

        {/* Import Zone */}
        {projects.length === 0 ? (
          <div className="flex justify-center">
            <DragDropZone 
              onFilesImported={handleFilesImported}
              className="max-w-md"
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Import More Button */}
            <div className="flex justify-end">
              <DragDropZone 
                onFilesImported={handleFilesImported}
                className="max-w-sm"
              />
            </div>

            {/* Projects Grid */}
            <ProjectGrid
              files={projects}
              onOpenInEditor={handleOpenInEditor}
              onDeleteFile={handleDeleteFile}
            />
          </div>
        )}
      </div>
    </BasicScreen>
  );
};

export default ProjectsScreen;

import React, { useCallback } from 'react';
import { EditorScreen } from '../../../shared/layouts';
import { DragDropZone } from '../../ProjectsScreen/components';

/**
 * TimelineImportInterface
 * - Empty-state UI for the editor that matches the simplified design
 * - Reuses ProjectsScreen DragDropZone for drag & drop and file picker
 * - Calls onVideoSelected with the first imported file
 */
const TimelineImportInterface = ({ onVideoSelected }) => {
  const handleFilesImported = useCallback((files) => {
    if (Array.isArray(files) && files.length > 0 && onVideoSelected) {
      onVideoSelected(files[0]);
    }
  }, [onVideoSelected]);

  return (
    <EditorScreen>
      <div className="w-full h-full grid grid-rows-[auto_1fr]">
        {/* Header area - keep global header and sidebar from EditorScreen */}
        <div className="px-6 pt-6">
          <h1 className="text-2xl md:text-3xl font-bold text-text">Name your creation</h1>
        </div>

        {/* Centered import area */}
        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <DragDropZone onFilesImported={handleFilesImported} />
          </div>
        </div>
      </div>
    </EditorScreen>
  );
};

export default TimelineImportInterface;



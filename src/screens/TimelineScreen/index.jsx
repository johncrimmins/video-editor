import React, { useState, useEffect } from 'react';
import Sidebar from '../HomeScreen/components/Sidebar';
import Header from '../HomeScreen/components/Header';
import TimelineCanvas from './components/TimelineCanvas';
import VideoPreview from './components/VideoPreview';
import ControlPanel from './components/ControlPanel';
import useTimeline from './hooks/useTimeline';
import useTrim from './hooks/useTrim';
import { useSidebar } from '../../contexts/SidebarContext';
import { Button, Container, ErrorMessage } from '../../shared/ui';
import { colors, spacing, fontSizes } from '../../shared/ui/theme';
import { darkTheme } from '../../shared/ui/darkTheme';

const TimelineScreen = ({ videoFile, onBackToPreview, onDeleteClip }) => {
  const { sidebarWidth } = useSidebar();
  
  useEffect(() => {
    console.log('🎬 TimelineScreen: Component mounted');
    console.log('🎬 TimelineScreen: videoFile:', videoFile);
    console.log('🎬 TimelineScreen: sidebarWidth:', sidebarWidth);
  }, [videoFile, sidebarWidth]);
  // Check for invalid video duration before proceeding
  if (!videoFile?.duration || videoFile.duration <= 0) {
    console.log('🎬 TimelineScreen: Invalid video duration detected');
    return (
      <div style={styles.container}>
        <Sidebar />
        <div style={{
          ...styles.mainArea,
          marginLeft: `${sidebarWidth}px`,
        }}>
          <Header />
          <div style={styles.content}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              padding: spacing.xl,
              textAlign: 'center'
            }}>
              <h2 style={{ marginBottom: spacing.xl, color: colors.danger }}>
                ⚠️ Invalid Video Duration
              </h2>
              <Container variant="card" style={{ maxWidth: '500px', marginBottom: spacing.xl, borderColor: colors.danger }}>
                <ErrorMessage 
                  message={`Could not extract video duration (got: ${videoFile?.duration || 'undefined'} seconds). This usually means the video file is corrupted or in an unsupported format.`}
                  style={{ marginBottom: 0 }}
                />
              </Container>
              <Button variant="primary" size="lg" onClick={onBackToPreview}>
                ← Back to Preview
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  console.log('🎬 TimelineScreen: Valid video, rendering timeline');
  
  const { trimPoints, updateTrimPoint } = useTimeline(videoFile);
  const { applyTrim } = useTrim(videoFile, trimPoints);
  const [currentVideoFile, setCurrentVideoFile] = useState(videoFile);
  
  const handleApplyTrim = async () => {
    try {
      const result = await applyTrim();
      
      // Update video file with trimmed version
      if (result.outputPath) {
        setCurrentVideoFile({
          ...currentVideoFile,
          path: result.outputPath,
          name: result.outputPath.split('/').pop()
        });
      }
    } catch (error) {
      console.error('⏰ TimelineScreen: Trim error:', error);
      throw error;
    }
  };
  
  const handleDeleteClip = () => {
    if (onDeleteClip) {
      onDeleteClip();
    }
  };
  
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={{
        ...styles.mainArea,
        marginLeft: `${sidebarWidth}px`,
      }}>
        <Header />
        <div style={styles.content}>
          <div style={styles.editorContent}>
            <h2 style={{ marginBottom: spacing.xl, color: colors.dark }}>
              Timeline Editor
            </h2>
            
            {currentVideoFile ? (
              <div style={{ width: '100%', maxWidth: '800px' }}>
                <TimelineCanvas videoFile={currentVideoFile} trimPoints={trimPoints} updateTrimPoint={updateTrimPoint} />
                <VideoPreview videoFile={currentVideoFile} trimPoints={trimPoints} />
                <ControlPanel 
                  videoFile={currentVideoFile} 
                  trimPoints={trimPoints}
                  onApplyTrim={handleApplyTrim}
                  onDeleteClip={handleDeleteClip}
                  onBackToPreview={onBackToPreview}
                />
              </div>
            ) : (
              <Container variant="dashed" style={{ minWidth: '300px' }}>
                <h3 style={{ marginBottom: spacing.xl, color: colors.dark }}>
                  No Video Selected
                </h3>
                <p style={{ color: colors.textSecondary }}>
                  Please go back to the preview screen to select a video file.
                </p>
              </Container>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    backgroundColor: darkTheme.background,
    overflow: 'hidden',
  },
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'margin-left 0.3s ease',
  },
  content: {
    marginTop: '60px',
    flex: 1,
    overflow: 'auto',
    display: 'flex',
  },
  editorContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    padding: '20px',
  },
};

export default TimelineScreen;

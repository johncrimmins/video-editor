import React from 'react';
import Sidebar from '../HomeScreen/components/Sidebar';
import Header from '../HomeScreen/components/Header';
import { useSidebar } from '../../contexts/SidebarContext';
import { darkTheme, darkSpacing, darkFontSizes, darkFontWeights } from '../../shared/ui/darkTheme';

const RecordingsScreen = () => {
  const { sidebarWidth } = useSidebar();
  
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={{
        ...styles.mainArea,
        marginLeft: `${sidebarWidth}px`,
      }}>
        <Header />
        <div style={styles.content}>
          <div style={styles.placeholder}>
            <div style={styles.iconContainer}>
              <span style={styles.icon}>🎥</span>
            </div>
            <h1 style={styles.heading}>Quick Recordings</h1>
            <p style={styles.description}>
              Record quick demos and screen captures. This feature is coming soon!
            </p>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    textAlign: 'center',
    maxWidth: '500px',
    padding: darkSpacing.xxxl,
  },
  iconContainer: {
    marginBottom: darkSpacing.xl,
  },
  icon: {
    fontSize: '96px',
    display: 'inline-block',
    opacity: 0.5,
  },
  heading: {
    fontSize: darkFontSizes.xxxl,
    fontWeight: darkFontWeights.semibold,
    color: darkTheme.text,
    marginBottom: darkSpacing.lg,
  },
  description: {
    fontSize: darkFontSizes.md,
    color: darkTheme.textSecondary,
    lineHeight: 1.6,
  },
};

export default RecordingsScreen;


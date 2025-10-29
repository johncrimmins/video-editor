import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';
import { useSidebar } from '../../contexts/SidebarContext';
import { darkTheme } from '../../shared/ui/darkTheme';

const HomeScreen = () => {
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
          <MainContent />
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
    overflow: 'hidden',
    display: 'flex',
  },
};

export default HomeScreen;


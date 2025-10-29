import React from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { useSidebar } from '../../../contexts/SidebarContext';
import { darkTheme, darkSpacing, darkBorderRadius, darkFontSizes } from '../../../shared/ui/darkTheme';

const Header = () => {
  const { navigate } = useNavigation();
  const { sidebarWidth } = useSidebar();
  
  const handleNewProject = () => {
    navigate('editor');
  };
  
  const handleRecord = () => {
    navigate('recordings');
  };
  
  return (
    <div style={{
      ...styles.header,
      left: `${sidebarWidth}px`,
    }}>
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search projects"
          style={styles.searchInput}
        />
      </div>
      
      <div style={styles.actions}>
        <button style={styles.actionButton} onClick={handleNewProject}>
          New Project
        </button>
        <button style={styles.recordButton} onClick={handleRecord}>
          Record
        </button>
        
        <div style={styles.divider} />
        
        <button style={styles.iconButton} title="Help & Documentation">
          <span style={styles.iconText}>?</span>
        </button>
        <button style={styles.iconButton} title="Chat Support">
          <span style={styles.iconText}>💬</span>
        </button>
        <button style={styles.profileButton} title="Profile">
          <span style={styles.profileText}>J</span>
        </button>
      </div>
    </div>
  );
};

const styles = {
  header: {
    height: '60px',
    backgroundColor: darkTheme.backgroundSecondary,
    borderBottom: `1px solid ${darkTheme.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${darkSpacing.xl}`,
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 99,
    transition: 'left 0.3s ease',
  },
  searchContainer: {
    flex: 1,
    maxWidth: '400px',
  },
  searchInput: {
    width: '100%',
    padding: `${darkSpacing.sm} ${darkSpacing.lg}`,
    backgroundColor: darkTheme.background,
    border: `1px solid ${darkTheme.border}`,
    borderRadius: darkBorderRadius.md,
    color: darkTheme.text,
    fontSize: darkFontSizes.sm,
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: darkSpacing.md,
  },
  actionButton: {
    padding: `${darkSpacing.sm} ${darkSpacing.lg}`,
    backgroundColor: darkTheme.backgroundSecondary,
    border: `1px solid ${darkTheme.border}`,
    borderRadius: darkBorderRadius.md,
    color: darkTheme.text,
    fontSize: darkFontSizes.sm,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  recordButton: {
    padding: `${darkSpacing.sm} ${darkSpacing.lg}`,
    backgroundColor: darkTheme.primary,
    border: 'none',
    borderRadius: darkBorderRadius.md,
    color: darkTheme.text,
    fontSize: darkFontSizes.sm,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: darkTheme.border,
    margin: `0 ${darkSpacing.sm}`,
  },
  iconButton: {
    width: '36px',
    height: '36px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: darkBorderRadius.md,
    color: darkTheme.textSecondary,
    fontSize: darkFontSizes.md,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  iconText: {
    fontSize: darkFontSizes.lg,
    fontWeight: 600,
  },
  profileButton: {
    width: '36px',
    height: '36px',
    backgroundColor: darkTheme.primary,
    border: 'none',
    borderRadius: darkBorderRadius.full,
    color: darkTheme.text,
    fontSize: darkFontSizes.sm,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  profileText: {
    fontSize: darkFontSizes.md,
  },
};

export default Header;


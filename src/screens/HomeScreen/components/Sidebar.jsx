import React from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { useSidebar } from '../../../contexts/SidebarContext';
import { darkTheme, darkSpacing, darkBorderRadius, darkFontSizes } from '../../../shared/ui/darkTheme';

const Sidebar = () => {
  const { currentScreen, navigate } = useNavigation();
  const { isCollapsed, toggleSidebar, sidebarWidth } = useSidebar();
  
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'recordings', label: 'Quick Recordings', icon: '🎥' },
    { id: 'editor', label: 'Editor', icon: '✂️' },
  ];
  
  const handleNavClick = (screenId) => {
    navigate(screenId);
  };
  
  return (
    <div style={{
      ...styles.sidebar,
      width: `${sidebarWidth}px`,
    }}>
      {/* Toggle button */}
      <div style={styles.toggleContainer}>
        <button
          onClick={toggleSidebar}
          style={styles.toggleButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = darkTheme.hover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span style={styles.toggleIcon}>
            {isCollapsed ? '→' : '←'}
          </span>
        </button>
      </div>
      
      <div style={styles.navItems}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            style={{
              ...styles.navItem,
              ...(currentScreen === item.id ? styles.navItemActive : {}),
              justifyContent: isCollapsed ? 'center' : 'flex-start',
            }}
            onMouseEnter={(e) => {
              if (currentScreen !== item.id) {
                e.currentTarget.style.backgroundColor = darkTheme.hover;
              }
            }}
            onMouseLeave={(e) => {
              if (currentScreen !== item.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
            title={isCollapsed ? item.label : ''}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            {!isCollapsed && <span style={styles.navLabel}>{item.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    height: '100vh',
    backgroundColor: darkTheme.sidebar,
    borderRight: `1px solid ${darkTheme.border}`,
    display: 'flex',
    flexDirection: 'column',
    padding: `${darkSpacing.md} 0`,
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 100,
    transition: 'width 0.3s ease',
  },
  toggleContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: `${darkSpacing.sm} ${darkSpacing.md}`,
    marginBottom: darkSpacing.md,
  },
  toggleButton: {
    width: '32px',
    height: '32px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: darkBorderRadius.md,
    color: darkTheme.textSecondary,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  toggleIcon: {
    fontSize: darkFontSizes.lg,
    fontWeight: 'bold',
  },
  navItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: darkSpacing.xs,
    padding: `0 ${darkSpacing.md}`,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: darkSpacing.md,
    padding: `${darkSpacing.md} ${darkSpacing.lg}`,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: darkBorderRadius.md,
    color: darkTheme.textSecondary,
    fontSize: darkFontSizes.sm,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    width: '100%',
  },
  navItemActive: {
    backgroundColor: darkTheme.primary,
    color: darkTheme.text,
  },
  navIcon: {
    fontSize: darkFontSizes.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    flexShrink: 0,
  },
  navLabel: {
    flex: 1,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
};

export default Sidebar;


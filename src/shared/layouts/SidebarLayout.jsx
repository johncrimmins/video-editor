import React from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useSidebar } from '../../contexts/SidebarContext';

/**
 * Sidebar layout component extracted from HomeScreen/components/Sidebar.jsx
 * Provides consistent navigation across all screens
 */
const SidebarLayout = () => {
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
    <div 
      className="h-screen bg-sidebar border-r border-border flex flex-col py-md fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out"
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* Toggle button */}
      <div className="flex justify-end px-md mb-md">
        <button
          onClick={toggleSidebar}
          className="w-8 h-8 bg-transparent border-none rounded-md text-text-secondary cursor-pointer flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-hover"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="text-lg font-bold">
            {isCollapsed ? '→' : '←'}
          </span>
        </button>
      </div>
      
      <div className="flex flex-col gap-xs px-md">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`
              flex items-center gap-md px-lg py-md bg-transparent border-none rounded-md text-text-secondary text-sm cursor-pointer transition-all duration-200 ease-in-out text-left w-full
              ${currentScreen === item.id ? 'bg-primary text-text' : 'hover:bg-hover'}
              ${isCollapsed ? 'justify-center' : 'justify-start'}
            `}
            title={isCollapsed ? item.label : ''}
          >
            <span className="text-lg flex items-center justify-center w-6 flex-shrink-0">
              {item.icon}
            </span>
            {!isCollapsed && (
              <span className="flex-1 font-medium whitespace-nowrap overflow-hidden">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SidebarLayout;

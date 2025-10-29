import React from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useSidebar } from '../../contexts/SidebarContext';

/**
 * Screen header component extracted from HomeScreen/components/Header.jsx
 * Provides consistent header across all screens
 */
const ScreenHeader = () => {
  const { navigate } = useNavigation();
  const { sidebarWidth } = useSidebar();
  
  const handleNewProject = () => {
    navigate('editor');
  };
  
  const handleRecord = () => {
    navigate('recordings');
  };
  
  return (
    <div 
      className="h-15 bg-background-secondary border-b border-border flex items-center justify-between px-xl fixed top-0 right-0 z-40 transition-all duration-300 ease-in-out left-[var(--sidebar-width)]"
      style={{ '--sidebar-width': `${sidebarWidth}px` }}
    >
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search projects"
          className="w-full py-sm px-lg bg-background border border-border rounded-md text-text text-sm outline-none transition-colors duration-200 ease-in-out focus:border-primary"
        />
      </div>
      
      <div className="flex items-center gap-md">
        <button 
          className="py-sm px-lg bg-background-secondary border border-border rounded-md text-text text-sm font-medium cursor-pointer transition-all duration-200 ease-in-out hover:bg-hover"
          onClick={handleNewProject}
        >
          New Project
        </button>
        <button 
          className="py-sm px-lg bg-primary border-none rounded-md text-text text-sm font-medium cursor-pointer transition-all duration-200 ease-in-out hover:bg-primary-hover"
          onClick={handleRecord}
        >
          Record
        </button>
        
        <div className="w-px h-6 bg-border mx-sm" />
        
        <button 
          className="w-9 h-9 bg-transparent border-none rounded-md text-text-secondary text-base cursor-pointer flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-hover"
          title="Help & Documentation"
        >
          <span className="text-lg font-semibold">?</span>
        </button>
        <button 
          className="w-9 h-9 bg-transparent border-none rounded-md text-text-secondary text-base cursor-pointer flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-hover"
          title="Chat Support"
        >
          <span className="text-lg font-semibold">💬</span>
        </button>
        <button 
          className="w-9 h-9 bg-primary border-none rounded-full text-text text-sm font-semibold cursor-pointer flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-primary-hover"
          title="Profile"
        >
          <span className="text-base">J</span>
        </button>
      </div>
    </div>
  );
};

export default ScreenHeader;

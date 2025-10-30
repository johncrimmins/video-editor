import React from 'react';
import { useSidebar } from '../../contexts/SidebarContext';
import SidebarLayout from './SidebarLayout';
import ScreenHeader from './ScreenHeader';
import MainContent from './MainContent';

/**
 * Base screen layout component that provides consistent structure
 * for all screens: Sidebar + Header + MainContent
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render in main area
 * @param {Object} props.headerProps - Props to pass to ScreenHeader
 * @param {Object} props.contentProps - Props to pass to MainContent
 */
const ScreenLayout = ({ children, headerProps = {}, contentProps = {} }) => {
  const { sidebarWidth } = useSidebar();
  
  return (
    <div className="flex w-screen h-screen bg-background overflow-hidden">
      <SidebarLayout />
      <div 
        className="flex-1 grid grid-rows-[auto_1fr] overflow-hidden transition-all duration-300 ease-in-out ml-[var(--sidebar-width)]"
        style={{ '--sidebar-width': `${sidebarWidth}px` }}
      >
        <ScreenHeader {...headerProps} />
        <MainContent {...contentProps}>
          {children}
        </MainContent>
      </div>
    </div>
  );
};

export default ScreenLayout;

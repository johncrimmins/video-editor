# Active Context: Clipforge MVP

## Current Status
**Phase**: UI Refactoring Phase 4 Complete - Tailwind CSS Migration & Code Cleanup Complete

## What's Been Built
### ✅ Completed
1. **Basic Electron App** - Electron app structure with Vite build system
2. **Project Dependencies** - All required packages installed (React, Konva, FFmpeg)
3. **Build Configuration** - Electron Forge setup with proper Vite configs
4. **Native Packaging** - App successfully builds and packages for macOS
5. **Memory Bank** - Project documentation and context established
6. **React Setup** - Vite configured for React with JSX support
7. **VideoImportScreen Module** - Complete standalone video import feature
8. **VideoPreviewScreen Module** - Complete standalone video player with custom protocol
9. **Basic Timeline Editor** - Complete standalone timeline module with Konva.js
10. **Modern Dark UI Theme** - Professional dark theme with purple accent colors
11. **Global Navigation System** - Context-based navigation with collapsible sidebar
12. **Home Screen** - Modern landing screen with action cards and navigation
13. **Tailwind CSS v3 Foundation** - Utility-first CSS framework configured for Electron + Vite
14. **shadcn/ui Setup** - Component library foundation with manual configuration
15. **PostCSS Integration** - CSS processing pipeline for Tailwind compilation
16. **Layout Components** - ScreenLayout, SidebarLayout, ScreenHeader, MainContent components
17. **Screen Templates** - BasicScreen, VideoScreen, EditorScreen templates
18. **shadcn/ui Wrappers** - Button, Card, Input components with custom variants
19. **Feature Flag System** - Simple environment variable system for gradual migration
20. **V2 Screen Migration** - All screens migrated to use new layout components
21. **Code Reduction** - ~50-70% reduction in screen boilerplate code
22. **Tailwind Integration** - All V2 screens use Tailwind utility classes

### 🔄 Current State
- **Electron App**: Running with React frontend, video playback, and timeline editor
- **Modern UI**: Professional dark theme with collapsible sidebar and global navigation
- **Home Screen**: Landing screen with navigation and action cards (see `src/screens/HomeScreen/`)
- **Global Navigation**: Context-based navigation system (see `src/contexts/NavigationContext.jsx`)
- **Collapsible Sidebar**: Appears on all screens with smooth transitions (see `src/contexts/SidebarContext.jsx`)
- **Dark Theme**: Centralized dark theme palette (see `src/shared/ui/darkTheme.js`)
- **VideoImportScreen**: Fully functional with file picker, validation, and IPC
- **VideoPreviewScreen**: Fully functional with HTML5 video player and custom app:// protocol
- **TimelineScreen**: Fully functional with Konva.js timeline, trim handles, and video trimming
- **Dependencies**: All core packages installed and ready
- **Build System**: Vite + Electron Forge configured
- **Packaging**: Native macOS app builds successfully
- **Status**: UI refactoring Phase 1 complete - Tailwind CSS & shadcn/ui foundation ready
- **Tailwind CSS v3**: Configured with custom theme mapping existing darkTheme colors
- **shadcn/ui**: Manual setup with components.json and utility functions
- **PostCSS**: CSS processing pipeline configured for Tailwind compilation
- **Backward Compatibility**: All existing functionality preserved, no breaking changes

## Next Steps (Immediate Priority) - Post UI Refactoring
1. **Export Functionality** - Add FFmpeg export to create final video
2. **Package Build** - Create distributable macOS app
3. **Final Testing** - Test complete workflow from import to export
4. **Documentation** - Update any remaining documentation

## Active Decisions - Hybrid Domain-Driven Architecture
- **React Setup**: ✅ Complete - Vite configured for React JSX
- **Architecture**: Hybrid domain-driven - screens remain independent, shared code organized by domain and UI
- **Shared Domains**: Common utilities and services organized by domain (file, video, timeline, export)
- **Shared UI Components**: Reusable UI components (Button, Container, ErrorMessage, StatusMessage, VideoElement)
- **Theme System**: 
  - **Dark Theme**: Modern dark theme palette in `src/shared/ui/darkTheme.js` 🎨
  - **Colors**: Dark backgrounds (#0f0f0f, #1a1a1a) with purple accent (#6366f1)
  - **Legacy Theme**: Original theme in `src/shared/ui/theme.js` (still used by timeline components)
- **Global Navigation**: 
  - **Context-Based**: NavigationContext for screen routing (see `src/contexts/NavigationContext.jsx`)
  - **Collapsible Sidebar**: SidebarContext for global sidebar state (see `src/contexts/SidebarContext.jsx`)
  - **Consistent Layout**: Sidebar + Header on all screens for unified experience
- **Screen Communication**: Navigation-based data passing between screens
- **Code Organization**: Domain-driven with barrel exports for clean imports
- **Zero Breaking Changes**: All existing functionality preserved during refactoring
- **UI Consistency**: All screens use shared UI components for consistent look and feel

## Current Focus
**Phase 4**: Export Functionality
- Implement FFmpeg export to create final trimmed video
- Add export UI with progress indication
- Test complete workflow from import to export
- Package as distributable macOS app

## Technical Considerations
- **Vite React Config**: ✅ Complete - React plugin configured
- **Electron IPC**: ✅ Complete - Secure communication for file operations
- **Video Formats**: ✅ Complete - MP4/MOV validation working
- **Video Playback**: ✅ Complete - Custom app:// protocol for secure video serving
- **Performance**: Ensure smooth video playback and timeline interactions

## Blockers
- None - all core functionality working

## Recent Changes

### 🎨 UI Refactoring Phase 4 (Latest) - COMPLETE
- ✅ **V2 Screen Migration**: All screens migrated to use new layout components and shadcn/ui
- ✅ **Inline Style Removal**: Replaced all inline styles with Tailwind utility classes
- ✅ **V1 Screen Cleanup**: Removed old V1 screens and renamed V2 screens to main screens
- ✅ **Component Migration**: Updated all components to use shadcn/ui versions (Button, Card, etc.)
- ✅ **Theme Consolidation**: Migrated from old theme.js to Tailwind custom properties
- ✅ **Dead Code Removal**: Removed unused components and old HomeScreen components
- ✅ **Bundle Optimization**: Eliminated duplicate code and optimized imports
- ✅ **Zero Breaking Changes**: All functionality preserved with modern Tailwind-based UI

### 🎨 UI Refactoring Phase 1 (Previous)
- ✅ **Tailwind CSS v3 Setup**: Installed stable Tailwind CSS v3 (not v4 alpha) with proper Electron + Vite configuration
- ✅ **PostCSS Configuration**: Configured PostCSS pipeline for CSS processing with autoprefixer
- ✅ **shadcn/ui Manual Setup**: Configured shadcn/ui manually for Electron + Vite setup with components.json
- ✅ **Utility Functions**: Created cn() utility function for class merging with clsx and tailwind-merge
- ✅ **Theme Mapping**: Mapped existing darkTheme colors to Tailwind custom properties
- ✅ **CSS Integration**: Added Tailwind directives to existing CSS without breaking current styles
- ✅ **Dependencies**: Installed core dependencies (@radix-ui/react-slot, clsx, tailwind-merge)
- ✅ **Backward Compatibility**: All existing functionality preserved, no breaking changes
- ✅ **Verification**: Added test Tailwind class to verify setup works correctly

### 🎨 Modern UI Implementation (Previous)
- ✅ Created modern dark theme palette in `src/shared/ui/darkTheme.js`
- ✅ Implemented HomeScreen with navigation and action cards (`src/screens/HomeScreen/`)
- ✅ Built collapsible Sidebar component with smooth transitions (`src/screens/HomeScreen/components/Sidebar.jsx`)
- ✅ Built Header component with action buttons (`src/screens/HomeScreen/components/Header.jsx`)
- ✅ Created NavigationContext for global screen routing (`src/contexts/NavigationContext.jsx`)
- ✅ Created SidebarContext for collapsible sidebar state (`src/contexts/SidebarContext.jsx`)
- ✅ Integrated Sidebar + Header into ALL screens (Home, Projects, Recordings, Timeline, Import, Preview)
- ✅ Fixed scrollbar issues with proper CSS flexbox and overflow handling (`src/index.css`)
- ✅ Eliminated whitespace with universal CSS reset and proper viewport sizing
- ✅ Added debugging logs to main process (terminal) and renderer process (DevTools)
- ✅ Created placeholder screens for Projects and Recordings (`src/screens/ProjectsScreen/`, `src/screens/RecordingsScreen/`)
- ✅ Refactored App.jsx to AppWithNavigation.jsx with context providers

### 🏗️ Architecture & Code Quality (Previous)
- ✅ Completed VideoImportScreen module with full functionality
- ✅ Implemented file picker with native Electron dialog
- ✅ Added file validation for MP4/MOV files
- ✅ Created secure IPC communication between main and renderer
- ✅ Built complete vertical slicing architecture
- ✅ Fixed blank screen issue by renaming renderer.js to renderer.jsx
- ✅ Verified VideoImportScreen works end-to-end with file selection and validation
- ✅ Completed VideoPreviewScreen module with HTML5 video player
- ✅ Implemented custom app:// protocol for secure video serving
- ✅ Added ultra-basic navigation between import and preview screens
- ✅ Fixed video playback security issues with proper URL parsing
- ✅ Implemented complete Basic Timeline Editor with Konva.js
- ✅ Added draggable trim handles with drag constraints
- ✅ Implemented complete navigation flow between all screens
- ✅ Added dynamic clip block resizing based on trim handle positions
- ✅ Fixed missing useVideoPlayer hook in VideoPreviewScreen
- ✅ Fixed FFmpeg duration extraction using system FFprobe (installed via Homebrew)
- ✅ Fixed negative in-point issue in ClipBlock
- ✅ Fixed trim functionality with re-encoding for reliable playback
- ✅ Fixed handle constraints to prevent trimming beyond video duration
- ✅ Fixed packaging renderer load issue by configuring Vite renderer outDir to match Electron Forge structure
- ✅ Removed all debug logging from production code
- ✅ Refactored to domain-driven architecture with shared/domains structure
- ✅ Consolidated duplicated utilities and services into domain modules
- ✅ Updated all screen imports to use shared domain modules
- ✅ Created barrel exports for clean domain imports
- ✅ Removed dead code: 613 lines of duplicate utilities/services from screens
- ✅ Created shared UI component library (Button, Container, ErrorMessage, StatusMessage, VideoElement)
- ✅ Implemented centralized theme system (colors, spacing, fonts) in shared/ui/theme.js
- ✅ Updated all screens to use shared UI components, eliminating duplicate styling
- ✅ Reduced screen code by ~195 lines through UI component consolidation

## UI/Theme Documentation 🎨
**For detailed UI styling and theme information, see**: `memory-bank/uiThemeGuide.md`

This comprehensive guide includes:
- Complete dark theme color palette and usage
- Global layout component patterns (Sidebar, Header)
- Navigation and Sidebar context APIs
- Standard screen layout templates
- Component examples with code snippets
- CSS best practices and global styles
- Visual design principles

**Quick Reference**:
- **Primary Theme**: `src/shared/ui/darkTheme.js` (use for all new UI)
- **Legacy Theme**: `src/shared/ui/theme.js` (timeline components only)
- **Global Sidebar**: `src/screens/HomeScreen/components/Sidebar.jsx`
- **Global Header**: `src/screens/HomeScreen/components/Header.jsx`
- **Navigation Context**: `src/contexts/NavigationContext.jsx`
- **Sidebar Context**: `src/contexts/SidebarContext.jsx`

## Next Session Goals
1. Implement export functionality
2. Add progress indication for export
3. Polish UI and styling
4. Package and test distributable app
5. Complete MVP sprint

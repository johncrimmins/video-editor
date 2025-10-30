# System Patterns: Clipforge MVP

## Architecture Overview
Desktop application built with Electron 39, React 19, and Konva.js 10, following modern best practices for performance and maintainability.

## System Architecture
```
┌─────────────────────────────────────┐
│           Electron Main Process     │
│  ┌─────────────────────────────────┐│
│  │        File System Access       ││
│  │        FFmpeg Processing        ││
│  │        Native APIs              ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
                   │
                   │ Secure IPC
                   ▼
┌─────────────────────────────────────┐
│         Electron Renderer           │
│  ┌─────────────────────────────────┐│
│  │         React 19 Frontend       ││
│  │  ┌─────────────────────────────┐││
│  │  │      Video Player           │││
│  │  │      (HTML5 <video>)        │││
│  │  └─────────────────────────────┘││
│  │  ┌─────────────────────────────┐││
│  │  │      Timeline UI            │││
│  │  │      (React-Konva)          │││
│  │  └─────────────────────────────┘││
│  │  ┌─────────────────────────────┐││
│  │  │      File Import            │││
│  │  │      (File Picker)          │││
│  │  └─────────────────────────────┘││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

## Key Technical Decisions

### Electron 39 Security Best Practices
- **Context Isolation**: Enabled for security
- **Preload Scripts**: Secure bridge between main and renderer processes
- **Custom Protocol**: app:// for secure video file serving
- **IPC Security**: Filtered arguments, no direct API exposure

### React 19 Modern Patterns
- **Component Composition**: Separate components for different concerns
- **Hook Consistency**: Same hooks called every render, no conditional calls
- **Performance**: Optimized re-rendering with proper dependency arrays
- **Modern Hooks**: useEffectEvent for stable callbacks

### Konva.js 10 Performance
- **React-Konva**: Declarative canvas components
- **Automatic Batching**: React-Konva handles draw() optimization
- **Event Handling**: Proper drag constraints and real-time updates
- **Memory Management**: Cleanup on component unmount

## Design Patterns - Unified Component Architecture

### Architecture Overview
The codebase uses a **unified component architecture** that combines:
- **Screens**: Independent, vertically sliced UI modules
- **Shared Domains**: Domain-driven shared services and utilities
- **Unified UI**: Single source of truth for all UI components
- **Global State**: Context-based state management

### Component Structure (Enhanced - December 2024)
```
src/
├── contexts/                      # Global React Contexts
│   ├── NavigationContext.jsx     # Global screen routing
│   ├── SidebarContext.jsx        # Collapsible sidebar state
│   └── TimelineContext.jsx       # Timeline-specific state management (NEW)
├── shared/
│   ├── domains/                  # Domain-driven shared code
│   │   ├── file/                 # File operations domain
│   │   ├── video/                # Video processing domain
│   │   ├── timeline/             # Timeline calculations domain
│   │   └── export/               # Export functionality domain
│   ├── ui/                       # Unified UI components
│   │   ├── darkTheme.js          # Single theme system
│   │   ├── Button.jsx            # Unified button component
│   │   ├── ErrorMessage.jsx      # Error message component
│   │   ├── StatusMessage.jsx     # Status message component
│   │   ├── VideoElement.jsx      # Video element wrapper
│   │   └── shadcn/               # shadcn/ui components
│   │       ├── Card.jsx          # Card component (replaces Container)
│   │       └── Input.jsx         # Input component
│   └── core/
│       └── constants.js          # App-wide constants
├── screens/                      # Screen-specific UI modules
│   ├── HomeScreen/               # Landing screen
│   ├── ProjectsScreen/           # Projects management
│   ├── RecordingsScreen/         # Quick recordings
│   └── TimelineScreen/           # Unified video editing (import + editor)
│       ├── components/           # Timeline-specific components
│       │   ├── TimelineEditorScreen.jsx    # Main editor (refactored)
│       │   ├── TimelineEditorContent.jsx   # Content component (NEW)
│       │   ├── TimelineErrorBoundary.jsx   # Error handling (NEW)
│       │   ├── TimelineCanvas.jsx          # Canvas (optimized)
│       │   ├── ClipBlock.jsx              # Clip block (memoized)
│       │   ├── VideoPreview.jsx           # Video preview (memoized)
│       │   └── ControlPanel.jsx           # Control panel
│       └── hooks/                # Timeline-specific hooks
│           ├── useTimeline.js             # Timeline state
│           ├── useTrim.js                 # Trim operations
│           └── useTimelineEditor.js       # Unified hook (NEW)
└── AppWithNavigation.jsx         # Main app with context providers
```

### Architecture Principles (Enhanced - December 2024)
1. **Unified Component System** - Single source of truth for UI components
2. **Domain-Driven Shared Services** - Common logic organized by domain
3. **Screen Independence** - Screens remain independent UI modules
4. **Global State Management** - Context-based state for app-wide data
5. **Modern React Patterns** - Component composition over conditional logic
6. **Performance Optimization** - Optimized rendering and memory management
7. **Context-Driven State Management** - Eliminate prop drilling with targeted contexts
8. **Component Composition** - Split complex components into focused, composable pieces
9. **Memoization Strategy** - Strategic use of React.memo, useCallback, and useMemo
10. **Error Boundary Pattern** - Dedicated error handling components for better UX

## Component Patterns

### React 19 Best Practices
- **Component Composition**: Use composition over conditional logic
- **Hook Consistency**: Call same hooks every render
- **Performance**: Optimize re-rendering with proper dependencies
- **Modern Patterns**: useEffectEvent for stable callbacks

### Unified UI Components
- **Button**: Single component with Tailwind CSS and shadcn/ui patterns
- **Card**: Modern Card component with variants (replaces Container)
- **Theme**: Unified darkTheme.js with legacy compatibility
- **Error Handling**: Comprehensive error states and user feedback

### Screen Communication
- **Navigation-Based**: Pass data through screen navigation
- **Context State**: Global state for app-wide data
- **Session Storage**: Persist video state across navigation
- **Event System**: Simple event system for loose coupling

## Data Flow Patterns

### Video Import Flow (Simplified)
```
User clicks "✂️ Editor" → TimelineScreen (no video) → ImportInterface
User clicks "Select Video File" → File Dialog (IPC) → File Validation → 
Video Metadata Extraction (FFmpeg) → Automatic Editor Transition
```

### Unified Timeline Flow
```
TimelineScreen (with video) → TimelineEditorScreen → 
VideoPreview + TimelineCanvas + ControlPanel
```

### Timeline Editing Flow - Detailed Architecture

#### Component Hierarchy (Simplified)
```
AppWithNavigation
  └─ NavigationContext & SidebarContext Providers
      └─ TimelineScreen (Unified Component)
          ├─ ImportInterface (when no video)
          └─ TimelineEditorScreen (when video exists)
              ├─ VideoPreview (Top Panel)
              │   └─ VideoElement (HTML5 Video)
              └─ TimelineCanvas (Bottom Panel)
                  ├─ Playback Controls Bar
                  ├─ Konva Stage/Layer
                  │   ├─ Timeline Ruler
                  │   ├─ ClipBlock (with trim handles)
                  │   └─ Playback Head
                  └─ ControlPanel (Fixed Bottom)
```

#### Data Flow: Trim Operation
```
1. User drags trim handle (ClipBlock)
   ↓
2. onDragMove event fires → constrainedX calculated
   ↓
3. ClipBlock updates local state (leftHandleX/rightHandleX)
   ↓
4. onTrimStart/onTrimEnd callback fires with X position
   ↓
5. TimelineCanvas converts X → time (positionToTime)
   ↓
6. updateTrimPoint called in TimelineEditorScreen
   ↓
7. useTimeline hook updates trimPoints state
   ↓
8. trimPoints propagate to VideoPreview & ControlPanel
   ↓
9. User clicks "Apply Trim"
   ↓
10. useTrim.applyTrim() called
    ↓
11. FFmpeg IPC call via trimVideo service
    ↓
12. New video file created → state updated
```

#### Hook Dependencies
- **useTimeline**: Manages trimPoints state (inTime, outTime)
  - Input: videoFile
  - Output: { trimPoints, updateTrimPoint, isDragging, startDragging, stopDragging }
  - Throws error if videoFile.duration is invalid

- **useTrim**: Handles FFmpeg trim operation
  - Input: videoFile, trimPoints
  - Output: { applyTrim }
  - Calls: trimVideo IPC → FFmpeg processing

#### State Flow
```
videoFile (prop from AppWithNavigation)
  ↓
TimelineEditorScreen
  ├─ useTimeline(videoFile) → trimPoints
  ├─ useTrim(videoFile, trimPoints) → applyTrim
  └─ useState(videoFile) → currentVideoFile
      ↓
  Props down to children:
    ├─ VideoPreview: videoFile, trimPoints
    ├─ TimelineCanvas: videoFile, trimPoints, updateTrimPoint
    │   └─ ClipBlock: videoFile, onTrimStart, onTrimEnd
    └─ ControlPanel: videoFile, trimPoints, onApplyTrim
```

#### Layout Architecture (CSS Grid - October 29, 2025)
```
ScreenLayout (grid: auto/1fr)
  ├─ ScreenHeader (auto height - natural, no fixed positioning)
  └─ MainContent (1fr - fills remaining space, min-h-0)
      └─ TimelineEditorScreen (grid: 1fr/auto)
          ├─ VideoPreview Panel (1fr - takes available space)
          └─ Timeline Area (auto - natural height)
              ├─ PlaybackControls (auto)
              ├─ TimelineCanvas (auto - natural 120px + padding)
              └─ ControlPanel (auto)
```

**Key Design Principles:**
- **CSS Grid over Flexbox**: Grid provides clearer layout contracts
- **No Hardcoded Heights**: Uses `auto`, `1fr`, or natural content sizing
- **Natural Flow**: Header in document flow, not fixed positioned
- **Minimal Whitespace**: Components only take space they need
- **Responsive**: Adapts to any screen size automatically

### State Management
- **NavigationContext**: currentScreen, selectedVideoFile, navigate()
- **SidebarContext**: isCollapsed, sidebarWidth
- **sessionStorage**: Video persistence across navigation
- **Component State**: trimPoints, currentTime, isPlaying, zoomLevel

## Performance Patterns

### React 19 Optimization (Enhanced - December 2024)
- **Component Separation**: Avoid conditional hook calls
- **Dependency Arrays**: Proper useEffect dependencies
- **Memoization**: Use React.memo for expensive components with custom comparison functions
- **Event Handlers**: useCallback for all event handlers to prevent unnecessary re-renders
- **Expensive Calculations**: useMemo for time marker generation, playback head position, and other computed values
- **State Updates**: Use functional updates (prev => newValue) to avoid dependency on current state

### Konva.js Performance (Enhanced - December 2024)
- **React-Konva**: Declarative components with automatic batching
- **Event Handling**: Memoized drag handlers with useCallback for optimal performance
- **Memory Management**: Proper cleanup on unmount
- **Canvas Optimization**: Use appropriate canvas settings
- **Component Memoization**: React.memo with custom prop comparison for ClipBlock and VideoPreview
- **Drag Performance**: Optimized drag handlers prevent 20+ unnecessary re-renders during interactions

### Electron Performance
- **IPC Efficiency**: Minimize IPC calls, batch operations
- **File Handling**: Efficient file operations with proper cleanup
- **Memory Management**: Cleanup video resources properly
- **Background Processing**: Use worker threads for heavy operations

## Security Patterns

### Electron Security
- **Context Isolation**: Enabled for security
- **Preload Scripts**: Secure IPC communication bridge
- **Custom Protocol**: app:// for secure file serving
- **File Access**: Sandboxed with proper IPC handlers

### File Handling
- **Validation**: Comprehensive file type and size validation
- **Error Handling**: Proper error states and user feedback
- **Cleanup**: Proper resource cleanup on errors
- **Security**: No direct file system access from renderer

## Build & Packaging Patterns

### Vite + Electron Forge
- **Main Process**: Node.js target with Electron APIs
- **Renderer Process**: Browser target with React
- **Preload Script**: Node.js target with limited APIs
- **Packaging**: ASAR archive for distribution

### Development Workflow
- **Hot Reload**: Vite HMR for development
- **Type Safety**: Proper TypeScript integration
- **Linting**: ESLint for code quality
- **Testing**: Jest for unit testing (future)

## Code Organization Patterns

### File Naming
- **Components**: PascalCase (Button.jsx, VideoElement.jsx)
- **Hooks**: camelCase with use prefix (useFileImport.js)
- **Utilities**: camelCase (fileUtils.js, videoUtils.js)
- **Services**: camelCase with Service suffix (fileService.js)

### Import Patterns
- **Barrel Exports**: Use index.js for clean imports
- **Relative Imports**: Use relative paths for local imports
- **Absolute Imports**: Use absolute paths for shared code
- **Named Exports**: Prefer named exports over default exports

### Error Handling
- **Try-Catch**: Wrap async operations in try-catch
- **Error Boundaries**: Use React error boundaries for UI errors
- **User Feedback**: Show meaningful error messages
- **Logging**: Use console.error for debugging, not console.log

## Enhanced Design Patterns (December 2024)

### Performance Optimization Patterns

#### 1. Strategic Memoization Pattern
```javascript
// Component-level memoization with custom comparison
const ClipBlock = memo(({ videoFile, timelineWidth, onTrimStart, onTrimEnd }) => {
  // Component logic
}, (prevProps, nextProps) => {
  // Custom comparison for optimal performance
  return (
    prevProps.videoFile?.duration === nextProps.videoFile?.duration &&
    prevProps.timelineWidth === nextProps.timelineWidth &&
    prevProps.onTrimStart === nextProps.onTrimEnd
  );
});
```

#### 2. Event Handler Optimization Pattern
```javascript
// Memoized event handlers with useCallback
const handlePlayPause = useCallback(() => {
  setIsPlaying(prev => !prev);
}, []);

const handleSkipForward = useCallback(() => {
  setCurrentTime(prev => Math.min(videoFile?.duration || 0, prev + 5));
}, [videoFile?.duration]);
```

#### 3. Expensive Calculation Memoization Pattern
```javascript
// Memoize expensive calculations with useMemo
const timeMarkers = useMemo(() => {
  if (!videoFile?.duration) return [];
  // Expensive calculation logic
  return markers;
}, [videoFile?.duration, dimensions.width, formatTime]);
```

### Architecture Patterns

#### 1. Context-Driven State Management Pattern
```javascript
// Create targeted contexts to eliminate prop drilling
export function TimelineProvider({ children, videoFile }) {
  const value = useMemo(() => ({
    videoFile: currentVideoFile,
    trimPoints,
    updateTrimPoint,
    handleApplyTrim,
    handleDeleteClip
  }), [currentVideoFile, trimPoints, updateTrimPoint, handleApplyTrim, handleDeleteClip]);
  
  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
}
```

#### 2. Component Composition Pattern
```javascript
// Split complex components into focused, composable pieces
const TimelineEditorScreen = ({ videoFile, onDeleteClip }) => {
  if (!videoFile?.duration || videoFile.duration <= 0) {
    return <TimelineErrorBoundary videoFile={videoFile} onDeleteClip={onDeleteClip} />;
  }
  
  return (
    <TimelineProvider videoFile={videoFile}>
      <TimelineEditorContent onDeleteClip={onDeleteClip} />
    </TimelineProvider>
  );
};
```

#### 3. Error Boundary Pattern
```javascript
// Dedicated error handling components
const TimelineErrorBoundary = ({ videoFile, onDeleteClip }) => {
  return (
    <EditorScreen>
      <div className="flex flex-col justify-center items-center h-full p-xl text-center">
        <h2 className="mb-xl text-error text-2xl">⚠️ Invalid Video Duration</h2>
        <ErrorMessage message={`Could not extract video duration...`} />
        <Button variant="primary" size="lg" onClick={onDeleteClip}>
          ← Back to Import
        </Button>
      </div>
    </EditorScreen>
  );
};
```

#### 4. Unified Hook Pattern
```javascript
// Consolidate related functionality into unified hooks
const useTimelineEditor = (videoFile) => {
  const { trimPoints, updateTrimPoint } = useTimeline(videoFile);
  const { applyTrim } = useTrim(videoFile, trimPoints);
  
  const timelineState = useMemo(() => ({
    videoFile: currentVideoFile,
    trimPoints,
    isTrimming,
    hasVideo: !!currentVideoFile
  }), [currentVideoFile, trimPoints, isTrimming]);
  
  const timelineActions = useMemo(() => ({
    updateTrimPoint,
    handleApplyTrim,
    handleDeleteClip
  }), [updateTrimPoint, handleApplyTrim, handleDeleteClip]);
  
  return { ...timelineState, ...timelineActions };
};
```

### Best Practices for Future Development

#### 1. Performance First Approach
- **Always use useCallback** for event handlers passed as props
- **Always use useMemo** for expensive calculations
- **Always use React.memo** for components that receive props
- **Use functional state updates** to avoid dependency on current state

#### 2. Context Strategy
- **Create targeted contexts** for specific feature areas
- **Memoize context values** to prevent unnecessary re-renders
- **Use custom comparison functions** for React.memo when needed
- **Avoid over-contextualization** - only use context when prop drilling becomes excessive

#### 3. Component Design
- **Split complex components** into focused, single-responsibility pieces
- **Use composition over inheritance** for component relationships
- **Create dedicated error boundary components** for better error handling
- **Implement proper TypeScript interfaces** for all props and state

#### 4. Hook Organization
- **Consolidate related functionality** into unified custom hooks
- **Memoize hook return values** to prevent unnecessary re-renders
- **Use consistent naming conventions** (use prefix, descriptive names)
- **Separate state from actions** in hook return objects

#### 5. Testing Considerations
- **Test memoized components** with different prop combinations
- **Test context providers** with various state scenarios
- **Test error boundaries** with different error conditions
- **Test performance optimizations** with React DevTools Profiler

### Implementation Guidelines

#### When to Use Each Pattern
- **React.memo**: When component receives props that don't change often
- **useCallback**: When passing functions as props to memoized components
- **useMemo**: When performing expensive calculations or creating objects/arrays
- **Context**: When prop drilling exceeds 2-3 component levels
- **Composition**: When single component becomes too complex (>200 lines)
- **Error Boundaries**: When component can fail in ways that break the UI

#### Performance Monitoring
- Use React DevTools Profiler to identify unnecessary re-renders
- Monitor bundle size impact of memoization
- Test with large datasets to validate performance improvements
- Measure actual performance gains with timing measurements

#### Code Review Checklist
- [ ] All event handlers use useCallback
- [ ] Expensive calculations use useMemo
- [ ] Components receiving props use React.memo
- [ ] Context values are memoized
- [ ] Custom comparison functions are optimized
- [ ] Error boundaries handle edge cases
- [ ] Components are focused and single-responsibility
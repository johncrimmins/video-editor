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

### Component Structure
```
src/
├── contexts/                      # Global React Contexts
│   ├── NavigationContext.jsx     # Global screen routing
│   └── SidebarContext.jsx        # Collapsible sidebar state
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
│   ├── VideoImportScreen/        # Video import functionality
│   ├── VideoPreviewScreen/       # Video preview functionality
│   └── TimelineScreen/           # Timeline editing functionality
└── AppWithNavigation.jsx         # Main app with context providers
```

### Architecture Principles
1. **Unified Component System** - Single source of truth for UI components
2. **Domain-Driven Shared Services** - Common logic organized by domain
3. **Screen Independence** - Screens remain independent UI modules
4. **Global State Management** - Context-based state for app-wide data
5. **Modern React Patterns** - Component composition over conditional logic
6. **Performance Optimization** - Optimized rendering and memory management

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

### Video Import Flow
```
User clicks "Import" → File Dialog (IPC) → File Validation → 
Video Metadata Extraction (FFmpeg) → State Storage (sessionStorage) → 
Navigation to Preview Screen
```

### Video Preview Flow
```
Video File Data → Custom app:// Protocol → HTML5 Video Element → 
Playback Controls → Navigation to Timeline Editor
```

### Timeline Editing Flow - Detailed Architecture

#### Component Hierarchy
```
AppWithNavigation
  └─ NavigationContext & SidebarContext Providers
      └─ TimelineScreen (Router Component)
          └─ TimelineEditorScreen (Main Editor)
              ├─ VideoPreview (Top Panel - 50vh)
              │   └─ VideoElement (HTML5 Video)
              └─ TimelineCanvas (Bottom Panel - Remaining Space)
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

### React 19 Optimization
- **Component Separation**: Avoid conditional hook calls
- **Dependency Arrays**: Proper useEffect dependencies
- **Memoization**: Use React.memo for expensive components
- **Event Handlers**: useEffectEvent for stable callbacks

### Konva.js Performance
- **React-Konva**: Declarative components with automatic batching
- **Event Handling**: Efficient drag and drop with constraints
- **Memory Management**: Proper cleanup on unmount
- **Canvas Optimization**: Use appropriate canvas settings

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
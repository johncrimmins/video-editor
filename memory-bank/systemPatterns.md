# System Patterns: Clipforge MVP

## Architecture Overview
Desktop application built with Electron, using React for the frontend and FFmpeg for media processing.

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
                   │ IPC
                   ▼
┌─────────────────────────────────────┐
│         Electron Renderer           │
│  ┌─────────────────────────────────┐│
│  │         React Frontend          ││
│  │  ┌─────────────────────────────┐││
│  │  │      Video Player           │││
│  │  │      (HTML5 <video>)        │││
│  │  └─────────────────────────────┘││
│  │  ┌─────────────────────────────┐││
│  │  │      Timeline UI            │││
│  │  │      (Konva.js)             │││
│  │  └─────────────────────────────┘││
│  │  ┌─────────────────────────────┐││
│  │  │      File Import            │││
│  │  │      (Drag & Drop)          │││
│  │  └─────────────────────────────┘││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

## Key Technical Decisions

### Electron Architecture
- **Main Process**: Handles file system access, FFmpeg processing, native APIs
- **Renderer Process**: React frontend with video player and timeline UI
- **Preload Script**: Secure bridge between main and renderer processes

### Frontend Architecture
- **React Components**: Modular UI components for each feature
- **State Management**: React state for video clips, timeline data, player state
- **Event Handling**: Drag & drop, timeline interactions, player controls

### Media Processing
- **FFmpeg Integration**: Server-side processing for video manipulation
- **File Handling**: Native file system access through Electron APIs
- **Video Formats**: Focus on MP4/MOV for compatibility

## Design Patterns - Hybrid Domain-Driven Architecture

### Architecture Overview
The codebase uses a **hybrid domain-driven architecture** that combines:
- **Screens**: Independent, vertically sliced UI modules
- **Shared Domains**: Domain-driven shared services and utilities
- **Shared UI**: Reusable UI components and theme system
- **Core**: Application-wide constants and core functionality

### Component Structure - Domain-Driven Organization
```
src/
├── contexts/                      # 🆕 Global React Contexts
│   ├── NavigationContext.jsx     # Global screen routing
│   └── SidebarContext.jsx        # Collapsible sidebar state
├── shared/
│   ├── domains/
│   │   ├── file/                  # File domain
│   │   │   ├── fileValidation.js  # File validation logic
│   │   │   ├── fileUtils.js       # File utilities
│   │   │   ├── fileService.js     # IPC file operations
│   │   │   └── index.js           # Barrel export
│   │   ├── video/                 # Video domain
│   │   │   ├── videoUtils.js      # Video utilities
│   │   │   ├── videoService.js    # IPC video operations
│   │   │   └── index.js           # Barrel export
│   │   ├── timeline/              # Timeline domain
│   │   │   ├── timelineUtils.js   # Timeline utilities
│   │   │   ├── timelineService.js # Timeline calculations + trim logic
│   │   │   └── index.js           # Barrel export
│   │   └── export/                # Export domain (future)
│   │       └── index.js           # Placeholder
│   ├── ui/                        # Shared UI components
│   │   ├── theme.js               # 🔧 Legacy theme (timeline components)
│   │   ├── darkTheme.js           # 🎨 Modern dark theme (primary UI)
│   │   ├── Button.jsx             # Reusable button component
│   │   ├── Container.jsx          # Container/card component
│   │   ├── ErrorMessage.jsx       # Error message component
│   │   ├── StatusMessage.jsx      # Status message component
│   │   ├── VideoElement.jsx       # Video element wrapper
│   │   └── index.js               # Barrel export
│   └── core/
│       └── constants.js           # App-wide constants
├── screens/
│   ├── HomeScreen/                # 🆕 Landing screen (home)
│   │   ├── components/
│   │   │   ├── Sidebar.jsx        # 🆕 Global collapsible sidebar
│   │   │   ├── Header.jsx         # 🆕 Global header with actions
│   │   │   └── MainContent.jsx    # Home screen content
│   │   └── index.jsx              # Screen entry point
│   ├── ProjectsScreen/            # 🆕 Projects screen (placeholder)
│   │   └── index.jsx              # Screen entry point
│   ├── RecordingsScreen/          # 🆕 Recordings screen (placeholder)
│   │   └── index.jsx              # Screen entry point
│   ├── VideoImportScreen/         # Video import UI module
│   │   ├── components/            # Screen-specific components (.jsx)
│   │   ├── hooks/                 # Screen-specific hooks (.js)
│   │   └── index.jsx              # Screen entry point
│   ├── VideoPreviewScreen/        # Video preview UI module
│   │   ├── components/            # Screen-specific components (.jsx)
│   │   ├── hooks/                 # Screen-specific hooks (.js)
│   │   └── index.jsx              # Screen entry point
│   ├── TimelineScreen/            # Timeline UI module
│   │   ├── components/            # Screen-specific components (.jsx)
│   │   ├── hooks/                 # Screen-specific hooks (.js)
│   │   └── index.jsx              # Screen entry point
│   └── ExportScreen/              # Export UI module (future)
│       ├── components/            # Screen-specific components (.jsx)
│       ├── hooks/                 # Screen-specific hooks (.js)
│       └── index.jsx              # Screen entry point
├── AppWithNavigation.jsx          # 🆕 Main app with context providers
└── renderer.jsx                   # Entry point
```

### Architecture Principles
1. **Domain-Driven Shared Services** - Common logic organized by domain (file, video, timeline, export)
2. **Shared UI Components** - Reusable UI components (Button, Container, etc.) with centralized theme
3. **Screen Independence** - Screens remain independent UI modules with their own components and hooks
4. **Barrel Exports** - Clean imports via domain/index files (`import { ... } from '../../../shared/domains/file'`)
5. **No Code Duplication** - Shared utilities, services, and UI components prevent duplication
6. **Separation of Concerns** - Utils (pure functions) vs Services (IPC operations) vs UI (components)
7. **Centralized Theme** - Theme constants (colors, spacing, fonts) in shared/ui/theme.js
8. **Scalable Structure** - Easy to add new domains, UI components, and extend functionality

### Domain Organization
Each domain contains:
- **Utils**: Pure utility functions (no side effects)
- **Services**: IPC-based operations (side effects, async operations)
- **Validation**: Input validation logic
- **Barrel Export**: Single import point via `index.js`

### Data Flow - Per Screen
Each screen manages its own complete data flow:
1. **VideoImportScreen**: File Selection → Validation → Storage → Navigation
2. **VideoPreviewScreen**: File Loading → Player Setup → Controls → Navigation
3. **TimelineScreen**: Clip Management → Timeline Rendering → Interactions → Navigation
4. **ExportScreen**: Export Setup → Processing → Progress → Completion

### State Management - Per Screen
Each screen manages its own state independently:
- **VideoImportScreen**: Import state, file validation, error handling
- **VideoPreviewScreen**: Player state, video metadata, playback controls
- **TimelineScreen**: Timeline state, clip positions, trim points
- **ExportScreen**: Export state, progress, output settings

## Component Relationships - Screen-Based
- **VideoImportScreen** → **VideoPreviewScreen**: Pass file data via navigation
- **VideoPreviewScreen** → **TimelineScreen**: Pass video data via navigation
- **TimelineScreen** → **ExportScreen**: Pass timeline data via navigation
- **App.js**: Manages screen routing and navigation between modules

## Refactoring Strategy
Code organization follows domain-driven principles:
1. **Shared Utilities**: Common pure functions go to domain utils
2. **Shared Services**: IPC operations go to domain services
3. **Shared UI Components**: Reusable UI components (buttons, containers, messages) in shared/ui
4. **Theme System**: Centralized styling constants in shared/ui/theme.js
5. **Screen-Specific Logic**: UI-specific logic stays in screens
6. **Domain Cohesion**: Related functionality grouped by domain
7. **Barrel Exports**: Clean imports via domain/index files

## Shared UI Components
The codebase includes reusable UI components to eliminate duplication:
- **Button**: Variants (primary, secondary, success, danger), sizes (sm, md, lg)
- **Container**: Variants (card, dashed, solid) for consistent container styling
- **ErrorMessage**: Standardized error message display
- **StatusMessage**: Success/error status messages
- **VideoElement**: Wrapper for video elements with trim point syncing
- **Theme**: Centralized colors, spacing, fonts, borders, shadows

### 🎨 UI Theme System - WHERE TO FIND STYLING

#### **Modern Dark Theme** (Primary UI)
📍 **Location**: `src/shared/ui/darkTheme.js`

**When to use**: For ALL new UI components and screens (Home, Projects, Recordings, Sidebar, Header)

**Color Palette**:
```javascript
{
  background: '#0f0f0f',           // Main app background
  backgroundSecondary: '#1a1a1a',  // Cards, containers
  sidebar: '#0a0a0a',              // Sidebar background
  card: '#1a1a1a',                 // Card backgrounds
  border: '#2a2a2a',               // Borders
  primary: '#6366f1',              // Purple accent (buttons, active states)
  primaryHover: '#4f46e5',         // Purple hover state
  text: '#ffffff',                 // Primary text
  textSecondary: '#a0a0a0',        // Secondary text
  textMuted: '#666666',            // Muted text
  inputBackground: '#2a2a2a',      // Input backgrounds
  inputBorder: '#4a4a4a',          // Input borders
  hover: '#2a2a2a',                // Hover states
}
```

**Spacing, Typography, Border Radius**: All defined in `darkTheme.js`

#### **Legacy Theme** (Timeline Components)
📍 **Location**: `src/shared/ui/theme.js`

**When to use**: Only for existing timeline/editor components that haven't been migrated yet

**Note**: Eventually, timeline components should migrate to dark theme for consistency

#### **Global Layout Components**
📍 **Sidebar**: `src/screens/HomeScreen/components/Sidebar.jsx`
- Collapsible navigation (240px expanded, 64px collapsed)
- Smooth transitions (0.3s ease)
- Uses `SidebarContext` for state management

📍 **Header**: `src/screens/HomeScreen/components/Header.jsx`
- Fixed height: 60px
- Action buttons (New Project, Record)
- Profile, Docs, Chat buttons (placeholders)

#### **How to Apply Theme to New Components**
```javascript
import { darkTheme, darkSpacing, darkBorderRadius } from '../../shared/ui/darkTheme';

const styles = {
  container: {
    backgroundColor: darkTheme.background,
    padding: darkSpacing.lg,
    borderRadius: darkBorderRadius.md,
  },
  button: {
    backgroundColor: darkTheme.primary,
    color: darkTheme.text,
  }
};
```

## Screen Communication & Global State

### **Navigation System** 🧭
📍 **Location**: `src/contexts/NavigationContext.jsx`

**Purpose**: Global screen routing without prop drilling

**API**:
```javascript
const { currentScreen, selectedVideoFile, setSelectedVideoFile, navigate } = useNavigation();

// Navigate to a screen
navigate('home');        // Home screen
navigate('projects');    // Projects screen
navigate('recordings');  // Recordings screen
navigate('editor');      // Timeline/Editor screen
navigate('import');      // Video import screen
navigate('preview');     // Video preview screen
```

**State Management**:
- `currentScreen`: Current active screen ID
- `selectedVideoFile`: Video file data passed between screens
- `setSelectedVideoFile`: Update video file state
- `navigate(screenId)`: Change active screen

### **Sidebar System** 📐
📍 **Location**: `src/contexts/SidebarContext.jsx`

**Purpose**: Global collapsible sidebar state

**API**:
```javascript
const { isCollapsed, toggleSidebar, sidebarWidth, collapsedWidth, expandedWidth } = useSidebar();

// Toggle sidebar
toggleSidebar();

// Use dynamic width for layout
<div style={{ marginLeft: `${sidebarWidth}px` }}>
  {/* Content adjusts when sidebar collapses */}
</div>
```

**Constants**:
- `expandedWidth`: 240px
- `collapsedWidth`: 64px
- `sidebarWidth`: Dynamic (240px or 64px based on `isCollapsed`)

### **Screen Layout Pattern** 📱
All screens follow this consistent layout:

```javascript
import Sidebar from '../HomeScreen/components/Sidebar';
import Header from '../HomeScreen/components/Header';
import { useSidebar } from '../../contexts/SidebarContext';

const MyScreen = () => {
  const { sidebarWidth } = useSidebar();
  
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={{
        ...styles.mainArea,
        marginLeft: `${sidebarWidth}px`,  // Dynamic margin
      }}>
        <Header />
        <div style={styles.content}>
          {/* Screen content here */}
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
    transition: 'margin-left 0.3s ease',  // Smooth sidebar transition
  },
  content: {
    marginTop: '60px',  // Header height
    flex: 1,
    overflow: 'hidden',
  },
};
```

### **Legacy Screen Communication**
- **Navigation-Based**: Pass data through screen navigation
- **No Direct Dependencies**: Screens don't import from each other
- **Data Passing**: Use props or navigation state for data transfer
- **Event System**: Use simple event system if needed for loose coupling
## Security Considerations
- **Preload Script**: Secure IPC communication
- **File Access**: Sandboxed file operations
- **FFmpeg**: Process isolation for media processing
- **No Node Integration**: Renderer process security

## Performance Patterns
- **Lazy Loading**: Load video metadata on demand
- **Efficient Rendering**: Konva.js for smooth timeline interactions
- **Background Processing**: FFmpeg operations in worker threads
- **Memory Management**: Proper cleanup of video resources

## Build & Packaging Patterns

### Electron Forge + Vite Configuration
- **Electron Forge**: Used for packaging and distribution
- **Vite Plugin**: Integrates Vite bundling with Electron Forge
- **Build Structure**: 
  - Main process: `.vite/build/main.js`
  - Preload: `.vite/build/preload.js`
  - Renderer: `.vite/renderer/{name}/index.html` (must match Electron Forge expectations)

### Vite Renderer Configuration
**Critical**: The renderer `outDir` must be set to `.vite/renderer/{name}/` where `{name}` matches the renderer name in `forge.config.js` (e.g., `main_window`).

**Correct Configuration** (`vite.renderer.config.mjs`):
```javascript
export default defineConfig({
  build: {
    outDir: '.vite/renderer/main_window', // Must match Electron Forge structure
    emptyOutDir: true
  }
});
```

### Packaging Process
1. **Development**: Vite dev server serves renderer at `http://localhost:5173`
2. **Production Build**: 
   - Vite builds renderer to `.vite/renderer/main_window/`
   - Electron Forge packages everything into ASAR
   - Main process loads renderer from ASAR using `loadFile()`

### Renderer Loading Pattern
- **Dev Mode**: `mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)`
- **Prod Mode**: `mainWindow.loadFile(path.join(__dirname, '../renderer/${MAIN_WINDOW_VITE_NAME}/index.html'))`
- Path resolution: From `.vite/build/` (main.js location) to `.vite/renderer/{name}/` (renderer location)

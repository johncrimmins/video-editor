# Technical Context: Clipforge MVP

## Technology Stack

### Desktop Framework
- **Electron 39.0.0** - Cross-platform desktop app framework
- **Electron Forge** - Build and packaging toolchain
- **Vite** - Fast build tool and dev server

### Frontend
- **React 19.2.0** - UI framework
- **React DOM 19.2.0** - React rendering
- **React Context API** - Global state management (Navigation, Sidebar)
- **Konva 10.0.8** - 2D canvas library for timeline
- **React Konva 19.2.0** - React bindings for Konva
- **CSS-in-JS** - Inline styles with theme system

### Media Processing
- **ffmpeg-static 5.2.0** - Static FFmpeg binaries
- **ffprobe-static 3.1.0** - Static FFprobe binaries
- **fluent-ffmpeg** - Node.js wrapper for FFmpeg (to be added)

### Development Tools
- **Vite** - Build tool with HMR
- **Electron Forge** - Packaging and distribution
- **Node.js** - Runtime environment

## Current Project Structure
```
my-video-editor/
├── src/
│   ├── contexts/            # 🆕 Global React Contexts
│   │   ├── NavigationContext.jsx  # Global screen routing
│   │   └── SidebarContext.jsx     # Collapsible sidebar state
│   ├── shared/              # Shared domain-driven modules
│   │   ├── domains/         # Domain-organized shared code
│   │   │   ├── file/        # File operations domain
│   │   │   ├── video/       # Video processing domain
│   │   │   ├── timeline/    # Timeline calculations domain
│   │   │   └── export/      # Export functionality domain
│   │   ├── ui/              # Shared UI components
│   │   │   ├── theme.js     # 🔧 Legacy theme (timeline)
│   │   │   ├── darkTheme.js # 🎨 Modern dark theme (PRIMARY)
│   │   │   ├── Button.jsx   # Button component
│   │   │   ├── Container.jsx # Container component
│   │   │   ├── ErrorMessage.jsx # Error message component
│   │   │   ├── StatusMessage.jsx # Status message component
│   │   │   ├── VideoElement.jsx # Video element wrapper
│   │   │   └── index.js     # Barrel export
│   │   └── core/            # Core application constants
│   ├── screens/             # Screen-specific UI modules
│   │   ├── HomeScreen/      # 🆕 Landing screen
│   │   │   ├── components/
│   │   │   │   ├── Sidebar.jsx    # 🆕 Global sidebar
│   │   │   │   ├── Header.jsx     # 🆕 Global header
│   │   │   │   └── MainContent.jsx
│   │   │   └── index.jsx
│   │   ├── ProjectsScreen/  # 🆕 Placeholder
│   │   ├── RecordingsScreen/ # 🆕 Placeholder
│   │   ├── VideoImportScreen/
│   │   │   ├── components/  # Screen-specific components
│   │   │   ├── hooks/       # Screen-specific hooks
│   │   │   └── index.jsx    # Screen entry point
│   │   ├── VideoPreviewScreen/
│   │   ├── TimelineScreen/
│   │   └── ExportScreen/
│   ├── main.js              # Electron main process
│   ├── preload.js           # Preload script
│   ├── renderer.jsx         # Renderer process entry
│   ├── AppWithNavigation.jsx # 🆕 Main app with context providers
│   └── index.css            # Global styles (CSS reset)
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── forge.config.js          # Electron Forge configuration
└── vite.*.config.mjs        # Vite configuration files
```

## Development Setup

### Prerequisites
- Node.js (latest LTS)
- macOS (for native app development)
- FFmpeg (via ffmpeg-static)

### Available Scripts
- `npm start` - Start development server
- `npm run package` - Package application
- `npm run make` - Create distributable
- `npm run publish` - Publish application

### Build Configuration
- **Main Process**: Vite build with Node.js target
- **Renderer Process**: Vite build with browser target
- **Preload Script**: Vite build with preload target

## Technical Constraints

### Electron Security
- **Node Integration**: Disabled in renderer process
- **Context Isolation**: Enabled for security
- **Preload Script**: Required for secure IPC communication

### File System Access
- **Sandboxed**: Renderer process cannot access files directly
- **IPC Required**: File operations must go through main process
- **Preload Bridge**: Secure communication channel

### Media Processing
- **FFmpeg Static**: Bundled binaries for cross-platform compatibility
- **Process Isolation**: Media processing in main process
- **Memory Management**: Large video files require careful handling

## Dependencies Analysis

### Current Dependencies
- **Electron**: Core desktop framework
- **React**: UI framework
- **Konva**: Timeline canvas library
- **FFmpeg**: Media processing (static binaries)

### Missing Dependencies
- **fluent-ffmpeg**: Node.js FFmpeg wrapper (to be added)
- **file-type**: File type detection (may be needed)
- **electron-store**: Settings persistence (optional)

## Development Environment

### Vite Configuration
- **Main Process**: Node.js target with Electron APIs
- **Renderer Process**: Browser target with React
- **Preload Script**: Node.js target with limited APIs

### Electron Forge
- **Packaging**: ASAR archive for distribution
- **Makers**: ZIP for macOS, DEB/RPM for Linux
- **Fuses**: Security and performance optimizations

## Platform Support
- **Primary**: macOS (current focus)
- **Secondary**: Linux (DEB/RPM packages)
- **Future**: Windows (Squirrel installer)

## Performance Considerations
- **Video Loading**: Efficient file handling for large video files
- **Timeline Rendering**: Konva.js for smooth canvas interactions
- **Memory Usage**: Proper cleanup of video resources
- **FFmpeg Processing**: Background processing for exports
- **UI Transitions**: CSS transitions (0.2s-0.3s) for smooth animations
- **Layout Reflows**: Flexbox with `overflow: hidden` to prevent scrollbars
- **Context Updates**: Optimized context providers to minimize re-renders

## Security Considerations
- **File Access**: Sandboxed file operations
- **IPC Security**: Secure communication between processes
- **Code Signing**: Required for macOS distribution
- **ASAR Integrity**: Validation of packaged resources

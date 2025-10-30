# Technical Context: FrameSmith MVP

## Technology Stack

### Desktop Framework
- **Electron 39.0.0** - Cross-platform desktop app framework
- **Electron Forge** - Build and packaging toolchain
- **Vite** - Fast build tool and dev server

### Frontend
- **React 19.2.0** - UI framework with modern hooks
- **React DOM 19.2.0** - React rendering
- **React Context API** - Global state management (Navigation, Sidebar)
- **Konva 10.0.8** - 2D canvas library for timeline
- **React Konva 19.2.0** - React bindings for Konva
- **Tailwind CSS v3** - Utility-first CSS framework
- **shadcn/ui** - Component library with custom variants

### Media Processing
- **ffmpeg-static 5.2.0** - Static FFmpeg binaries
- **ffprobe-static 3.1.0** - Static FFprobe binaries
- **fluent-ffmpeg** - Node.js wrapper for FFmpeg (to be added)

### Development Tools
- **Vite** - Build tool with HMR
- **Electron Forge** - Packaging and distribution
- **PostCSS** - CSS processing with autoprefixer
- **Node.js** - Runtime environment

## Current Project Structure
```
my-video-editor/
├── src/
│   ├── contexts/            # Global React Contexts
│   │   ├── NavigationContext.jsx  # Global screen routing
│   │   └── SidebarContext.jsx     # Collapsible sidebar state
│   ├── shared/              # Shared domain-driven modules
│   │   ├── domains/         # Domain-organized shared code
│   │   │   ├── file/        # File operations domain
│   │   │   ├── video/       # Video processing domain
│   │   │   ├── timeline/    # Timeline calculations domain
│   │   │   └── export/      # Export functionality domain
│   │   ├── ui/              # Unified UI components
│   │   │   ├── darkTheme.js # Single theme system
│   │   │   ├── Button.jsx   # Unified button component
│   │   │   ├── ErrorMessage.jsx # Error message component
│   │   │   ├── StatusMessage.jsx # Status message component
│   │   │   ├── VideoElement.jsx # Video element wrapper
│   │   │   └── shadcn/      # shadcn/ui components
│   │   │       ├── Card.jsx # Card component (replaces Container)
│   │   │       └── Input.jsx # Input component
│   │   └── core/            # Core application constants
│   ├── screens/             # Screen-specific UI modules
│   │   ├── HomeScreen/      # Landing screen
│   │   ├── VideoImportScreen/ # Video import functionality
│   │   ├── VideoPreviewScreen/ # Video preview functionality
│   │   └── TimelineScreen/  # Timeline editing functionality
│   ├── main.js              # Electron main process
│   ├── preload.js           # Preload script
│   ├── renderer.jsx         # Renderer process entry
│   └── AppWithNavigation.jsx # Main app with context providers
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

### Electron 39 Security
- **Node Integration**: Disabled in renderer process
- **Context Isolation**: Enabled for security
- **Preload Script**: Required for secure IPC communication
- **Custom Protocol**: app:// for secure file serving

### File System Access
- **Sandboxed**: Renderer process cannot access files directly
- **IPC Required**: File operations must go through main process
- **Preload Bridge**: Secure communication channel

### Media Processing
- **FFmpeg Static**: Bundled binaries for cross-platform compatibility
- **Process Isolation**: Media processing in main process
- **Memory Management**: Large video files require careful handling

## React 19 Best Practices

### Component Patterns
- **Component Composition**: Use composition over conditional logic
- **Hook Consistency**: Call same hooks every render
- **Performance**: Optimize re-rendering with proper dependencies
- **Modern Hooks**: useEffectEvent for stable callbacks

### State Management
- **Context API**: Global state for navigation and sidebar
- **Local State**: Component-specific state with useState
- **Session Storage**: Persist video state across navigation
- **Error Handling**: Comprehensive error states and user feedback

### Performance Optimization
- **Memoization**: Use React.memo for expensive components
- **Dependency Arrays**: Proper useEffect dependencies
- **Event Handlers**: useEffectEvent for stable callbacks
- **Cleanup**: Proper cleanup in useEffect

## Konva.js 10 Performance

### React-Konva Integration
- **Declarative Components**: Use React-Konva for canvas elements
- **Automatic Batching**: React-Konva handles draw() optimization
- **Event Handling**: Efficient drag and drop with constraints
- **Memory Management**: Cleanup on component unmount

### Canvas Optimization
- **Layer Management**: Use appropriate layer structure
- **Event Handling**: Efficient event listeners
- **Rendering**: Optimize for smooth interactions
- **Memory**: Proper cleanup of canvas resources

## Tailwind CSS v3 + shadcn/ui

### Styling System
- **Utility-First**: Use Tailwind utility classes
- **Component Variants**: Custom variants for shadcn/ui components
- **Theme System**: Unified darkTheme.js with custom properties
- **Responsive Design**: Mobile-first responsive design

### Component Library
- **Button**: Unified component with Tailwind CSS
- **Card**: Modern Card component with variants
- **Input**: Form input component
- **Error Handling**: ErrorMessage and StatusMessage components

## Dependencies Analysis

### Current Dependencies
- **Electron**: Core desktop framework
- **React**: UI framework with modern hooks
- **Konva**: Timeline canvas library
- **FFmpeg**: Media processing (static binaries)
- **Tailwind CSS**: Utility-first CSS framework

### Missing Dependencies
- **fluent-ffmpeg**: Node.js FFmpeg wrapper (to be added)
- **file-type**: File type detection (may be needed)
- **electron-store**: Settings persistence (optional)

## Development Environment

### Vite Configuration
- **Main Process**: Node.js target with Electron APIs
- **Renderer Process**: Browser target with React
- **Preload Script**: Node.js target with limited APIs
- **HMR**: Hot module replacement for development

### Electron Forge
- **Packaging**: ASAR archive for distribution
- **Makers**: ZIP for macOS, DEB/RPM for Linux
- **Fuses**: Security and performance optimizations

## Platform Support
- **Primary**: macOS (current focus)
- **Secondary**: Linux (DEB/RPM packages)
- **Future**: Windows (Squirrel installer)

## Performance Considerations

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

## Security Considerations

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
# FrameSmith

> A modern desktop video editor built with Electron, React 19, and FFmpeg. Create, edit, and export professional videos with an intuitive timeline interface.

![FrameSmith Screenshot](https://via.placeholder.com/800x500/1a1a1a/6366f1?text=FrameSmith+Desktop+Video+Editor)

## ✨ Features

### 🎬 Core Video Editing
- **Video Import**: Drag & drop or file picker for MP4/MOV files
- **Timeline Editor**: Interactive Konva.js canvas with draggable trim handles
- **Real-time Preview**: HTML5 video player with custom app:// protocol
- **Precise Trimming**: Set in/out points with live preview
- **Native Recording**: Screen capture and webcam recording with FFmpeg

### 🎨 Modern Interface
- **Dark Theme**: Sleek purple-accented dark theme
- **Responsive Layout**: CSS Grid-based responsive design
- **Collapsible Sidebar**: Clean navigation with context-based routing
- **Performance Optimized**: React 19 with strategic memoization

### 🔧 Technical Excellence
- **Native Desktop App**: Built with Electron 39 for cross-platform support
- **Modern React**: React 19 with hooks and performance optimizations
- **FFmpeg Integration**: Professional-grade video processing
- **Secure Architecture**: Context isolation and secure IPC communication

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **macOS** (primary platform, Linux support available)
- **FFmpeg** (bundled via ffmpeg-static)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/framesmith.git
   cd framesmith
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run make
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server with hot reload |
| `npm run package` | Package application for current platform |
| `npm run make` | Create distributable installer |
| `npm run publish` | Publish to distribution channels |

## 🏗️ Architecture

### Tech Stack
- **Desktop Framework**: Electron 39.0.0
- **Frontend**: React 19.2.0 with modern hooks
- **Media Processing**: FFmpeg (ffmpeg-static 5.2.0)
- **Timeline UI**: Konva.js 10.0.8 with React-Konva
- **Styling**: Tailwind CSS v3 + shadcn/ui components
- **Build System**: Vite + Electron Forge

### Project Structure
```
src/
├── contexts/              # Global React Contexts
│   ├── NavigationContext.jsx
│   ├── SidebarContext.jsx
│   └── TimelineContext.jsx
├── shared/                # Shared domain-driven modules
│   ├── domains/           # Domain-organized shared code
│   │   ├── file/          # File operations
│   │   ├── video/         # Video processing
│   │   ├── timeline/      # Timeline calculations
│   │   └── export/        # Export functionality
│   ├── ui/                # Unified UI components
│   └── core/              # App-wide constants
├── screens/               # Screen-specific UI modules
│   ├── HomeScreen/        # Landing screen
│   ├── ProjectsScreen/    # Projects management
│   ├── RecordingsScreen/  # Quick recordings
│   └── TimelineScreen/    # Unified video editing
├── main.js                # Electron main process
├── preload.js             # Preload script
└── renderer.jsx           # Renderer process entry
```

## 🎯 Usage

### Basic Workflow

1. **Launch FrameSmith** - Double-click the app icon
2. **Import Video** - Click "✂️ Editor" → "Select Video File"
3. **Edit Timeline** - Drag trim handles to set in/out points
4. **Preview Changes** - Watch real-time preview of your edits
5. **Export Video** - Save your edited video as MP4

### Recording Features

- **Screen Recording**: Capture your entire screen or specific windows
- **Webcam Recording**: Record from your camera
- **Simultaneous Recording**: Picture-in-picture screen + webcam
- **Audio Capture**: Record microphone audio during screen capture

### Timeline Editing

- **Drag to Trim**: Drag the left/right handles to trim clips
- **Real-time Preview**: See changes instantly in the video player
- **Precise Control**: Use the timeline ruler for frame-accurate editing
- **Zoom Controls**: Zoom in/out for detailed editing

## 🔧 Development

### Setting Up Development Environment

1. **Fork and clone** the repository
2. **Install dependencies**: `npm install`
3. **Start development**: `npm start`
4. **Open DevTools**: Automatically opens in development mode

### Code Organization

- **Screens**: Independent UI modules with their own components and hooks
- **Shared Domains**: Common logic organized by domain (file, video, timeline)
- **Unified UI**: Single source of truth for all UI components
- **Context Management**: Global state for navigation and app-wide data

### Performance Optimizations

- **React 19 Patterns**: Component composition and modern hooks
- **Strategic Memoization**: React.memo, useCallback, useMemo
- **Konva.js Optimization**: Automatic batching with React-Konva
- **Context-Driven State**: Eliminated prop drilling with targeted contexts

## 🐛 Troubleshooting

### Common Issues

**App won't start**
- Ensure Node.js 18+ is installed
- Run `npm install` to install dependencies
- Check that all required system permissions are granted

**Video import fails**
- Verify file format is MP4 or MOV
- Check file size (very large files may cause issues)
- Ensure file isn't corrupted

**Recording doesn't work**
- Grant screen recording permissions in System Preferences
- Check microphone permissions for audio recording
- Ensure no other apps are using the camera

**Timeline performance issues**
- Try reducing video resolution
- Close other applications to free up memory
- Check if video file is corrupted

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/videocraft/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/videocraft/discussions)
- **Documentation**: Check the `/docs` folder for detailed guides

## 🛣️ Roadmap

### Current Status: MVP Complete ✅
- [x] Desktop app launch
- [x] Video import and preview
- [x] Timeline editing with trim handles
- [x] Native screen recording
- [x] Real-time preview
- [ ] Video export functionality (in progress)

### Upcoming Features
- [ ] **Export System**: Complete MP4 export with FFmpeg
- [ ] **Multi-track Editing**: Support for multiple video/audio tracks
- [ ] **Transitions**: Basic fade and cut transitions
- [ ] **Effects**: Color correction and basic filters
- [ ] **Audio Editing**: Audio track management and mixing
- [ ] **Keyboard Shortcuts**: Professional editing shortcuts
- [ ] **Project Management**: Save and load editing projects

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Guidelines
- Follow the existing code style and patterns
- Add tests for new features
- Update documentation for API changes
- Use conventional commits for commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CapCut** for inspiration on streamlined video editing
- **Electron** team for the excellent desktop framework
- **React** team for the modern UI framework
- **FFmpeg** community for the powerful media processing tools
- **Konva.js** team for the performant canvas library

---

**Built with ❤️ using Electron, React 19, and FFmpeg**

*FrameSmith - Where creativity meets simplicity*

# Project Brief: Clipforge MVP

## Project Overview
Desktop video editing MVP called "Clipforge" - a native desktop application for basic video editing tasks. Built with modern React 19, Electron 39, and optimized for performance.

## Core Requirements ✅ COMPLETE
1. **Desktop App Launch** - Electron-based native desktop application
2. **Video Import** - File picker for MP4/MOV files with validation
3. **Timeline View** - Konva.js timeline with draggable trim handles
4. **Video Preview** - HTML5 video player with custom app:// protocol
5. **Basic Trim** - Set in/out points on single clip with real-time preview
6. **Export to MP4** - FFmpeg export functionality (pending implementation)
7. **Native Packaging** - Built and packaged as native macOS app

## Technical Stack
- **Desktop Framework**: Electron 39.0.0
- **Frontend**: React 19.2.0 with modern hooks patterns
- **Media Processing**: FFmpeg (ffmpeg-static 5.2.0)
- **Timeline UI**: Konva.js 10.0.8 with React-Konva
- **Styling**: Tailwind CSS v3 + shadcn/ui components
- **Build System**: Vite + Electron Forge

## Architecture Principles
- **Hybrid Domain-Driven**: Screens + shared domains + unified UI components
- **React 19 Best Practices**: Component composition over conditional logic
- **Electron Security**: Context isolation, secure IPC, preload scripts
- **Performance**: Optimized rendering with React-Konva batching
- **Modern UI**: Unified theme system with Tailwind CSS

## Success Criteria ✅ ACHIEVED
- ✅ Functional desktop app launches on macOS
- ✅ Can import and preview MP4/MOV files
- ✅ Timeline shows imported clips with trim handles
- ✅ Can perform basic trim operations with real-time feedback
- ✅ Packaged app runs without development environment
- 🔄 Export functionality (next phase)

## Current Status
**Phase**: Refactoring Complete - Ready for Export Implementation
- All core functionality working
- Modern UI with unified component system
- Clean, maintainable codebase
- Production-ready build system
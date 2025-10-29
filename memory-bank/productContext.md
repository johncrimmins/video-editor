# Product Context: Clipforge MVP

## Why This Project Exists
Building a desktop video editing MVP to validate the concept of a lightweight, native video editor that handles basic editing tasks without the complexity of professional tools.

## Problems It Solves
1. **Complexity Overhead** - Professional video editors are overkill for simple tasks
2. **Web-based Limitations** - Browser editors have performance and file handling limitations
3. **Cross-platform Need** - Desktop app provides better performance and native file system access
4. **Quick Editing** - Need for rapid, simple video editing without learning curve

## How It Should Work
### User Experience Goals
- **Intuitive Interface** - Drag and drop video files, simple timeline interaction
- **Fast Performance** - Native desktop performance for smooth video playback
- **Simple Workflow** - Import → Preview → Trim → Export
- **No Learning Curve** - Self-explanatory interface for basic editing tasks

### Core User Journey ✅ IMPLEMENTED
1. **Launch App** - Double-click to open native desktop application
2. **Import Video** - File picker for MP4/MOV files with validation
3. **Preview Content** - HTML5 video player with custom protocol
4. **Edit Clips** - Konva.js timeline with draggable trim handles
5. **Export Result** - FFmpeg export to MP4 (pending implementation)

## Target Users
- Content creators needing quick edits
- Social media users wanting simple video trimming
- Anyone needing basic video editing without professional software complexity

## Success Metrics ✅ ACHIEVED
- ✅ App launches successfully on macOS
- ✅ Can import and preview video files
- ✅ Timeline shows imported clips with trim functionality
- ✅ Can perform basic trim operations with real-time feedback
- ✅ Packaged app runs without development environment
- 🔄 Can export edited video to MP4 (next phase)

## MVP Scope
Focus on core functionality only - no advanced features like transitions, effects, or multi-track editing. Keep it simple and functional.

## Current Implementation Status
- **UI/UX**: Modern dark theme with purple accents, collapsible sidebar, global navigation
- **Performance**: Optimized with React 19 patterns, Konva.js batching, Tailwind CSS
- **Architecture**: Clean domain-driven structure with unified component system
- **Code Quality**: Production-ready with comprehensive error handling
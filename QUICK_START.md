# FrameSmith - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **macOS** (primary platform)
- **Git** (for cloning)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/framesmith.git
cd framesmith

# Install dependencies
npm install

# Start the app
npm start
```

### 3. First Video Edit
1. **Launch FrameSmith** - The app opens with a clean interface
2. **Click "✂️ Editor"** - Navigate to the timeline editor
3. **Select Video File** - Choose an MP4 or MOV file
4. **Drag Trim Handles** - Adjust the start/end points on the timeline
5. **Preview Changes** - Watch your edits in real-time
6. **Export Video** - Save your edited video (coming soon!)

## 🎬 Key Features to Try

### Video Import
- **File Picker**: Click "Select Video File" to import
- **Format Support**: Works with MP4 and MOV files
- **Validation**: Automatic file validation and error handling

### Timeline Editing
- **Trim Handles**: Drag the left/right handles to trim clips
- **Real-time Preview**: See changes instantly in the video player
- **Timeline Ruler**: Use time markers for precise editing
- **Zoom Controls**: Zoom in/out for detailed work

### Screen Recording
- **Click "🎥 Record"** - Access the recording screen
- **Select Source** - Choose screen or webcam
- **Start Recording** - Click the record button
- **Stop & Edit** - Recording automatically goes to timeline

## 🎨 Interface Overview

### Main Navigation
- **🏠 Home**: Welcome screen and quick actions
- **📁 Projects**: Project management (coming soon)
- **🎥 Record**: Screen and webcam recording
- **✂️ Editor**: Timeline video editing

### Timeline Editor
- **Video Preview**: Top panel with video player
- **Timeline Canvas**: Bottom panel with Konva.js timeline
- **Trim Handles**: Draggable controls for editing
- **Control Panel**: Playback and editing controls

## 🔧 Development

### Available Scripts
```bash
npm start          # Start development server
npm run package    # Package for current platform
npm run make       # Create distributable
npm run publish    # Publish to channels
```

### Project Structure
```
src/
├── screens/        # Main app screens
├── shared/         # Shared components and logic
├── contexts/       # React contexts
├── main.js         # Electron main process
└── renderer.jsx    # React app entry
```

## 🐛 Troubleshooting

### Common Issues

**App won't start**
- Check Node.js version: `node --version` (should be 18+)
- Reinstall dependencies: `rm -rf node_modules && npm install`

**Video won't import**
- Ensure file is MP4 or MOV format
- Check file isn't corrupted
- Try a smaller video file

**Recording doesn't work**
- Grant screen recording permissions in System Preferences
- Check microphone permissions for audio
- Ensure no other apps are using the camera

**Timeline is slow**
- Try with a smaller video file
- Close other applications
- Check available memory

### Getting Help
- **GitHub Issues**: [Report bugs](https://github.com/yourusername/videocraft/issues)
- **Documentation**: Check the `/docs` folder
- **Discussions**: [Ask questions](https://github.com/yourusername/videocraft/discussions)

## 🎯 Next Steps

### For Users
1. **Try the Timeline**: Import a video and experiment with trimming
2. **Test Recording**: Record your screen or webcam
3. **Explore UI**: Get familiar with the interface
4. **Report Issues**: Help us improve by reporting bugs

### For Developers
1. **Read the Code**: Explore the well-documented codebase
2. **Check Architecture**: Review the domain-driven structure
3. **Contribute**: See CONTRIBUTING.md for guidelines
4. **Build Features**: Add new functionality

## 📚 Additional Resources

- **README.md**: Complete project overview
- **PROJECT_OVERVIEW.md**: Detailed project information
- **FEATURES.md**: Comprehensive feature list
- **CONTRIBUTING.md**: Development guidelines
- **memory-bank/**: Development context and patterns

---

**Welcome to FrameSmith!** 🎬✨

*Start creating amazing videos in minutes, not hours.*

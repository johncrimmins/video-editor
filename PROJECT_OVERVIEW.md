# FrameSmith - Project Overview

## 🎬 What is FrameSmith?

FrameSmith is a modern desktop video editor built with cutting-edge web technologies. It combines the power of native desktop applications with the flexibility of modern web frameworks to create an intuitive, performant video editing experience.

## 🎯 Project Vision

**Mission**: Make professional video editing accessible to everyone through a simple, fast, and powerful desktop application.

**Vision**: Become the go-to desktop video editor for content creators, educators, and professionals who need powerful editing capabilities without the complexity of traditional video editing software.

## 🏗️ Technical Architecture

### Core Technologies
- **Electron 39**: Cross-platform desktop framework
- **React 19**: Modern UI framework with performance optimizations
- **Konva.js 10**: High-performance 2D canvas for timeline editing
- **FFmpeg**: Professional video processing and encoding
- **Tailwind CSS**: Utility-first styling with custom design system

### Architecture Principles
1. **Performance First**: Optimized for smooth video playback and editing
2. **Modern React Patterns**: Component composition, hooks, and memoization
3. **Domain-Driven Design**: Organized codebase with clear separation of concerns
4. **Security**: Context isolation and secure IPC communication
5. **Maintainability**: Clean, documented, and testable code

## ✨ Key Features

### Current Features (MVP Complete)
- ✅ **Desktop Application**: Native macOS app with Electron
- ✅ **Video Import**: MP4/MOV file support with validation
- ✅ **Timeline Editor**: Interactive canvas with draggable trim handles
- ✅ **Real-time Preview**: HTML5 video player with custom protocol
- ✅ **Precise Trimming**: Set in/out points with live feedback
- ✅ **Native Recording**: Screen capture and webcam recording
- ✅ **Modern UI**: Dark theme with purple accents and responsive design

### Planned Features
- 🔄 **Video Export**: Complete MP4 export functionality
- 📋 **Multi-track Editing**: Support for multiple video/audio tracks
- 🎨 **Transitions**: Basic fade and cut transitions
- 🎛️ **Effects**: Color correction and basic filters
- 🎵 **Audio Editing**: Audio track management and mixing
- ⌨️ **Keyboard Shortcuts**: Professional editing shortcuts
- 💾 **Project Management**: Save and load editing projects

## 🎨 User Experience Design

### Design Philosophy
- **Simplicity**: Clean, uncluttered interface focused on essential features
- **Intuition**: Self-explanatory controls that don't require learning
- **Performance**: Smooth, responsive interactions at all times
- **Accessibility**: Inclusive design for users of all abilities

### Visual Design
- **Dark Theme**: Professional dark interface with purple accents (#6366f1)
- **Typography**: Clean, readable fonts with proper hierarchy
- **Icons**: Consistent iconography throughout the interface
- **Layout**: CSS Grid-based responsive design that adapts to any screen size

## 🚀 Development Workflow

### Project Structure
```
framesmith/
├── src/
│   ├── contexts/          # Global React contexts
│   ├── shared/            # Shared domain-driven modules
│   │   ├── domains/       # Business logic by domain
│   │   ├── ui/            # Reusable UI components
│   │   └── core/          # Constants and utilities
│   ├── screens/           # Screen-specific UI modules
│   ├── main.js            # Electron main process
│   ├── preload.js         # Secure IPC bridge
│   └── renderer.jsx       # React app entry point
├── docs/                  # Project documentation
├── memory-bank/           # Development context and patterns
└── .cursor/               # Cursor AI rules and patterns
```

### Development Phases
1. **Phase 1**: Core MVP (✅ Complete)
2. **Phase 2**: Export System (🔄 In Progress)
3. **Phase 3**: Multi-track Editing (📋 Planned)
4. **Phase 4**: Advanced Features (📋 Planned)
5. **Phase 5**: Polish & Optimization (📋 Planned)

## 🎯 Target Users

### Primary Users
- **Content Creators**: YouTubers, streamers, social media creators
- **Educators**: Teachers creating educational content
- **Professionals**: Business users needing quick video edits
- **Hobbyists**: Personal video editing enthusiasts

### User Personas
1. **Sarah the YouTuber**: Needs quick edits for her weekly videos
2. **Mike the Teacher**: Creates educational content for his students
3. **Lisa the Marketer**: Produces promotional videos for her company
4. **Alex the Hobbyist**: Edits family videos and personal projects

## 📊 Success Metrics

### Technical Metrics
- **Performance**: <100ms response time for timeline interactions
- **Memory Usage**: <500MB RAM for typical editing sessions
- **File Support**: 100% compatibility with MP4/MOV files
- **Stability**: <1% crash rate in production

### User Metrics
- **Time to First Edit**: <2 minutes from app launch to first edit
- **Learning Curve**: <5 minutes to complete basic editing task
- **User Satisfaction**: >4.5/5 rating from user feedback
- **Feature Adoption**: >80% of users try timeline editing

## 🔮 Future Roadmap

### Short Term (Next 3 months)
- Complete video export functionality
- Add basic transitions and effects
- Implement keyboard shortcuts
- Performance optimizations

### Medium Term (3-6 months)
- Multi-track editing support
- Audio editing capabilities
- Project save/load system
- Plugin architecture

### Long Term (6+ months)
- Cloud sync and collaboration
- Mobile companion app
- AI-powered editing features
- Professional-grade effects

## 🤝 Community & Support

### Getting Help
- **Documentation**: Comprehensive guides in `/docs`
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Community Q&A and ideas
- **Contributing**: See CONTRIBUTING.md for guidelines

### Contributing
We welcome contributions from developers, designers, and users:
- **Code**: Bug fixes, features, and improvements
- **Design**: UI/UX improvements and accessibility
- **Documentation**: Guides, tutorials, and examples
- **Testing**: Bug reports and quality assurance

## 📈 Project Status

**Current Version**: 1.0.0 (MVP)
**Development Status**: Active development
**Last Updated**: December 2024
**Next Milestone**: Export functionality completion

---

**FrameSmith** - Where creativity meets simplicity in desktop video editing.

*Built with ❤️ using Electron, React 19, and FFmpeg*

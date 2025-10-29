# Project Brief: Clipforge MVP

## Project Overview
Building a desktop video editing MVP called "Clipforge" - a native desktop application for basic video editing tasks. This is a 24-hour sprint to deliver a functional video editor with core features.

## Core Requirements (Must-Have Features)
1. **Desktop App Launch** - Electron-based native desktop application
2. **Video Import** - Drag & drop or file picker for MP4/MOV files
3. **Timeline View** - Simple timeline showing imported video clips
4. **Video Preview** - HTML5 video player for previewing imported clips
5. **Basic Trim** - Set in/out points on a single clip
6. **Export to MP4** - Export functionality (even if just one clip)
7. **Native Packaging** - Built and packaged as native app (not dev mode)

## Technical Stack
- **Desktop Framework**: Electron
- **Frontend**: React
- **Media Processing**: FFmpeg (using fluent-ffmpeg if not deprecated)
- **Timeline UI**: Konva.js
- **Video Player**: HTML5 `<video>` element (later add Pyr for better styling)

## Technical Hints
- **Electron**: Use `desktopCapturer` API to list available screens/windows, then pass source to `getUserMedia()`
- **Webcam**: Use standard `navigator.mediaDevices.getUserMedia()`

## Build Strategy - Vertical Slicing
Build one tool at a time, as modularly as possible:

1. **Basic Electron App** - Runs on macOS
2. **Import and Preview Tool** - File picker/drag & drop for MP4/MOV, get video files loading and displaying
3. **Timeline Tool** - Basic editor/timeline viewer with draggable clips, trim functionality, delete
4. **Export Functionality** - FFmpeg encoding, test with single clip
5. **Package and Test** - Build distributable, test on real hardware

## Success Criteria
- Functional desktop app that launches
- Can import video files (MP4/MOV)
- Shows clips in timeline view
- Can preview videos
- Can trim clips (set in/out points)
- Can export to MP4
- Packaged as native macOS app

## Timeline
24-hour sprint to deliver MVP with all critical features.

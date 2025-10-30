# Contributing to VideoCraft

Thank you for your interest in contributing to VideoCraft! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- Git
- Basic knowledge of React, Electron, and video editing concepts

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/videocraft.git
   cd videocraft
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm start
   ```

## 🎯 How to Contribute

### Reporting Bugs
- Use the [GitHub Issues](https://github.com/yourusername/videocraft/issues) page
- Include detailed steps to reproduce the bug
- Provide system information (OS, Node.js version, etc.)
- Include screenshots or error messages when possible

### Suggesting Features
- Use the [GitHub Discussions](https://github.com/yourusername/videocraft/discussions) page
- Clearly describe the feature and its benefits
- Consider the project's focus on simplicity and performance

### Code Contributions

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards below

3. **Test your changes**:
   ```bash
   npm start  # Test in development
   npm run package  # Test packaged version
   ```

4. **Commit your changes**:
   ```bash
   git commit -m "feat: add new video export feature"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## 📝 Coding Standards

### Code Style
- **JavaScript/JSX**: Use modern ES6+ syntax
- **React**: Use functional components with hooks
- **Naming**: Use descriptive, camelCase names
- **Comments**: Add comments for complex logic
- **Formatting**: Use consistent indentation (2 spaces)

### Architecture Guidelines
- **Screens**: Keep screen components focused and independent
- **Shared Code**: Use the domain-driven structure in `/shared/domains/`
- **UI Components**: Use the unified component system in `/shared/ui/`
- **Performance**: Follow React 19 best practices (memoization, etc.)

### File Organization
```
src/
├── screens/           # Screen-specific components
├── shared/           # Shared code
│   ├── domains/      # Domain-driven services
│   ├── ui/           # UI components
│   └── core/         # Constants and utilities
├── contexts/         # React contexts
└── ipc/             # Electron IPC handlers
```

## 🧪 Testing

### Manual Testing
- Test video import with various formats (MP4, MOV)
- Test timeline editing functionality
- Test screen recording features
- Test on different screen sizes and resolutions

### Performance Testing
- Test with large video files (>1GB)
- Monitor memory usage during editing
- Test timeline performance with long videos

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows the project's coding standards
- [ ] Changes are tested manually
- [ ] No console.log statements in production code
- [ ] Documentation is updated if needed
- [ ] Commit messages follow conventional commit format

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on macOS
- [ ] Tested video import/export
- [ ] Tested timeline editing
- [ ] No performance regressions

## Screenshots (if applicable)
Add screenshots to help explain your changes
```

## 🏷️ Commit Message Format

Use conventional commits format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Examples:
```
feat: add video export functionality
fix: resolve timeline performance issue
docs: update README with new features
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **System Information**:
   - Operating System and version
   - Node.js version
   - VideoCraft version

2. **Steps to Reproduce**:
   - Clear, numbered steps
   - Expected vs actual behavior

3. **Additional Context**:
   - Screenshots or videos
   - Error messages
   - Video file details (format, size, etc.)

## 💡 Feature Requests

When suggesting features:

1. **Problem Description**: What problem does this solve?
2. **Proposed Solution**: How should it work?
3. **Alternatives Considered**: What other approaches were considered?
4. **Additional Context**: Any other relevant information

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Code Review**: Ask for help in pull request comments

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to VideoCraft! 🎬✨

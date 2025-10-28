import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

console.log('🚀 renderer.jsx: Starting renderer process');
console.log('🚀 renderer.jsx: React version:', React.version);
console.log('🚀 renderer.jsx: Document ready state:', document.readyState);

const container = document.getElementById('root');
console.log('🚀 renderer.jsx: Container element:', container);
console.log('🚀 renderer.jsx: Container exists:', !!container);

if (!container) {
  console.error('❌ renderer.jsx: Root container not found!');
  console.error('❌ renderer.jsx: Available elements:', document.body.children);
  throw new Error('Root container not found');
}

console.log('🚀 renderer.jsx: Creating React root...');
const root = createRoot(container);
console.log('🚀 renderer.jsx: React root created:', root);

console.log('🚀 renderer.jsx: Rendering App component...');
root.render(<App />);
console.log('🚀 renderer.jsx: App component rendered');


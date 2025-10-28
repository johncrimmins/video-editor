import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

console.log('🚀 renderer.js: Starting renderer process');
console.log('🚀 renderer.js: React version:', React.version);
console.log('🚀 renderer.js: Document ready state:', document.readyState);

const container = document.getElementById('root');
console.log('🚀 renderer.js: Container element:', container);
console.log('🚀 renderer.js: Container exists:', !!container);

if (!container) {
  console.error('❌ renderer.js: Root container not found!');
  console.error('❌ renderer.js: Available elements:', document.body.children);
  throw new Error('Root container not found');
}

console.log('🚀 renderer.js: Creating React root...');
const root = createRoot(container);
console.log('🚀 renderer.js: React root created:', root);

console.log('🚀 renderer.js: Rendering App component...');
root.render(<App />);
console.log('🚀 renderer.js: App component rendered');

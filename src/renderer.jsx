import React from 'react';
import { createRoot } from 'react-dom/client';
import AppWithNavigation from './AppWithNavigation.jsx';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(<AppWithNavigation />);


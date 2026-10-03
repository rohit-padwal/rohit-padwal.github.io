import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/manrope/latin-800.css';
import '@fontsource/source-sans-3/latin-400.css';
import '@fontsource/source-sans-3/latin-600.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import './global.css';
import { App } from './App';
const root = document.getElementById('root')!;
const app = <StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>;
// A 404 redirect arrives at root HTML containing the home snapshot. Render the
// restored route afresh in that case; hydrate only when the snapshot matches.
const snapshot = root.dataset.route;
const current = window.location.pathname.replace(/\/$/, '') || '/';
if (root.hasChildNodes() && snapshot === current) hydrateRoot(root, app);
else createRoot(root).render(app);

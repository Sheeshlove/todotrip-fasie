
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Preload images for improved perceived performance
import { preloadImages } from './data/placeholderImages';

// Function to initialize the app
const initApp = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");
  const root = createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Preload images after initial render
  setTimeout(() => {
    preloadImages();
  }, 1000);
};

// Use requestIdleCallback for better performance if available
if ('requestIdleCallback' in window) {
  // @ts-ignore
  window.requestIdleCallback(() => {
    initApp();
  });
} else {
  // Fallback for browsers that don't support requestIdleCallback
  setTimeout(initApp, 1);
}

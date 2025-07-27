
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Mobile-specific initialization
const initMobileApp = () => {
  // Add viewport meta tag if it doesn't exist
  if (!document.querySelector('meta[name="viewport"]')) {
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(viewport);
  }

  // Disable pull-to-refresh on mobile
  document.body.style.overscrollBehavior = 'none';
  
  // Prevent zoom on form inputs on iOS
  const addMaximumScaleToMetaViewport = () => {
    const el = document.querySelector('meta[name=viewport]');
    if (el !== null) {
      let content = el.getAttribute('content');
      let re = /maximum\-scale=[0-9\.]+/g;
      if (re.test(content)) {
        content = content.replace(re, 'maximum-scale=1.0');
      } else {
        content = [content, 'maximum-scale=1.0'].join(', ')
      }
      el.setAttribute('content', content);
    }
  };

  addMaximumScaleToMetaViewport();
};

// Initialize mobile-specific features
initMobileApp();

// Optional service worker registration (commented out for now)
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .catch((error) => {
//         console.log('SW registration failed: ', error);
//       });
//   });
// }

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  console.error('Root element not found');
}

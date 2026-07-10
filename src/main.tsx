import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { applyMascotAppIcon } from './utils/setAppIcon';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Swap the favicon/app icon for a crisp render of the mascot's face once the
// 3D pipeline can produce one (see utils/setAppIcon.ts).
applyMascotAppIcon();

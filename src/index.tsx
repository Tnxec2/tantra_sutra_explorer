import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { registerServiceWorker } from './serviceWorkerRegistration';
import CacheBuster from './CacheBuster';


export const VERSION = "1.0.2"; // Update this version whenever you want to force a cache refresh
// also update the version in public/meta.json


const LoadingComponent = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <div>Checking for updates...</div>
  </div>
);



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <CacheBuster currentAppVersion={VERSION} loadingComponent={<LoadingComponent />} >
      <App />
    </CacheBuster>
  </React.StrictMode>
);

registerServiceWorker();

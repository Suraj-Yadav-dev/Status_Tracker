import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ProjectProvider } from './context/ProjectContext';
import './index.css';

// Mock user email for demonstration (Change this to test validation)
const MOCK_USER_EMAIL = "hr.manager@plant.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProjectProvider userEmail={MOCK_USER_EMAIL}>
      <App />
    </ProjectProvider>
  </React.StrictMode>
);
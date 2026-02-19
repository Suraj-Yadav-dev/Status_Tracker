 import React from 'react';
import RoadContainer from './components/road/RoadContainer';
import useProject from './hooks/useProjectLogic';
import './App.css';

function App() {
  const { userEmail } = useProject();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Plant Project Tracker</h1>
        <div className="user-badge">
          <span>Logged in as: <strong>{userEmail}</strong></span>
        </div>
      </header>

      <main className="road-viewport">
        <RoadContainer userEmail={userEmail} />
      </main>
      
      <footer className="app-footer">
     
        <p>© 2026 Plant Project Management System</p>
      </footer>
    </div>
  );
}

export default App;
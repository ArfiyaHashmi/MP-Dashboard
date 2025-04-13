import { StrictMode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AuthState from './context/authState';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <AuthState>
      <Router> {/* Add Router here */}
        <App />
      </Router>
    </AuthState>
  </StrictMode>
);
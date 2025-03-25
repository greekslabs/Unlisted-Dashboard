import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './Components/Auth';
import { BrowserRouter } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter> {/* Instead of StrictMode */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
);

reportWebVitals();

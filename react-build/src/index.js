import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
const routing = (
  <Router>
    <div>
      {window.location.pathname.includes('index.html') && <Redirect to="/" />}
    </div>
    <App />
  </Router>
)
ReactDOM.render(routing, document.getElementById('root'));


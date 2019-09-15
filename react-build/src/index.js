import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
const routing = (
  <Router>
    <App />
  </Router>
)
ReactDOM.render(routing, document.getElementById('root'));


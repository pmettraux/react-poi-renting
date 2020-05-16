import React from 'react';
import logo from './logo.svg';
import './App.css';

import HeaderComponent from './components/header/header';

function App() {
  return (
    
    <div className="App">
      <HeaderComponent/>
      <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit
          {' '}
          <code>src/App.js</code>
          {' '}
          and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
    </div>

  );
}

export default App;

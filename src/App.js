import React from 'react';
import logo from './logo.svg';
import './App.css';

import MainHeader from './components/main-header/main-header';
import SidePanelComponent from './components/side-panel/side-panel';

function App() {
  return (
    <div className="App">
      <MainHeader />
      <header className="App-header">
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
      </header>
      <SidePanelComponent />
    </div>
  );
}

export default App;

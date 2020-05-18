import React from 'react';
import './App.css';

import MainHeader from './components/main-header/main-header';
import SidePanelComponent from './components/side-panel/side-panel';
import MapComponent from './components/map-component/map-component';

function App() {
  return (
    <div className="App">
      <MainHeader />
      <div className="App-map-size">
        <MapComponent />
      </div>
      <SidePanelComponent />
    </div>
  );
}

export default App;

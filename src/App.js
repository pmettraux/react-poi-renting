import React from 'react';
import './App.css';

import MainHeader from './components/main-header/main-header';
import SidePanelComponent from './components/side-panel/side-panel';
import LeafletMapComponent from './components/map-component/map';

function App() {
  return (
    <div className="App">
      <MainHeader />
      <LeafletMapComponent/>
      <SidePanelComponent />
    </div>
  );
}

export default App;

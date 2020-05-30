import React from 'react';
import './App.css';

import MainHeader from './components/main-header/main-header';
import SidePanelComponent from './components/side-panel/side-panel';
import LeafletMapComponent from './components/map-component/map';
import Loading from './components/loading/loading';
import { useAuth0 } from './shared/react-auth0-spa';

function App() {

  // console.log('useAuth0', useAuth0());

  let {
    loading,
  } = useAuth0();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <MainHeader />
      <LeafletMapComponent/>
      <SidePanelComponent />
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import './App.css';
import FormDialog from './components/manage-poi/poi-modal/poi-modal';
import MainHeader from './components/main-header/main-header';
import SidePanelComponent from './components/side-panel/side-panel';
import LeafletMapComponent from './components/map-component/map';
import Loading from './components/loading/loading';
import { useAuth0 } from './shared/react-auth0-spa';
import { getPois } from './shared/api.service';


function App() {
  const [pois, setPois] = useState([]);
  const {
    loading,
    logout,
    getTokenSilently,
    loginWithRedirect,
    isAuthenticated,
    user,
  } = useAuth0();

  const getListPois = async() => {
    const results = await getPois(getTokenSilently, loginWithRedirect);
    const pois = results.data.map(poi => {
      return {
        key: poi.id,
        position: {
          lat: poi.lat,
          lng: poi.lng,
        },
        name: poi.name,
        description: poi.description,
        creatorId:  poi.Creator.id
      }
    });
    setPois(pois);
  }

  useEffect(() => {
    (async() => {
      if (!loading)
        getListPois();
    })()
  }, [loading])

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <MainHeader 
        logout={logout} 
        isAuthenticated={isAuthenticated} 
        loginWithRedirect={loginWithRedirect} 
      />
      <LeafletMapComponent 
        pois={pois}
        user={user}
        loginWithRedirect={loginWithRedirect} 
        getTokenSilently={getTokenSilently}
      />
      <SidePanelComponent />
      <FormDialog />
    </div>
  );
}

export default App;
